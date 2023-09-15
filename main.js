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
    
    const orbit = new OrbitControls(camera, renderer.domElement)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    
    // camera.position.z = 5;
    // camera.position.y = 2;
    //                 //x y z
    camera.position.set(0, 2 ,5 );
    //Changes position of camera. must come after camera.position.set
    orbit.update


    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color : 0x00FF00})
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    scene.add(box)

    box.rotation.x = 5;
    box.rotation.y = 5;

    function animate(){
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)




} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}