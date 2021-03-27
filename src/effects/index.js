import React, { useRef, useEffect } from 'react';
import { useThree, useFrame, extend } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SavePass } from 'three/examples/jsm/postprocessing/SavePass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import * as THREE from 'three';

import { clouds } from './clouds';

extend({ EffectComposer, ShaderPass, SavePass, RenderPass })

const glsl = (x) => x

const Effects = () => {

  const composer = useRef()
  const savePass = useRef()
  const cloudsPass = useRef()
  const swap = useRef(false) // Whether to swap the delay buffers
  const { scene, gl, size, camera, clock } = useThree()
  // const { rtA, rtB } = useMemo(() => {
  //   const rtA = new THREE.WebGLRenderTarget(size.width, size.height)
  //   const rtB = new THREE.WebGLRenderTarget(size.width, size.height)
  //   return { rtA, rtB }
  // }, [size])
  useEffect(() => composer.current.setSize(size.width, size.height), [size])
  useFrame(() => {
    if (cloudsPass.current) {
      var m = new THREE.Matrix4();
      m.copy(camera.matrixWorld);

      cloudsPass.current.uniforms['uResolution'].value = new THREE.Vector2(size.width, size.height);
      cloudsPass.current.uniforms['uTime'].value = clock.elapsedTime;
      cloudsPass.current.uniforms['camPos'].value = new THREE.Vector3().copy(camera.position);
      cloudsPass.current.uniforms['cameraWorldMatrix'].value = camera.matrixWorld;
      cloudsPass.current.uniforms['cameraProjectionMatrixInverse'].value = new THREE.Matrix4().copy(camera.projectionMatrix).invert();

    }
    // console.log({camera})
    camera.updateProjectionMatrix();
    var speed = Date.now() * 0.00025;
    // camera.position.x = Math.cos(speed) * 10;
    // camera.position.z = Math.sin(speed) * 10;
    // camera.lookAt(new THREE.Vector3(0.0,0))
    composer.current.render()
  }, 1);
  console.log({ camera });
  console.log({ clock });
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass attachArray="passes" ref={cloudsPass} args={[clouds]} needsSwap={false} renderToScreen />

    </effectComposer>
  )
}

export default Effects;