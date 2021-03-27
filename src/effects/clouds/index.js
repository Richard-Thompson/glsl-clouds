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
  precision mediump float;
  
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  fragmentShader: `
    uniform vec2 uResolution;
    uniform float uTime;

    vec3 sundir = vec3(4.0,10.0,4.0);
    const int STEPS = 150;
    const int OCTAVES = 2;
    vec3 backgroundColor = vec3(1.0);

    // Noise Related Functions 
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
    float noise(vec3 p){
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);
        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);
        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);
        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));
        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
        return o4.y * d.y + o4.x * (1.0 - d.y);
    }
    float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   
    float gold_noise(in vec2 xy, in float seed){
        return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
    }
    float random( vec3 scale, float seed ){
    return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
    }

    // Fractal Brownian Noise 
    float fbm(vec3 x, int octaves) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100);
        for (int i = 0; i < octaves; ++i) {
            v += a * noise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }
    // SDF function
    float sphereSDF (vec3 position, float radius) {
        vec3 origin = vec3(.0) ;
        return length(origin - fbm(position, 1)  ) - radius;
    }

    // MiN/Max for inside bounding box
    float value = 2.0;
    float xMin = -2.0;
    float xMax = 2.0;   
    float yMin = -2.0 ;
    float yMax = 2.0;

    bool insideCuboid (vec3 position) {
        float x = position.x;
        float y = position.y;
        return x > xMin && x < xMax && y > yMin && y < yMax;
    }
    
    float densityFunc(const vec3 p) {
        vec3 q = p;
        // Move the noise by adding vector and multiplying by 
        // increasing time.
        q += vec3(0.0, 0.0, -.20) * uTime;
        float f = fbm(q, OCTAVES);
        return clamp( f - 0.5  , 0.0, 1.0 );
    }
    vec3 lighting(const vec3 pos, const float cloudDensity
    , const vec3 backgroundColor, const float pathLength ) {
        // How light is it for this particular position 
        float clampedDensity = clamp(cloudDensity, 0.0, 1.0);

        // How light is it for this particular position 
        vec3 lightnessFactor = vec3(0.91, 0.98, 1.0) + vec3(1.0, 0.6, 0.3) * 2.0 * clampedDensity;

        // Calculate a darkness factor based on density
        vec3 darknessFactor = mix( vec3(1.0, 0.95, 1.0), vec3(0.0, 0.0, 0.00), cloudDensity );

        const float transmittanceFactor = 0.0003;

        // As pathLength increases ie you get further away
        // from the origin of thr ray firing into 3D space 
        // the transmittance will decreasse. Meaning the 
        // color wont be as bright. Took alot of fiddling around..
        float transmittance = exp( -transmittanceFactor * pathLength );

        // Here we mix the background color with the combined 
        // lightness and darkness, based on transmittance.
        return mix(backgroundColor, darknessFactor * lightnessFactor, transmittance );
    }
    void main() {
        // Taking into account the screen resolution 
        vec2 uv = (gl_FragCoord.xy-.5*uResolution.xy)/uResolution.y;
    
        // Ray Marching Variables
        vec3 rayOrigin = vec3(uv, 1.0);
        vec3 rayDirection = vec3(uv, 1.0);
        vec4 colorSum = vec4(0.0);
        float rayDistanceToSphericalShape = 0.0;
        float MAX_DISTANCE = 100.0;
        
        // Use loop to increase distance of ray 
        // on each iteration.  
        for (int i = 0; i< 120;i ++) {
            // Get currentStep or tip of ray
            vec3 currentStep = rayOrigin + rayDirection * rayDistanceToSphericalShape;

            // Mimic movement of cloud like shapes by 
            // moving the step in a certain direction 
            // which increases as time increases 
            vec3 movedStepWithTime = currentStep + vec3(0.0,0.0,-0.6) * uTime;
            
            // Calculate if tip of ray is within one of our 
            // noise affected 3D special shapes, defined by the SDF
            // function.
            float dist = sphereSDF(movedStepWithTime, .95);


            // Limit the clouds to a certain box, only within
            // this box will be rendered.
            bool insideBoundries = insideCuboid(movedStepWithTime);
    
            
            // The color sum is basically where each time the ray gets
            // increased in distance and the tip of the ray is inside 
            // spherical cloud shape (defined by our SDF), we add the colors up.
            // I tried to make it so that the middle of a cloud would be a more solid color 
            // and the outskirts would have a less bright color.
            // If opacity is > 0.99 we dont want to run the code anymore 
            // it has reached max opaquness.
            if( 0.99 < colorSum.a ) break; 

            // Calculate The density of this rays position
            float cloudDensity = densityFunc( currentStep );
            
            if (dist < 0.1002 && insideBoundries ) {
                // Get color of tip of ray within spherical shape
                vec3 colorRGB = lighting( movedStepWithTime, cloudDensity, backgroundColor, dist );

                // tweak opacity or alpha
                float alpha = cloudDensity * 0.9;

                // Multiply color by alpha 
                vec4 color = vec4(colorRGB * alpha, alpha);

                // Add color to colorSum allowing us to 
                // account for layers of clouds.
                colorSum += color; 
                
                
            }

            if (rayDistanceToSphericalShape > MAX_DISTANCE) {
                break;
            }
            
            // When we fire the ray, if the distance to out sphercial
            // shapes is less than 0.0001 then we add the distance to the 
            // overall rayDistanceToSphericalShape and bypass the need to in crease by 0.1 
            // each time. This way we speed things up.
           
            rayDistanceToSphericalShape += dist < 0.0001 ? dist : 0.1; 
            
        }

        vec3 backgroundSky = vec3( 0.7, 0.79, 0.83);
        vec4 finalColorSum = colorSum;

        // Blending the background color with the colorSum 
        vec3 finalColor = backgroundSky * ( 1.0 - finalColorSum.a ) + finalColorSum.rgb;
        gl_FragColor = vec4(finalColor, 1.0);
  
    }

  `
}