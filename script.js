      import { SphereGeometry } from "three";
      import * as THREE from "/node_modules/three/build/three.module.js";
      import {OrbitControls} from "OrbitControls"
      import {FirstPersonControls} from '/node_modules/three/examples/jsm/controls/FirstPersonControls.js'
      import {FlyControls} from '/node_modules/three/examples/jsm/controls/FlyControls.js'
      import * as CANNON from '/node_modules/cannon-es/dist/cannon-es.js'
      import   {GUI} from './node_modules/dat.gui/build/dat.gui.module.js'
      import  dat from "/node_modules/dat.gui/build/dat.gui.module.js";
      import  Rocket from './physics/rocket.js'
      import  vector from './physics/vector.js'
      import  World from './physics/world.js'
      import  params from './physics/params.js'
      import { Vector3 } from "/node_modules/three/build/three.module.js";


      
      //const world = new CANNON.World()

//Load background texture
const loader = new THREE.TextureLoader();
loader.load('./photo/aaaa.jpg' , function(texture)
            {
             scene.background = texture;  
            });
      const scene = new THREE.Scene();
      const sizes={
          width: window.innerWidth,
          height: window.innerHeight
      }
      const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)


      /*
          Variables
      */
      const gui = new dat.GUI();
      gui.close();
      let argument = window.matchMedia("(max-width: 425px)");
      let fun = (argument) => {
        if (argument.matches) {
          gui.width = 150;
        } else {
          gui.width = 250;
        }
      };
      fun(argument);
      argument.addListener(fun);
      const rocketfolder = gui.addFolder("rocket");
      const worldfolder = gui.addFolder("world");
      

      worldfolder.open();
      rocketfolder.open();
      let isClicked = false;
      const size = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const mouse = new THREE.Vector2();
      const cannonDirection = new THREE.Vector3();
      //const scene = new THREE.Scene();
      const GRAVITY = 9.8;
      const HEIGHT = 0,
        TEMPERETURE = 15; // celsius
      const WIND_SPEED = 10,
        WIND_ANGLE = Math.PI / 2;

      /*
          Paramters
      */
      const paramters = {
        windSpeed: 10,
        windAngle: Math.PI / 2,
        angular_speedX: 0,
        angular_speedY: 1,
        angular_speedZ: 0,
        axesHelper: false,
        radius: 0.5,
        gravity: 9.8,
        dragCoeff: 0.47,
        height: 0,
        tempereture: 15,
        resistanseCoeff: 0.8,
        frictionCoeff: 0.8,
        speed: 20,
        type: 0,
        types:{
        default() {
          paramters.type = 0;
        // paramters.rocket1Textures = rocket1Textures[0];
          coefficientsFolder.show();
          massController.domElement.hidden = false;
        },
        ionic() {
          paramters.type = 1;
        // paramters.rocket2Textures = rocket2Textures[1];
          coefficientsFolder.hide();
          massController.domElement.hidden = true;
        },
        ballistic() {
          paramters.type = 2;
        // paramters.rocket3Textures = rocket3Textures[0];
          coefficientsFolder.hide();
          massController.domElement.hidden = true;
        },
        jet() {
          paramters.type = 3;
          //paramters.rocket4Textures = rocket4Textures[2];
          coefficientsFolder.hide();
          massController.domElement.hidden = true;
        },

        },
      };


      //مكعب
      const geometry = new THREE.BoxGeometry(1,1,1)
      const material = new THREE.MeshBasicMaterial({color:0xff0000})
      const cube = new THREE.Mesh(geometry,material)
      cube.position.set(0,2,1)
      scene.add(cube)


      //camera.position.set(0,-2,2)
      const axes = new THREE.AxesHelper(10)
      scene.add(axes)
      scene.add(camera)
      const canvas = document.querySelector('.webgl')


      const renderer = new THREE.WebGLRenderer({
          canvas:canvas
      })

      renderer.setSize(sizes.width,sizes.height)

      renderer.render(scene,camera)

      const cursor = {
          x: 0,
          y: 0
      }
      window.addEventListener('mousemove',(event)=>{
          cursor.x = event.clientX / sizes.width - 0.5
          cursor.y = -(event.clientY / sizes.height - 0.5)
      })


      /*
          Configure Pysics World
      */

      const world = new World(GRAVITY, HEIGHT, TEMPERETURE, WIND_SPEED, WIND_ANGLE);

        rocketfolder.add(params, "massfuel", 100, 3000, 10).name("rocket massfuel");
        rocketfolder.add(params, "dtmass", 1, 100, 0.1).name("rocket dtmass");
        rocketfolder.add(params, "mass", 1000, 6000, 10).name("rocket mass");
       
      const subFolder = rocketfolder.addFolder("types");
      subFolder.add(paramters.types, "default");
      subFolder.add(paramters.types, "ionic");
      subFolder.add(paramters.types, "ballistic");
      subFolder.add(paramters.types, "jet");
      subFolder.open();

      // coefficientsFolder.hide();

      worldfolder
        .add(paramters, "gravity", -10, 100, 0.1)
        .name("gravity")
        .onChange(() => {
          world.gravity = paramters.gravity;
        });

      worldfolder
        .add(paramters, "windSpeed", 0, 100, 0.01)
        .name("Wind Speed")
        .onChange(() => {
          world.wind_speed = paramters.windSpeed;
        });
      worldfolder
        .add(paramters, "windAngle", 0, 6.2831853072, 0.2)
        .name("Wind Angle")
        .onChange(() => {
          world.wind_angle = paramters.windAngle;
          rotateAboutPoint(
            flag,
            flagBase.position,
            new THREE.Vector3(0, 1, 0),
            paramters.windAngle
          );
        });
      worldfolder
        .add(paramters, "height", -100, 1000, 10)
        .name("Height")
        .onChange(() => {
          world.height = paramters.height;
        });

      worldfolder
        .add(paramters, "tempereture", -100, 100, 1)
        .name("Tempereture")
        .onChange(() => {
          world.tempereture = paramters.tempereture;
        });

      /* 
          Tweak gui values
      */
      
      
      
        

      const texture = new THREE.TextureLoader().load( './photo/aaaaaa.webp' );
      const texture111 = new THREE.TextureLoader().load( './photo/aaaaaa.webp' );
      const texture1111 = new THREE.TextureLoader().load( './photo/mmm.jpg' );
      const wall1texture = new THREE.TextureLoader().load( './static/textures/wall2.jpg' );
      const wall2texture = new THREE.TextureLoader().load( './static/textures/wall5.jpg' );
      const edge1texture = new THREE.TextureLoader().load( './static/textures/wall6.jpg' );
      const doortexture = new THREE.TextureLoader().load( './static/textures/1.jpg' );
      const bodytexture = new THREE.TextureLoader().load( './static/textures/rocketBase3.jpg' );
      const body2texture = new THREE.TextureLoader().load( './static/textures/rocketBase4.jpg' );
      const headtexture = new THREE.TextureLoader().load( './static/textures/rocketBase.jpg' );
      const head2texture = new THREE.TextureLoader().load( './static/textures/head2.jpg' );

      const rooftexture = new THREE.TextureLoader().load( './static/textures/wall4.jpg' );
      //الأحمر x 
      //الأخضر y
      //الأزرق Z


    //base
      const base = new THREE.Group()
      const landGeometry = new THREE.PlaneGeometry( 300, 250, );
      const landMaterial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,map:texture} );
      const land = new THREE.Mesh( landGeometry, landMaterial );
      land.position.set(0,0,0.5)
      scene.add(land);

      const base1 = new THREE.Group()
      const landGeometry1 = new THREE.PlaneGeometry( 300, 200, );
      const landMaterial1 = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,map:texture} );
      const land1 = new THREE.Mesh( landGeometry1, landMaterial1 );
      land1.position.set(0,100,100)
      land1.rotation.x = Math.PI / 2;
      scene.add(land1);

      const base2 = new THREE.Group()
      const landGeometry2 = new THREE.PlaneGeometry( 300, 200, );
      const landMaterial2 = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,map:texture1111} );
      const land2 = new THREE.Mesh( landGeometry2, landMaterial2 );
      land2.position.set(0,100,1250)
      land2.rotation.x = Math.PI / 2;
      scene.add(land2);
      
      

      const capsuleGeometry = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
      const capsuleMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      const capsule = new THREE.Mesh( capsuleGeometry, capsuleMaterial );
      //scene.add( capsule );






      const ly1geometry = new THREE.BoxGeometry( 25, 25, 3 );
      const ly1smaterial = new THREE.MeshBasicMaterial( {map:edge1texture} );
      const ly1 = new THREE.Mesh( ly1geometry, ly1smaterial );
      ly1.position.set(0,0,8)
      base.add(ly1)
