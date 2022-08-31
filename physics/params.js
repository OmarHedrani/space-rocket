const Parms = {
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
        rho:1,
        tempereture: 15,
        resistanseCoeff: 0.8,
        frictionCoeff: 0.8,
        msssfuel:3,
        throstfactory:1,
        totalfactory:1,
       gfactory:1,
        velocitythrost:4500,
        mass: 1000,
        dtmass :10,
        massfuel:600,
        speed: 20,
        deltatime:0.01,
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
}
export default Parms;