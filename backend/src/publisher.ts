var amqp = require('amqplib/callback_api');
export async function publishScript(id:number,script:string,sceneName:string):Promise<any> {
  try {

    amqp.connect('amqp://localhost', function(error0:any, connection:any) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(async function(error1:any, channel:any) {
        if (error1) {
          throw error1;
        }
        var queue = 'task_queue';
        
        // Create message object with script and scriptId from database
        const message = {
          script,
          scriptId: id.toString(),
          sceneName
        };

        channel.assertQueue(queue, {
          durable: true
        });

        // message object to string
        const msg = JSON.stringify(message);
        
        channel.sendToQueue(queue, Buffer.from(msg), {
          persistent: true
        });
        console.log(" [x] Sent script with ID:", message.scriptId);
      });
      setTimeout(function() {
        connection.close();
        process.exit(0)
      }, 500);
    });
  } catch (error) {
    console.error('Error publishing script:', error);
    process.exit(1);
  }
}