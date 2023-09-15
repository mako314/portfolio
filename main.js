import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";



if ( WebGL.isWebGLAvailable() ) {


    // 1 of 3 things required for all 3js apps,
	const scene = new THREE.Scene();

    // 2 of 3 things required for all 3js apps,
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );



    //Initializations
    let object;

    //OrbitControls (Navigation, allowing camera to move)
    let controls

    const loader = new GLTFLoader()
    loader.load(
        'public/attempt3.glb', function(gltf) {
            //If file is loaded, add to scene.
            object = gltf.scene;
            
            scene.add(object);
        },
        function(xhr) {
            //Loading progress logger
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function(error){
            console.error(error)
        }
    )

    //Instantiate a new renderer + set size
    const renderer = new THREE.WebGLRenderer({ alpha : true}); //Allowing transparent background with Alpha
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Add renderer to dom (was definitely forgetting this step earlier)
    document.getElementById("container").appendChild(renderer.domElement);

    //Can use a ternary to render the camera position wherever you'd like


    //LIGHTING
    const topLight = new THREE.DirectionalLight(0xffffff, 1) //Color - Intensity
    topLight.position.set(500,500,500) //Top left
    topLight.castShadow = true;

    scene.add(topLight)

    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight)

    //Render the scene 
    function animate(){
        requestAnimationFrame(animate);
        //Can add code here to update the scene, automatic movement etc
    }

    window.addEventListener("resize", function(){
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight)
    })

    //Start the rendering
    animate()


} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}