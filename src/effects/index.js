import React, { useRef, useEffect } from 'react';
import { useThree, useFrame, extend } from 'react-three-fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import * as THREE from 'three';

import { clouds } from './clouds';

extend({ EffectComposer, ShaderPass, SavePass, RenderPass })

const Effects = () => {

  const composer = useRef();
  const cloudsPass = useRef()
  const { scene, gl, size, camera, clock } = useThree()

  useEffect(() => composer.current.setSize(size.width, size.height), [size])

  useFrame(() => {
    if (cloudsPass.current) {
      cloudsPass.current.uniforms['uResolution'].value = new THREE.Vector2(size.width, size.height);
      cloudsPass.current.uniforms['uTime'].value = clock.elapsedTime;
    }
    composer.current.render()
  }, 1);
  
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" ref={cloudsPass} args={[clouds]} needsSwap={false} renderToScreen />
    </effectComposer>
  )
}

export default Effects;