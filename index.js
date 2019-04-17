const Quaternion = require('quaternion');
const dgram = require('dgram');
const ROSLIB = require('roslib');
const OSC = require('osc-js');

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
  // document.getElementById('connecting').style.display = 'none';
  // document.getElementById('connected').style.display = 'none';
  // document.getElementById('closed').style.display = 'none';
  // document.getElementById('error').style.display = 'inline';
  console.log(error);
});

// Find out exactly when we made a connection.
ros.on('connection', function() {
  console.log('Connection made!');
  // document.getElementById('connecting').style.display = 'none';
  // document.getElementById('error').style.display = 'none';
  // document.getElementById('closed').style.display = 'none';
  // document.getElementById('connected').style.display = 'inline';
});

ros.on('close', function() {
  console.log('Connection closed.');
  // document.getElementById('connecting').style.display = 'none';
  // document.getElementById('connected').style.display = 'none';
  // document.getElementById('closed').style.display = 'inline';
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

function roughSizeOfObject( object ) {

  var objectList = [];
  var stack = [ object ];
  var bytes = 0;

  while ( stack.length ) {
    var value = stack.pop();

    if ( typeof value === 'boolean' ) {
      bytes += 4;
    }
    else if ( typeof value === 'string' ) {
      bytes += value.length * 2;
    }
    else if ( typeof value === 'number' ) {
      bytes += 8;
    }
    else if
    (
      typeof value === 'object'
      && objectList.indexOf( value ) === -1
    )
    {
      objectList.push( value );

      for( var i in value ) {
        stack.push( value[ i ] );
      }
    }
  }
  return bytes;
}


tfClient.subscribe('body', function(tf) {
  // console.log(tf);
  // const size = roughSizeOfObject(tf);
  // console.log(typeof tf === 'object', size);
  const JS = JSON.stringify(tf);
  const size = JS.length;
  console.log(JS);
  console.log(typeof tf === 'object', size);
//  client.send(JS,0, size, 8888, '192.168.77.40');
// client.send(JS,0, size, 8888, '192.168.77.20');


  if (typeof tf === 'object' && tf.hasOwnProperty('rotation')) {
    const rotation = new Quaternion(tf.rotation);
    rotation.from
    console.log('Quaternion ', rotation);

    // TRANSLATION
    let osc = new OSC();
    let message = new OSC.Message('/translation/x', tf.translation.x, 'x');
    // osc.send(message);
    let binary = message.pack()
    client.send(new Buffer(binary), 0, binary.byteLength, 4444, '192.168.77.18');

    osc = new OSC();
    message = new OSC.Message('/translation/y', tf.translation.y, 'y');
    // osc.send(message);
    binary = message.pack()
    client.send(new Buffer(binary), 0, binary.byteLength, 4444, '192.168.77.18');

    osc = new OSC();
    message = new OSC.Message('/translation/z', tf.translation.z, 'z');
    // osc.send(message);
    binary = message.pack()
    client.send(new Buffer(binary), 0, binary.byteLength, 4444, '192.168.77.18');



    //   ROTATION
    osc = new OSC();
    message = new OSC.Message('/rotation/w', tf.rotation.w, 'w');
    binary = message.pack()
    client.send(new Buffer(binary), 0, binary.byteLength, 4444, '192.168.77.18');

    osc = new OSC();
    message = new OSC.Message('/rotation/x', tf.rotation.x, 'x');
    binary = message.pack()
    client.send(new Buffer(binary), 0, binary.byteLength, 4444, '192.168.77.18');

    osc = new OSC();
    message = new OSC.Message('/rotation/y', tf.rotation.y, 'y');
    binary = message.pack()
    client.send(new Buffer(binary), 0, binary.byteLength, 4444, '192.168.77.18');

    osc = new OSC();
    message = new OSC.Message('/rotation/z', tf.rotation.z, 'z');
    binary = message.pack()
    client.send(new Buffer(binary), 0, binary.byteLength, 4444, '192.168.77.18');


  }
  // client.send(tf,0, size, 8888, '192.168.77.255');
});
