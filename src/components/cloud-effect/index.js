import * as THREE from 'three';
import vertexShader from './shaders/vertex.shader';
import fragmentShader from './shaders/fragment.shader';


const CloudEffect = (uniforms = {}) => {
    return {
        uniforms: {
            ...uniforms
        },
        vertexShader,
        fragmentShader,
        hello: 'hello'
    }
}

export default CloudEffect;