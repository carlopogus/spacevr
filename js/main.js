
function Space(options){

  var scope = this;
  var defaults = {vr: false};
  var options = options || defaults;
  var camera, scene, renderer, controls, space, earth, vr;
  var WIDTH, HEIGHT;

  console.log(options);

  // Enable all of the things.
  this.init = function () {
    scope.WIDTH = window.innerWidth;
    scope.HEIGHT = window.innerHeight;
    setScene();
    setCamera();
    setControls();
    setLight();
    animate();
    setStars();
    window.addEventListener('resize', onResize, false);
  }

  // Our loop.
  var animate = function () {
    requestAnimationFrame(animate);
    if (options.vr) {
      scope.vr.render( scope.scene, scope.camera );
    }
    else {
      scope.renderer.render(scope.scene, scope.camera);
    }
    scope.controls.update();
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
    scope.camera.position.set(0, 0, 200);
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
    material.map   = THREE.ImageUtils.loadTexture('images/stars.png');
    material.side  = THREE.BackSide;
    scope.space  = new THREE.Mesh(geometry, material);
    scope.scene.add(scope.space);
  }

  // Setup the device orientation controls.
  var setControls = function () {
    scope.controls = new THREE.DeviceOrientationControls(scope.camera);
  }
}

var space = new Space({vr: true});
space.init();
