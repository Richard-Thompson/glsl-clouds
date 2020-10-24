import React from 'react';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber'
import logo from './logo.svg';
import './App.css';
import Effects from './components/main';
import Box from './components/Box';

function App() {
  return (
    <div className="App">
      <Canvas>
        
        <Effects />
        <Box position={[0,0,0]} rotationSpeed={1} color={'#7f0000'}/>
      </Canvas>
     
    </div>
  );
}

export default App;
