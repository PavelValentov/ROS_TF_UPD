const dgram = require('dgram');

// Connecting to ROS
// -----------------
const ros = new ROSLIB.Ros({
  // set this to false to use the new service interface to
  // tf2_web_republisher. true is the default and means roslibjs
  // will use the action interface
  groovyCompatibility: true
});

// If there is an error on the backend, an 'error' emit will be emitted.
ros.on('error', function(error) {
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('error').style.display = 'inline';
  console.log(error);
});

// Find out exactly when we made a connection.
ros.on('connection', function() {
  console.log('Connection made!');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('connected').style.display = 'inline';
});

ros.on('close', function() {
  console.log('Connection closed.');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'inline';
});

// Create a connection to the rosbridge WebSocket server.
ros.connect('ws://localhost:9090');

// TF Client
// ---------
const tfClient = new ROSLIB.TFClient({
  ros : ros,
  fixedFrame : 'world',
  angularThres : 0.01,
  transThres : 0.01
});
// Subscribing to a Topic
// ----------------------

const listener = new ROSLIB.Topic({
  ros : ros,
  name : '/listener',
  messageType : 'tf2_msgs/TFMessage'
});

listener.subscribe(function(message) {
  console.log('Received message on ' + listener.name + ': ' + message.data);
  listener.unsubscribe();
});

// Subscribe to a TF.

const client = dgram.createSocket('udp4');

Object.size = function(obj) {
  let size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

// Get the size of an object

tfClient.subscribe('body', function(tf) {
  console.log(tf);
  // const size = Object.size(tf);
  const JS = JSON.stringify(tf);
  const size = JS.length;
  client.send('Hello World!',0, size, 9988, '127.0.0.1');
});
