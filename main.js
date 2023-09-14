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

    //LIGHTING//
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );


    camera.position.set( 0, 20, 100 );

    // renderer.setClearColor(0xffffff); // Set a white clear color


    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    const loader = new GLTFLoader();

    loader.load( 'public/attempt3.glb', function ( gltf ) {

        const model = gltf.scene

        model.position.setX(0);
        model.position.setY(0);
        model.position.setZ(0);

        scene.add( model );



    }, undefined, function ( error ) {

        console.error( error );

    } );

	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}