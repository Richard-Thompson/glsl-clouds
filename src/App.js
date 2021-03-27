import React, { Suspense } from "react";
import { Canvas, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Map from './map';

extend({ OrbitControls })

function App() {

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <Canvas
        camera={{ position: [-4, 4, -4], far: 50 }}
        style={{
          background: "#FFFFFF",
        }}
        concurrent
      >
        <Map />
      </Canvas>
    </div>
    
  );
}

export default App;
