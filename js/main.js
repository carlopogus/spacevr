function Space(options){

  var scope = this;
  var defaults = {vr: false};
  var options = options || defaults;
  var camera, scene, renderer, controls, nodeControls, space, earth, vr;
  var WIDTH, HEIGHT;
  var clock = new THREE.Clock();

  // Enable all of the things.
  this.init = function () {
    scope.WIDTH = window.innerWidth;
    scope.HEIGHT = window.innerHeight;
    setScene();
    setCamera();
    setControls();
    setLight();
    setStars();
    setEarth();
    animate();
    window.addEventListener('resize', onResize, false);
  }

  // Our loop.
  var animate = function () {
    requestAnimationFrame(animate);

    scope.earth.rotation.y -= 0.0005;
    scope.space.rotation.y -= 0.00005;
    scope.space.rotation.x -= 0.00005;

    if (options.vr) {
      scope.vr.render( scope.scene, scope.camera );
    }
    else {
      scope.renderer.render(scope.scene, scope.camera);
    }

    scope.controls.update();
    var delta = clock.getDelta();
    // console.log(delta);
    scope.nodeControls.update(delta);
  }

  // Update on resize.
  var onResize = function () {
    scope.WIDTH = window.innerWidth,
    scope.HEIGHT = window.innerHeight;
    scope.renderer.setSize(scope.WIDTH, scope.HEIGHT);
    scope.camera.aspect = scope.WIDTH / scope.HEIGHT;
    scope.camera.updateProjectionMatrix();
    scope.vr.setSize( window.innerWidth, window.innerHeight );
  }

  // Create the three.js sceen and renderer, append canvas to body element.
  var setScene = function () {
    scope.scene = new THREE.Scene();
    scope.renderer = new THREE.WebGLRenderer({antialias:true});
    scope.renderer.setSize(scope.WIDTH, scope.HEIGHT);
    document.body.appendChild(scope.renderer.domElement);
    scope.renderer.setClearColor(new THREE.Color("rgb(0, 0, 0)"));

    if (options.vr) {
      scope.vr = new THREE.StereoEffect( scope.renderer );
      scope.vr.setSize( window.innerWidth, window.innerHeight );
    }
  }

  // Set up the camera and position.
  var setCamera = function () {
    scope.camera = new THREE.PerspectiveCamera(45, scope.WIDTH / scope.HEIGHT, 0.1, 20000);
    scope.camera.position.set(0, 0, 20);
    scope.scene.add(scope.camera);
  }

  // Set some light.
  var setLight = function () {
    scope.light = new THREE.PointLight(0xffffff);
    scope.light.position.set(-100,200,100);
    scope.scene.add(scope.light);
  }

  // Create out sphere with star texture.
  var setStars = function () {
    var geometry  = new THREE.SphereGeometry(500, 32, 32);
    var material  = new THREE.MeshBasicMaterial();
    var texture =  THREE.ImageUtils.loadTexture("images/stars.png", {}, function(){});
    material.map = texture;
    material.side  = THREE.BackSide;
    scope.space  = new THREE.Mesh(geometry, material);
    scope.scene.add(scope.space);
  }

  var setEarth = function () {
    var bmap =  THREE.ImageUtils.loadTexture("images/earth-bump.jpg", {}, function(){});
    var texture =  THREE.ImageUtils.loadTexture("images/earth.jpg", {}, function(){});
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshPhongMaterial({
      map: texture,
      bumpMap: bmap,
      bumpScale: 0.01
    });
    scope.earth = new THREE.Mesh( geometry, material );
    scope.earth.position.set(0, 0, 0);
    scope.scene.add(scope.earth);
  }

  // Setup the device orientation controls.
  var setControls = function () {
    scope.controls = new THREE.DeviceOrientationControls(scope.camera);
    scope.nodeControls = new THREE.NodeFlyControls(scope.camera, options.nodeSocket);
  }
}

// node js stuffs.
(function () {
  var clientId = document.createElement("div");
  clientId.setAttribute("id", 'client-id');
  document.body.appendChild(clientId);

  var socket = io.connect();

  socket.on('connect', function() {
    var room = socket.id;
    room = 'test';
    var div = document.getElementById('client-id');
    div.innerHTML = room;
    socket.emit('room', room);
  });

  // socket.on('incomming-keys', function (data) {
  //   console.log(data);
  // });


  var space = new Space({vr: true, nodeSocket: socket});
  space.init();


})();

