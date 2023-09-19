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
    
    //                 //x y z
    // camera.position.set(15, 15 ,30 );

    //Changes position of camera. must come after camera.position.set
    // orbit.update

    //Plane Instance
    const planeGeometry = new THREE.PlaneGeometry(60, 60);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    
    scene.add(plane);
    plane.position.set(0, 0 , 0)

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
    directionalLight.position.set(30, 50 ,0);
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
    //START GUI, allows for changing the color in a controller based system in top right corner
    // const gui = new dat.GUI();

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
        const noticeBoard = gltf.scene;
        scene.add(noticeBoard);
        noticeBoard.position.set(0, 0, 10);
        // spotLight.target.noticeBoard

        // Set the camera to look at the noticeBoard
        console.log('noticeBoard Position:', noticeBoard.position);


        let noticeBoardCenter = new THREE.Box3().setFromObject( noticeBoard );
        noticeBoardCenter.getCenter( noticeBoard.position ); // this re-sets the noticeBoard position
        noticeBoard.position.multiplyScalar( - 1 );

        let pivot = new THREE.Group();
        scene.add( pivot );
        pivot.add( noticeBoard );

        // noticeBoard.center()
        noticeBoard.position.set(0,0,0)
        noticeBoard.rotation.y += 200

        camera.position.set(15, 20 ,50 );
        camera.lookAt(noticeBoard.position);
        
    }, undefined, function(error) {
       console.error(error)
    });
    
    
    //----------------------------------------------------------------------------------------------

    //Animate boxrotation and other things with the spotLight
    function animate(){
        rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children)
        // console.log(intersects)

        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)
    console.log('Camera Position:', camera.position);
    




} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}