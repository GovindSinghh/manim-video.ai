#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0:any, connection:any) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1:any, channel:any) {
    if (error1) {
      throw error1;
    }
    var queue = 'task_queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, function(msg:any) {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    }, {
      // manual acknowledgment mode,
      // see /docs/confirms for details
      noAck: false
    });
  });
});