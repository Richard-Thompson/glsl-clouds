export const clouds = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: null },
    uTime: { value: null },
    camPos: { value: null },
    cameraWorldMatrix: {value: null},
    cameraProjectionMatrixInverse: {value: null},
   
  },
  vertexShader: `
 
  void main() {
   
   
    vec4 modelViewPosition = modelViewMatrix * vec4(position , 1.0);
     gl_Position = projectionMatrix * modelViewPosition;     


  }
  `,
  fragmentShader: `
  uniform vec3 camPos;
  uniform vec2 uResolution;
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform mat4 cameraWorldMatrix;
  uniform mat4 cameraProjectionMatrixInverse;

  float sphereSDF (vec3 position, vec3 origin, float radius) {
    return length(origin-position) - radius;
  }

 
void main()
{
vec2 p = gl_FragCoord.xy / uResolution.xy;

vec2 screenPos = ( gl_FragCoord.xy * 2.0 - uResolution.xy ) / uResolution.xy;
// convert ray direction from screen coordinate to world coordinate
vec3 ray = (cameraWorldMatrix * cameraProjectionMatrixInverse * vec4( screenPos.xy, 1.0, 1.0 )).xyz;
ray = normalize( ray );
// camera position
vec3 cPos = camPos;

  // Ray Marching Variables
  vec3 ro = cPos;  //ray's origin
  //varying mat4 projectionMatrix;
 //varying mat4 viewMatInverted;
 
  vec3 rd =ray;
  vec3 sphereOirgin =  vec3(0.30);
 
  vec3 sum = ( vec4(texture(tDiffuse, p.xy).xyz,1.0)).xyz;
  float t = 0.0;

 
  

  
float MAX_DISTANCE = 400.0;
  
for (int i = 0; i< 500;i ++) {
    vec3 currentStep = ro + rd* t ;

  float dist = sphereSDF(currentStep,sphereOirgin, .10);


  if (dist < 0.0000 ) {
    sum = vec3(1.0);
    
  }
  if (t > MAX_DISTANCE) {
    
    break;
  }
  t += dist < 0.000001 ? 0.1 : 0.06; 
  
}
  
      
      
          gl_FragColor = vec4(sum.xyz, 1.0);
      

}
  `
}