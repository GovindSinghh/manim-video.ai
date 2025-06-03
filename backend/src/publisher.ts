const amqp = require('amqplib/callback_api');
import { v4 as uuidv4 } from 'uuid';

export async function publishScript(id:number, script:string, sceneName:string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      amqp.connect('amqp://admin:admin123@localhost:5672', function(error0:any, connection:any) {
        if (error0) {
          reject(error0);
          return;
        }
        
        connection.createChannel(function(error1:any, channel:any) {
          if (error1) {
            reject(error1);
            return;
          }
          
          const taskQueue = 'task_queue';
          const correlationId = uuidv4();
          const responseQueue = `response_queue_${correlationId}`;
          
          // Create message object with script and scriptId from database
          const message = {
            script,
            scriptId: id.toString(),
            sceneName,
            correlationId
          };

          // Assert task queue
          channel.assertQueue(taskQueue, {
            durable: true
          });

          // Assert unique response queue for this request
          channel.assertQueue(responseQueue, {
            durable: true,
            autoDelete: true
          });

          // message object to string
          const msg = JSON.stringify(message);
          
          // Send message to task queue
          channel.sendToQueue(taskQueue, Buffer.from(msg), {
            persistent: true,
            correlationId: correlationId,
            replyTo: responseQueue
          });
          console.log(" [x] Sent script with ID:", message.scriptId);
          
          console.log(" [*] Waiting for response message from worker in ", responseQueue);
          
          // Set a timeout for the response
          const timeout = setTimeout(() => {
            channel.cancel(consumerTag);
            channel.deleteQueue(responseQueue);
            connection.close();
            reject(new Error('Timeout waiting for worker response'));
          }, 300000); // 5 minute timeout

          // Store the consumer tag
          let consumerTag: string;
          
          // Create consumer with tag
          channel.consume(responseQueue, function(responseData:any) {
            if (responseData.properties.correlationId === correlationId) {
              console.log("Received the message from Worker");
              try {
                let responseMessage = JSON.parse(responseData.content.toString());
                channel.ack(responseData);
                clearTimeout(timeout);
                channel.cancel(consumerTag);
                channel.deleteQueue(responseQueue);
                connection.close();
                resolve(responseMessage);
              } catch (error) {
                clearTimeout(timeout);
                channel.cancel(consumerTag);
                channel.deleteQueue(responseQueue);
                connection.close();
                reject(new Error('Invalid response format from worker'));
              }
            }
          }, {
            noAck: false // Enable manual acknowledgment
          }, function(err:any, ok:any) {
            if (err) {
              clearTimeout(timeout);
              channel.deleteQueue(responseQueue);
              connection.close();
              reject(err);
              return;
            }
            consumerTag = ok.consumerTag;
          });
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}