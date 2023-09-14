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
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
    directionalLight.position.set(0, 1, 0); // Move the light closer to the model
    scene.add( directionalLight );

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cubeMesh);


    camera.position.set( 0, 0, 30 );

    // renderer.setClearColor(0xffffff); // Set a white clear color


    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    const loader = new GLTFLoader();

    loader.load( 'public/attempt3.glb', function ( gltf ) {

        const model = gltf.scene

        model.scale.set(0.1,0.1,0.1)
        model.position.set(0,0,0);

        scene.add( model );



    }, undefined, function ( error ) {

        console.error( error );

    } );

	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}