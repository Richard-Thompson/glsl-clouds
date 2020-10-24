import React, { useEffect, useRef, useState } from 'react';
import { extend, Canvas, useFrame, useThree } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'

function Box({ position, rotationSpeed, color }) {
    const mesh = useRef()
    const [active, setActive] = useState(false)
    useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += rotationSpeed / 100))
    return (
        <mesh
            position={position}
            ref={mesh}
            scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={e => setActive(!active)}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshStandardMaterial attach="material" color={color}/>
        </mesh>
    )
}

export default Box;