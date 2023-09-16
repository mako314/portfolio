import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';


if ( WebGL.isWebGLAvailable() ) {

    const renderer = new THREE.WebGL1Renderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement)


    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    const orbit = new OrbitControls(camera, renderer.domElement)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    
    // camera.position.z = 5;
    // camera.position.y = 2;

    //                 //x y z
    camera.position.set(-10, 30 ,30 );

    //Changes position of camera. must come after camera.position.set
    orbit.update


    //Plan Box
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color : 0x00FF00})
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    scene.add(box)
    

    //Plane Instance
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    //Adds a grid, rotated plane to help
    const gridHelper = new THREE.GridHelper(30);
    scene.add(gridHelper)

    //Sphere Instance
    const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color : 0x0000FF,
        wireframe: false});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    sphere.position.set(-10, 10, 0);
    
    //START GUI, allows for changing the color in a controller based system in top right corner
    const gui = new dat.GUI();

    const options = {
        sphereColor: '#ffea00',
        wireframe: false,
        speed: 0.01
    };
    //Call options, then key inside as a STRING. This one changes the color
    gui.addColor(options, 'sphereColor').onChange(function(e){
        sphere.material.color.set(e)
    });
    //Call options, key inside (wireframe) as a STRING. This one is a toggle for wireframing
    gui.add(options, 'wireframe').onChange(function(e){
        sphere.material.wireframe = e;
    });
    //Call options, key inside (speed) as a STRING, the 1st value, 0 is the minimum, while 0.1 is the maximum.
    gui.add(options, 'speed', 0, 0.1)

    let step = 0;
    // let speed = 0.01; MOVED TO GUI




    // box.rotation.x = 5;
    // box.rotation.y = 5;
    

    //Animate boxrotation
    function animate(){
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;


        step += options.speed;
        sphere.position.y = 10 * Math.abs(Math.sin(step));

        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)




} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}