import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";





if ( WebGL.isWebGLAvailable() ) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // camera.position.z = 15;


    //Camera positoning and controls
    camera.position.set(500, 500, 500);
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    }

    controls.update();
    

    /// lighting ///
    const light = new THREE.AmbientLight(0xffaaff);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Loads the model I imported
    const loader = new GLTFLoader();

    loader.load( 'public/attempt3.glb', function ( gltf ) {

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    renderer.render(scene, camera);
    

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}