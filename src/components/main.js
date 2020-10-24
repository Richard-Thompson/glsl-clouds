import React, { useEffect, useRef } from 'react';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import CloudEffect from './cloud-effect/index';

console.log({CloudEffect})

extend({ EffectComposer, RenderPass, GlitchPass, ShaderPass })

function Effects() {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => composer.current.render(), 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" args={[scene, camera]} />
        <shaderPass attachArray="passes" args={CloudEffect()} />
        <glitchPass attachArray="passes" renderToScreen />
    </effectComposer>
  )
}

export default Effects;