// ////ffffffff
      const ly2geometry = new THREE.BoxGeometry( 26, 26, 3 );
      const ly2smaterial = new THREE.MeshBasicMaterial( {map:wall2texture} );
      const ly2 = new THREE.Mesh( ly2geometry, ly2smaterial );
      ly2.position.set(0,0,11)
      base.add(ly2)




/////////////قاعدة الصاؤرووووووخ
      const rocketBasegeometry = new THREE.BoxGeometry(3,3,6);
      const rocketBasematerial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide,map:doortexture} );
      const rocketBase1 = new THREE.Mesh( rocketBasegeometry, rocketBasematerial );
      rocketBase1.position.set(9,-9,3.52)
      base.add( rocketBase1 );


      const rocketBase2 = new THREE.Mesh( rocketBasegeometry, rocketBasematerial );
      rocketBase2.position.set(-9,-9,3.52)
      base.add( rocketBase2 );


      const rocketBase3 = new THREE.Mesh( rocketBasegeometry, rocketBasematerial );
      rocketBase3.position.set(9,9,3.52)
      base.add( rocketBase3 );


      const rocketBase4 = new THREE.Mesh( rocketBasegeometry, rocketBasematerial );
      rocketBase4.position.set(-9,9,3.52)
      base.add( rocketBase4 );
      base.position.set(0,50,0)
      scene.add(base)




      const rocket1 = new THREE.Group()
      const rocket1Bodytexture = new THREE.TextureLoader().load( './static/textures/rocket1Body.jpg' );
      const rocket1BodyRLtexture = new THREE.TextureLoader().load( './static/textures/head2.jpg' );
      const rocket1Head1texture = new THREE.TextureLoader().load( './static/textures/head3.jpg' );
      const pushtexture = new THREE.TextureLoader().load( './static/textures/push.jpg' );

      const cylinderBodyR1geometry = new THREE.CylinderGeometry( 1.8, 1.8, 15, 32 ,10 , false );
      const cylinderBodyR1material = new THREE.MeshBasicMaterial( {map: rocket1Bodytexture} );
      const cylinderBodyR1 = new THREE.Mesh( cylinderBodyR1geometry, cylinderBodyR1material );
      cylinderBodyR1.position.set(0,0,16)
      cylinderBodyR1.rotation.x = 1.57
      rocket1.add( cylinderBodyR1 );


      const cylinderBody2R1geometry = new THREE.CylinderGeometry( 1.8, 1.5, 4, 32 ,10 , false );
      const cylinderBody2R1material = new THREE.MeshBasicMaterial( {map : headtexture} );
      const cylinderBody2R1 = new THREE.Mesh( cylinderBody2R1geometry, cylinderBody2R1material );
      cylinderBody2R1.position.set(0,0,6.5)
      cylinderBody2R1.rotation.x = 1.57
      rocket1.add( cylinderBody2R1 );

      const cylinderBody3R1geometry = new THREE.CylinderGeometry( 1, 1.8, 3, 32 ,10 , false );
      const cylinderBody3R1material = new THREE.MeshBasicMaterial( {map: rocket1Bodytexture} );
      const cylinderBody3R1 = new THREE.Mesh( cylinderBody3R1geometry, cylinderBody3R1material );
      cylinderBody3R1.position.set(0,0,25)
      cylinderBody3R1.rotation.x = 1.57
      rocket1.add( cylinderBody3R1 );

      const cylinderBody4R1geometry = new THREE.CylinderGeometry( 1, 1, 3, 32 ,10 , false );
      const cylinderBody4R1material = new THREE.MeshBasicMaterial( {map : rocket1Head1texture} );
      const cylinderBody4R1 = new THREE.Mesh( cylinderBody4R1geometry, cylinderBody4R1material );
      cylinderBody4R1.position.set(0,0,28)
      cylinderBody4R1.rotation.x = 1.57
      rocket1.add( cylinderBody4R1 );

      const cylinderBody5R1geometry = new THREE.CylinderGeometry( 0.5, 1, 1.5, 32 ,10 , false );
      const cylinderBody5R1material = new THREE.MeshBasicMaterial( {map : rocket1Head1texture} );
      const cylinderBody5R1 = new THREE.Mesh( cylinderBody5R1geometry, cylinderBody5R1material );
      cylinderBody5R1.position.set(0,0,30.3)
      cylinderBody5R1.rotation.x = 1.57
      rocket1.add( cylinderBody5R1 );


      const cylinderBody6R1geometry = new THREE.CylinderGeometry( 0, 0.5, 3, 32 ,10 , false );
      const cylinderBody6R1material = new THREE.MeshBasicMaterial( {map : headtexture} );
      const cylinderBody6R1 = new THREE.Mesh( cylinderBody6R1geometry, cylinderBody6R1material );
      cylinderBody6R1.position.set(0,0,32.5)
      cylinderBody6R1.rotation.x = 1.57
      rocket1.add( cylinderBody6R1 );

      const cylinderR1geometryR = new THREE.CylinderGeometry( 1, 1, 15, 32 ,10 , false );
      const cylinderR1materialR = new THREE.MeshBasicMaterial( {map:rocket1BodyRLtexture} );
      const cylinderR1R = new THREE.Mesh( cylinderR1geometryR, cylinderR1materialR );
      cylinderR1R.position.set(3,0,13)
      cylinderR1R.rotation.x = 1.57
      rocket1.add( cylinderR1R );


      const cylinderR1geometryR2 = new THREE.CylinderGeometry( 0.2, 1, 2, 32 ,10 , false );
      const cylinderR1materialR2 = new THREE.MeshBasicMaterial( {map: rocket1Bodytexture} );
      const cylinderR1R2 = new THREE.Mesh( cylinderR1geometryR2, cylinderR1materialR2 );
      cylinderR1R2.position.set(3,0,21.5)
      cylinderR1R2.rotation.x = 1.57
      rocket1.add( cylinderR1R2 );


      const cylinderR1geometryR3 = new THREE.CylinderGeometry( 1, 1.8,2, 32 ,10 , false );
      const cylinderR1materialR3 = new THREE.MeshBasicMaterial( {map: rocket1Bodytexture} );
      const cylinderR1R3 = new THREE.Mesh( cylinderR1geometryR3, cylinderR1materialR3 );
      cylinderR1R3.position.set(3,0,4.5)
      cylinderR1R3.rotation.x = 1.57
      rocket1.add( cylinderR1R3 );

      const cylinderR1geometryR4 = new THREE.CylinderGeometry( 1, 1.5,1.5, 32 ,10 , false );
      const cylinderR1materialR4 = new THREE.MeshBasicMaterial( {map:pushtexture} );
      const cylinderR1R4 = new THREE.Mesh( cylinderR1geometryR4, cylinderR1materialR4 );
      cylinderR1R4.position.set(3,0,2.8)
      cylinderR1R4.rotation.x = 1.57
      rocket1.add( cylinderR1R4 );


      const cylinderR1geometryL = new THREE.CylinderGeometry( 1, 1, 15, 32 ,10 , false );
      const cylinderR1materialL = new THREE.MeshBasicMaterial( {map:rocket1BodyRLtexture} );
      const cylinderR1L = new THREE.Mesh( cylinderR1geometryL, cylinderR1materialL );
      cylinderR1L.position.set(-3,0,13)
      cylinderR1L.rotation.x = 1.57
      rocket1.add( cylinderR1L );


      const cylinderR1geometryL2 = new THREE.CylinderGeometry( 0.2, 1, 2, 32 ,10 , false );
      const cylinderR1materialL2 = new THREE.MeshBasicMaterial( {map: rocket1Bodytexture} );
      const cylinderR1L2 = new THREE.Mesh( cylinderR1geometryL2, cylinderR1materialL2 );
      cylinderR1L2.position.set(-3,0,21.5)
      cylinderR1L2.rotation.x = 1.57
      rocket1.add( cylinderR1L2 );


      const cylinderR1geometryL3 = new THREE.CylinderGeometry( 1, 1.8,2, 32 ,10 , false );
      const cylinderR1materialL3 = new THREE.MeshBasicMaterial( {map: rocket1Bodytexture} );
      const cylinderR1L3 = new THREE.Mesh( cylinderR1geometryL3, cylinderR1materialL3 );
      cylinderR1L3.position.set(-3,0,4.5)
      cylinderR1L3.rotation.x = 1.57
      rocket1.add( cylinderR1L3 );

      const cylinderR1geometryL4 = new THREE.CylinderGeometry( 1, 1.5,1.5, 32 ,10 , false );
      const cylinderR1materialL4 = new THREE.MeshBasicMaterial( {map : pushtexture} );
      const cylinderR1L4 = new THREE.Mesh( cylinderR1geometryL4, cylinderR1materialL4 );
      cylinderR1L4.position.set(-3,0,2.8)
      cylinderR1L4.rotation.x = 1.57
      rocket1.add( cylinderR1L4 );

      const cylinderR1Push1geometry = new THREE.CylinderGeometry( 0.3, 0.5,1.5, 32 ,10 , false );
      const cylinderR1Push1material = new THREE.MeshBasicMaterial( {map : pushtexture} );
      const cylinderR1Push1 = new THREE.Mesh( cylinderR1Push1geometry, cylinderR1Push1material );
      cylinderR1Push1.position.set(0.7,0.7,3.8)
      cylinderR1Push1.rotation.x = 1.57
      rocket1.add( cylinderR1Push1 );


      const cylinderR1Push2geometry = new THREE.CylinderGeometry( 0.3, 0.5,1.5, 32 ,10 , false );
      const cylinderR1Push2material = new THREE.MeshBasicMaterial( {map : pushtexture} );
      const cylinderR1Push2 = new THREE.Mesh( cylinderR1Push2geometry, cylinderR1Push2material );
      cylinderR1Push2.position.set(-0.7,0.7,3.8)
      cylinderR1Push2.rotation.x = 1.57
      rocket1.add( cylinderR1Push2 );

      const cylinderR1Push3geometry = new THREE.CylinderGeometry( 0.3, 0.5,1.5, 32 ,10 , false );
      const cylinderR1Push3material = new THREE.MeshBasicMaterial( {map : pushtexture} );
      const cylinderR1Push3 = new THREE.Mesh( cylinderR1Push3geometry, cylinderR1Push3material );
      cylinderR1Push3.position.set(0,-0.7,3.8)
      cylinderR1Push3.rotation.x = 1.57
      rocket1.add( cylinderR1Push3 );

      const linkR1geometry = new THREE.BoxGeometry(0.5,0.5,0.5)
      const linkmaterial = new THREE.MeshBasicMaterial({map : headtexture})
      const linkR1 = new THREE.Mesh(linkR1geometry,linkmaterial)
      linkR1.position.set(2,0,18)
      rocket1.add(linkR1)

      const linkR2 = new THREE.Mesh(linkR1geometry,linkmaterial)
      linkR2.position.set(2,0,9)
      rocket1.add(linkR2)

      const linkR3 = new THREE.Mesh(linkR1geometry,linkmaterial)
      linkR3.position.set(-2,0,18)
      rocket1.add(linkR3)

      const linkR4 = new THREE.Mesh(linkR1geometry,linkmaterial)
      linkR4.position.set(-2,0,9)
      rocket1.add(linkR4)
      rocket1.position.set(0,45,12)
      scene.add(rocket1)
     
      const parameters = {
          color: 0xff0000,
          spin: ()=>
          {
              rocket1.position.z += 20 
          }
      }

      const updateCannon = () => {
      let vector = new THREE.Vector3();
      camera.getWorldDirection(vector);
      angleXY = Math.asin(cannonDirection.clone().y);
      angleXZ = Math.acos(cannonDirection.clone().x);
      };
      const objectsToUpdate = []
      let cannonrocket;
      var physicsrocket;
      //let objectsToUpdate = [];
      const createCannonrocket = () => {
      
         cannonrocket = new THREE.Mesh(
          new THREE.SphereGeometry(paramters.radius * 5, 32, 32),
          new THREE.MeshStandardMaterial({
          
          })
        );
        cannonrocket.castShadow = true;
        cannonrocket.position.copy(
          rocket1.position.clone().add(new THREE.Vector3(0, 3.5, -1))
        );
        scene.add(cannonrocket);
        
        const angular_speed = vector.create(
          paramters.angular_speedX,
          paramters.angular_speedY,
          paramters.angular_speedZ
        );
        physicsrocket = new Rocket(
          1,
          paramters.speed,
          10,
          20,
          paramters.radius,
          paramters.type,
          paramters.dragCoeff,
          angular_speed,
          paramters.resistanseCoeff,
          paramters.frictionCoeff
        );
        world.add(physicsrocket);
        objectsToUpdate.push({
           cannonrocket,
          physicsrocket,
        });
      };

      createCannonrocket()



      world.defaultContactMaterial = defaultContactMaterial

      //sphere

      const sphereShpape = new CANNON.Sphere(0.5)
      const sphereBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0,0,0),
      shape: sphereShpape

      })
      sphereBody.applyLocalForce(new CANNON.Vec3(0,55,0),new CANNON.Vec3(0,0,0))
      world.addBody(sphereBody)

      // Floor
      
      const floorShape = new CANNON.Plane()
      const floorBody = new CANNON.Body()
      floorBody.mass = 0
      floorBody.addShape(floorShape)
      // floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) 
      world.addBody(floorBody)
      
      
    
        let shape = new CANNON.Sphere(5);
        const body = new CANNON.Body({
            mass: 1,
            shape: shape,
        })
        body.angularVelocity.set(0, 1, 0)
      camera.rotation.x = 1.8
      //var 
      let oldElapsedTime = 0;
      let oldvaleu =1128;
      let massfuel=1000;
      const clock = new THREE.Clock()

      const tick = () =>
      {
        const elapsedTime = clock.getElapsedTime()
        const deltaTime =0.01
        oldElapsedTime = elapsedTime;


        if(elapsedTime<4){
        }
        
        if(elapsedTime>1.9&&elapsedTime<2.7){
            
            open = 0.1
        }else if (elapsedTime > 6){
        }
      requestAnimationFrame(tick)
      physicsrocket.update(deltaTime);
        const value = physicsrocket.position.getY();
        const nnn = value - oldvaleu
        oldvaleu = value;
       rocket1.position.z+=physicsrocket.position.getY()*100;
          camera.position.set(rocket1.position.x,rocket1.position.y-100,rocket1.position.z) 
          for (const object of objectsToUpdate) {
           
          }
         
          if(params.massfuel>=0){
            params.massfuel=params.massfuel;
          }
          if(params.massfuel<0){
            params.massfuel=0;
            params.throstfactory=0;
            params.gfactory=5;
          }
          
          if(rocket1.position.z<11){
            params.totalfactory=0;
            
          }
          if(rocket1.position.z>1200){
            params.totalfactory=0;
           rocket1.position.z=1200; 
          }
          renderer.render(scene,camera)
      }
      tick()