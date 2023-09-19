import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';

import nebula from './img/nebula.jpg'
import stars from './img/stars.jpg'

if ( WebGL.isWebGLAvailable() ) {

    //THIS SETS UP THE URL FOR THE 3D MODEL, GOD BLESS AMERICA I FINALLY GOT IT TO DISPLAY
    const boardURL = new URL('./assets/largerBoard.glb', import.meta.url);

    const renderer = new THREE.WebGL1Renderer();
    //Calls shadow, basically enabling shadows throughout the application
    renderer.shadowMap.enabled = true;

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

    //Plane Instance
    const planeGeometry = new THREE.PlaneGeometry(60, 60);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    //Adds a grid, rotated plane to help
    const gridHelper = new THREE.GridHelper(60);
    scene.add(gridHelper)
    
    //LIGHTING - STARTING WITH AMBIENT LIGHTING
    const ambientLight = new THREE.AmbientLight(0x333333)
    scene.add(ambientLight);
    

    //----------------------Directional Lighting, be cautious to the double commented (actual comments throughout the code, moving onto spotlight)------------
    //LIGHTING - DIRECTIONAL THIS TIME
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(30, -50 ,0);
    //Have the directional list cast a shadow
    directionalLight.castShadow = true;
    //Position the bottom portion lower to properly capture balls shadow
    directionalLight.shadow.camera.bottom = -12;


    //dLightHelper                                  can change size of second square with this input after directional light
    const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(dLightHelper);
    
    //Help shadows out, otherwise you get cut off shadows on plane
    //Makes 4 lines pointed towards the plane, indiciating where exactly shadows can occur.
    const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(dLightShadowHelper)

    //-----------------------------------------Directional light ABOVE----------------------------------

    //----------------------Spotlight Lighting, be cautious to the double commented (actual comments throughout the code, moving onto spotlight)------------
    //Adding spotlight 
    // const spotLight = new THREE.SpotLight(0xFFFFFF);
    // scene.add(spotLight)
    // //The case seems to be you typically add it to the scene before doing any rotating / positioning
    // spotLight.position.set(50, 50, 0);
    // //Cast shadow for spotlight
    // spotLight.castShadow = true;

    

    // //if the four segments that define the spots created by the light, if the angle is too wide, the shadows will get pixelated, hence we narrow the angle
    // spotLight.angle = 0.2;

    // const sLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(sLightHelper);

    //------------------------------------------Spotlight ABOVE-------------
    //START GUI, allows for changing the color in a controller based system in top right corner
    const gui = new dat.GUI();

    //Background coloring,
    renderer.setClearColor(0xFFFFFF)
    //Add texture to background
    const textureLoader = new THREE.TextureLoader();
    // scene.background = textureLoader.load(stars)

    //Selecting objects from the scene
    const mousePosition = new THREE.Vector2();

    window.addEventListener('mousemove', function(e) {
        mousePosition.x = (e.clientX/ this.window.innerWidth) * 2 - 1;
        mousePosition.y = -(e.clientY / this.window.innerHeight) * 2 + 1;
    });

    //Would like raycaster active as it helps with intersect I believe

    const rayCaster = new THREE.Raycaster();

    //----------------------------------------------------------------------------------------------
    
    //-------------------------------------importing the 3d model--------------------------------------------

    const assetLoader = new GLTFLoader();

    assetLoader.load(boardURL.href, function(gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 10);
        spotLight.target.model
        
    }, undefined, function(error) {
       console.error(error)
    });
    
    
    //----------------------------------------------------------------------------------------------

    //Animate boxrotation and other things with the spotLight
    function animate(){
        rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children)
        console.log(intersects)

        // for(let i = 0; i < intersects.length; i++){
        //     if(intersects[i].object.id === sphereId)
        //         intersects[i].object.material.color.set(0xFF0000);
                
        //         //Give theBox named object a rotation
        //     if(intersects[i].object.name === 'theBox'){
        //         intersects[i].object.rotation.x += 0.01;
        //         intersects[i].object.rotation.y += 0.01;
        //     }
        // }

        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)




} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}