import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";



if ( WebGL.isWebGLAvailable() ) {

    const renderer = new THREE.WebGL1Renderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement)


    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );


    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    camera.position.z = 5;
    

    renderer.render(scene, camera)




} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}