import React from "react";
import { extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Effects from '../effects';

extend({ OrbitControls })

const Map = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree()
  return (
    <>  
        <orbitControls args={[camera, domElement]} />
        <Effects />
        <gridHelper args={[10, 10, `pink`, `black`]} />
       
    </>
    
  );
}

export default Map;