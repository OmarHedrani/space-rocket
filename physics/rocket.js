import { DstAlphaFactor } from "three";
import params from "./params.js";
import vector from "./vector.js";
import World from "./world.js";
import * as THREE from "/node_modules/three/build/three.module.js";
import { Vector3 } from "/node_modules/three/build/three.module.js";


let totalForce;

class Rocket {

  word;
  constructor(
    position,
    speed,
    angleXY,
    angleYZ,
    raduis,
    type,
    drag_coeff,
    angular_velocity,
    resistanse_coeff,
    friction_coeff
  ) {

    let dtmasss=0;
    this.position = position;
    this.position = vector.create(0, 0, 0);
    this.velocity = vector.create(0, 0, 0);
    this.velocityn = vector.create(0, 0, 0);
    let mass=params.mass;
    this.velocity.inits(angleXY, speed, angleYZ);
    this.type = type;
    this.drag_coeff = drag_coeff;
    this.resistanse_coeff = resistanse_coeff;
    this.friction_coeff = friction_coeff;
    this.raduis = raduis; //m
    this.rho = 0;
    this.word = new World(1,2,3,4,5);
    if (this.type == 1) {
      this.rho = 500; // kg/m^3  ione
      this.resistanse_coeff = 0.4603;
      this.friction_coeff = 0.4;
    } else if (this.type == 2) {
      this.rho = 7860; // ballste
      this.resistanse_coeff = 0.597;
      this.friction_coeff = 0.7;
    } else if (this.type == 3) {
      this.rho = 1100; // jet
      this.resistanse_coeff = 0.828;
      this.friction_coeff = 0.7;
    }
    if (this.type == 0) {
      // user value
      params.mass = mass;
    } else {
      params.mass = this.rho * (4 / 3) * Math.PI * Math.pow(this.raduis, 3); //kg
    }
    this.area = Math.PI * Math.pow(this.raduis, 2);
    this.rotateAngle = 0;
    this.angular_velocity = angular_velocity;
    this.rotateAxes = vector.create(
      angular_velocity.getX() > 0 ? 1 : 0,
      angular_velocity.getY(),
      angular_velocity.getZ()
    );
   // this.angular_velocity = angular_velocity;
    this.angular_acc = new THREE.Vector3();
    const I = (2 / 5) * params.mass * Math.pow(this.raduis, 2);
    this.IBody = new THREE.Matrix3().set(I, 0, 0, 0, I, 0, 0, 0, I).invert();
    this.quaternion = new THREE.Quaternion();
    this.rotationMatrix = new THREE.Matrix3();
    this.intersectsObjects = [];
  }
  update(time, gravity, air_rho, wind_velo) {
   
   
    //Forces
    let gravityForce = this.gravity_force(gravity);
    let dragForce = this.drag_force(air_rho);
    //let windForce = this.wind_force(air_rho, wind_velo);
    let liftForce = this.lift_force(air_rho);
     let throstForce =  this.throst_Force()
    
   console.log(gravityForce)
  //console.log(dragForce)
   //console.log(liftForce)
   //console.log(throstForce )
   
    // +++ throstForce Y
    totalForce = vector.create(
      (dragForce.getX()  + liftForce.getX())* params.totalfactory,
      (gravityForce.getY() + dragForce.getY() +liftForce.getY()+throstForce.getY())*params.totalfactory,
      (dragForce.getZ()  + liftForce.getZ())*params.totalfactory
      
   
    );
 
    this.dtmasss=(throstForce.getY()*params.deltatime)/params.velocitythrost;
//console.log(params.massfuel)

if(params.massfuel>=0){
  params.massfuel-=this.dtmasss;
}


    //Linear Movement

    
    let acc = vector.create(
      totalForce.getX() / (params.mass+params.massfuel),
      totalForce.getY() /(params.mass+params.massfuel),
      totalForce.getZ() /(params.mass+params.massfuel));
//console.log(acc)

    this.velocity.addTo(acc, time);
(this.angular_velocity._x.toFixed(2)) * this.raduis * time * 10;

//velocitynn

let velocityn =vector.create(

acc.getX()*params.deltatime,
acc.getY()*params.deltatime,
acc.getZ()*params.deltatime
)
this.velocityn=velocityn 
//console.log(velocityn)
//console.log(velocityn)
//console.log(acc)
 let position =vector.create(
  
  velocityn.getX()*params.deltatime,
  velocityn.getY()*params.deltatime,
  velocityn.getZ()*params.deltatime

 );
 
 this.position._x=position.getX();
 this.position._y=position.getY();
this.position._z=position.getZ();



    
    // inertia Tensor
    let interiaTensor = this.rotationMatrix
      .clone()
      .multiply(this.IBody)
      .multiply(this.rotationMatrix.clone().transpose());

      
   
   
   // this.angular_acc = torque.applyMatrix3(interiaTensor);

   
      this.angular_velocity._x += this.angular_acc.x * time;
      this.angular_velocity._y += this.angular_acc.y * time;
      this.angular_velocity._z += this.angular_acc.z * time;

    //Update angular velocity, quaternion
    this.updateQuaternion(this.angular_velocity, time);
    this.updateRotationMatrix(this.quaternion.normalize());
  // console.log(velocityn)
    return velocityn;
  }

  

  gravity_force(gravity) {
  
    return vector.create(0, -params.gravity * (params.mass+params.massfuel) *params.gfactory, 0);
   
  }

  drag_force(rho) {
    let velocitynSquere = this.velocityn.squere();

    let normalize = this.velocityn.normalize();
    let drag = vector.create(
      ((velocitynSquere * -1) / 2) * this.drag_coeff * params.rho * this.area * normalize.getX(),
      ((velocitynSquere * -1) / 2) *  this.drag_coeff * params.rho *  this.area *  normalize.getY(),
      ((velocitynSquere * -1) / 2) * this.drag_coeff * params.rho * this.area * normalize.getZ()
    );
    //console.log|(this.velocityn)
  //console.log(drag)
    return drag;
  }

  
  throst_Force() {
    
    
    let throst = vector.create(
      ( params.velocitythrost* params.dtmass * params.throstfactory),
      ( params.velocitythrost* params.dtmass *params.throstfactory),
      ( params.velocitythrost*params.dtmass *params.throstfactory)
      
    );
  
    // params.dtmass=(throst*params.deltatime)/params.velocitythrost;
    //console.log(this.velocity);
    //console.log(throst)
    return throst;
    
    
  }
  
  
//lift force
  lift_force(rho) {
    let velocitySquere = this.velocityn.squere();
    let cross = this.rotateAxes.cross(this.velocity);
    let lift = vector.create(
      ((velocitySquere * 1) / 2) * lift_coeff * params.rho * this.area * cross.getX(),
      ((-velocitySquere * 1) / 2) * lift_coeff * params.rho * this.area * cross.getY(),
      ((velocitySquere * 1) / 2) * lift_coeff * params.rho * this.area * cross.getZ()
    );
   
    return lift;
  }

 
  
}

export default Rocket;


