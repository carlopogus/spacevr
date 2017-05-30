THREE.NodeFlyControls = function ( object, socket, domElement ) {

  var self = this;

  this.object = object;

  this.domElement = ( domElement !== undefined ) ? domElement : document;
  if ( domElement ) this.domElement.setAttribute( 'tabindex', - 1 );

  // API

  this.movementSpeed = 10;
  this.rollSpeed = 0.005;

  this.dragToLook = false;
  this.autoForward = false;

  // disable default target object behavior

  // internals

  this.tmpQuaternion = new THREE.Quaternion();

  this.mouseStatus = 0;

  this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
  this.moveVector = new THREE.Vector3( 0, 0, 0 );
  this.rotationVector = new THREE.Vector3( 0, 0, 0 );

  socket.on('incomming-keys', function (data) {

    for (var key in data) {
      switch (key) {
        case 'up': self.moveState.forward  = data[key]; break;
        case 'down': self.moveState.back = data[key]; break;
        case 'left': self.moveState.left = data[key]; break;
        case 'right': self.moveState.right = data[key]; break;
      }
    }

    self.updateMovementVector();
    self.updateRotationVector();
  });

  this.handleEvent = function ( event ) {
    if ( typeof this[ event.type ] == 'function' ) {
      this[ event.type ]( event );
    }
  };

  this.update = function( delta ) {
    var moveMult = delta * this.movementSpeed;
    var rotMult = delta * this.rollSpeed;

    this.object.translateX( this.moveVector.x * moveMult );
    this.object.translateY( this.moveVector.y * moveMult );
    this.object.translateZ( this.moveVector.z * moveMult );

    this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
    this.object.quaternion.multiply( this.tmpQuaternion );

    // expose the rotation vector for convenience
    this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );
  };

  this.updateMovementVector = function() {
    var forward = ( this.moveState.forward || ( this.autoForward && ! this.moveState.back ) ) ? 1 : 0;
    this.moveVector.x = ( - this.moveState.left    + this.moveState.right );
    this.moveVector.y = ( - this.moveState.down    + this.moveState.up );
    this.moveVector.z = ( - forward + this.moveState.back );
  };

  this.updateRotationVector = function() {
    this.rotationVector.x = ( - this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.y = ( - this.moveState.yawRight  + this.moveState.yawLeft );
    this.rotationVector.z = ( - this.moveState.rollRight + this.moveState.rollLeft );
  };

  this.updateMovementVector();
  this.updateRotationVector();

};
