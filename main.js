import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';

import nebula from './src/nebula.jpg'
import stars from './src/stars.jpg'

if ( WebGL.isWebGLAvailable() ) {

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


    //Plan Box
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color : 0x00FF00})
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    scene.add(box)
    

    //Plane Instance
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    //Adds a grid, rotated plane to help
    const gridHelper = new THREE.GridHelper(30);
    scene.add(gridHelper)

    //Sphere Instance
    const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color : 0x0000FF,
        wireframe: false});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(-10, 10, 0);
    sphere.castShadow = true;
    

    //LIGHTING - STARTING WITH AMBIENT LIGHTING
    const ambientLight = new THREE.AmbientLight(0x333333)
    scene.add(ambientLight);
    

    //----------------------Directional Lighting, be cautious to the double commented (actual comments throughout the code, moving onto spotlight)------------
    // //LIGHTING - DIRECTIONAL THIS TIME
    // const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    // scene.add(directionalLight);
    // directionalLight.position.set(-30, 50 ,0);
    // //Have the directional list cast a shadow
    // directionalLight.castShadow = true;
    // //Position the bottom portion lower to properly capture balls shadow
    // directionalLight.shadow.camera.bottom = -12;


    // //dLightHelper                                  can change size of second square with this input after directional light
    // const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(dLightHelper);
    
    // //Help shadows out, otherwise you get cut off shadows on plane
    // //Makes 4 lines pointed towards the plane, indiciating where exactly shadows can occur.
    // const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(dLightShadowHelper)

    //-----------------------------------------Directional light ABOVE----------------------------------

    //----------------------Spotlight Lighting, be cautious to the double commented (actual comments throughout the code, moving onto spotlight)------------
    //Adding spotlight 
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    scene.add(spotLight)
    //The case seems to be you typically add it to the scene before doing any rotating / positioning
    spotLight.position.set(-100, 100, 0);
    //Cast shadow for spotlight
    spotLight.castShadow = true;

    //if the four segments that define the spots created by the light, if the angle is too wide, the shadows will get pixelated, hence we narrow the angle
    spotLight.angle = 0.2;

    const sLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(sLightHelper);

    //------------------------------------------Spotlight ABOVE-------------
    //START GUI, allows for changing the color in a controller based system in top right corner
    const gui = new dat.GUI();

    const options = {
        sphereColor: '#ffea00',
        wireframe: false,
        speed: 0.01,
        angle: 0.2,
        penumbra: 0,
        intensity: 1,
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
    // let speed = 0.01; 
    // MOVED TO GUI^^^

    gui.add(options, 'angle', 0, 0.1)
    gui.add(options, 'penumbra', 0, 1)
    gui.add(options, 'intensity', 0, 1)


    // box.rotation.x = 5;
    // box.rotation.y = 5;

    //How to create fog; first argument color, 2 others are the near and far limits of where the fog should be visible. So the further we get from 0 we get going backwards the denser the fog gets.  
    scene.fog = new THREE.Fog(0xFFFFFF, 0, 200)
    //This fogExp2 class takes 2 arguments, the color and the density. With this method the density of the fog grows exponentially with the distance of the camera
    scene.fog = new THREE.FogExp2()



    //Background coloring,
    renderer.setClearColor(0xFFFFFF)
    //Add texture to background
    const textureLoader = new THREE.TextureLoader();
    // scene.background = textureLoader.load(stars)

    //Making the scene a cube
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    scene.background = cubeTextureLoader.load([
        nebula,
        nebula,
        stars,
        stars,
        stars,
        stars
    ])

    const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
    const box2Material = new THREE.MeshBasicMaterial({
        color:0x00FF00,
        map: textureLoader.load(nebula)
    });
    const box2 = new THREE.Mesh(box2Geometry, box2Material);
    scene.add(box2)
    box2.position.set(0, 15, 10);






    //Animate boxrotation and other things with the spotLight
    function animate(){
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;


        step += options.speed;
        sphere.position.y = 10 * Math.abs(Math.sin(step));

        spotLight.angle = options.angle;
        spotLight.penumbra = options.penumbra
        spotLight.intensity = options.intensity
        //Every time you change the values of the lights properties you must call the update on the helper.
        sLightHelper.update()
        
        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)




} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}