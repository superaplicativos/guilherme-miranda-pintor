/**
 * Three.js - Cena 3D do Hero
 * Planeta girando + atmosfera + estrelas + parallax mouse
 */
(function () {
  if (typeof THREE === 'undefined') {
    console.warn('Three.js não carregado');
    return;
  }

  const canvas = document.getElementById('planet-canvas');
  if (!canvas) return;

  // Cena, câmera, renderizador
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Luzes
  const ambientLight = new THREE.AmbientLight(0x1E3A8A, 0.3);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xFBBF24, 1.5);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0xD4AF37, 0.8);
  rimLight.position.set(-5, 2, -3);
  scene.add(rimLight);

  // === PLANETA PRINCIPAL ===
  // Geometria com noise procedural
  const planetGeometry = new THREE.SphereGeometry(2.2, 128, 128);

  // Shader do planeta - simula superfície cósmica
  const planetMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0xD4AF37) }, // ouro
      uColor2: { value: new THREE.Color(0x8B4513) }, // marrom
      uColor3: { value: new THREE.Color(0x1E3A8A) }, // azul
      uColor4: { value: new THREE.Color(0xFBBF24) }, // amarelo
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      uniform float uTime;
      
      // Noise simplex
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
      
      void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;
        
        // Deslocamento com noise para relevo
        float noise = snoise(position * 1.5 + vec3(uTime * 0.1)) * 0.08;
        noise += snoise(position * 4.0 + vec3(uTime * 0.2)) * 0.03;
        
        vec3 newPosition = position + normal * noise;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      
      // Noise igual ao vertex shader
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
      
      void main() {
        // Pattern de superfície
        float n1 = snoise(vPosition * 2.0 + vec3(uTime * 0.05));
        float n2 = snoise(vPosition * 5.0 + vec3(uTime * 0.15));
        float n3 = snoise(vPosition * 10.0 + vec3(uTime * 0.1));
        
        // Mistura de cores
        vec3 color = mix(uColor3, uColor1, smoothstep(-0.3, 0.5, n1));
        color = mix(color, uColor2, smoothstep(0.2, 0.7, n2));
        color = mix(color, uColor4, smoothstep(0.6, 0.9, n3) * 0.4);
        
        // Iluminação fake
        vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
        float light = dot(vNormal, lightDir) * 0.5 + 0.5;
        color *= light;
        
        // Fresnel - borda brilhante
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(vNormal, viewDir), 2.5);
        color += uColor1 * fresnel * 0.6;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  scene.add(planet);

  // === ATMOSFERA (anel dourado) ===
  const ringGeometry = new THREE.RingGeometry(2.6, 4.2, 128);
  const ringMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xD4AF37) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColor;
      void main() {
        float dist = abs(vUv.x - 0.5) * 2.0;
        float alpha = (1.0 - dist) * 0.4;
        alpha *= 0.7 + sin(uTime * 2.0 + vUv.y * 30.0) * 0.3;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI * 0.45;
  ring.rotation.z = 0.2;
  scene.add(ring);

  // === ATMOSFERA GLOW ===
  const glowGeometry = new THREE.SphereGeometry(2.5, 64, 64);
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xD4AF37) },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 uColor;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
        gl_FragColor = vec4(uColor, 1.0) * intensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glow);

  // === ESTRELAS DE FUNDO ===
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 2000;
  const starsPositions = new Float32Array(starsCount * 3);
  const starsColors = new Float32Array(starsCount * 3);
  const starsSizes = new Float32Array(starsCount);

  for (let i = 0; i < starsCount; i++) {
    const i3 = i * 3;
    // Distribuição esférica
    const radius = 30 + Math.random() * 70;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starsPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starsPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starsPositions[i3 + 2] = radius * Math.cos(phi);

    // Cores variadas
    const colorChoice = Math.random();
    if (colorChoice < 0.7) {
      starsColors[i3] = 1; starsColors[i3 + 1] = 1; starsColors[i3 + 2] = 1;
    } else if (colorChoice < 0.85) {
      starsColors[i3] = 0.83; starsColors[i3 + 1] = 0.69; starsColors[i3 + 2] = 0.22;
    } else {
      starsColors[i3] = 0.5; starsColors[i3 + 1] = 0.7; starsColors[i3 + 2] = 1;
    }
    starsSizes[i] = Math.random() * 2 + 0.5;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
  starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

  const starsMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // === PARALLAX MOUSE ===
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  // Posição inicial do planeta (offset para não cobrir o texto)
  planet.position.x = 3;
  ring.position.x = 3;
  glow.position.x = 3;

  // === RESIZE ===
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Em mobile, move o planeta pra fora do caminho do texto
    if (window.innerWidth < 768) {
      planet.position.x = 0;
      planet.position.y = -1.5;
      planet.scale.setScalar(0.5);
      ring.position.x = 0;
      ring.position.y = -1.5;
      ring.scale.setScalar(0.5);
      glow.position.x = 0;
      glow.position.y = -1.5;
      glow.scale.setScalar(0.5);
    } else {
      planet.position.x = 3;
      planet.position.y = 0;
      planet.scale.setScalar(1);
      ring.position.x = 3;
      ring.position.y = 0;
      ring.scale.setScalar(1);
      glow.position.x = 3;
      glow.position.y = 0;
      glow.scale.setScalar(1);
    }
  }
  window.addEventListener('resize', onResize);
  onResize();

  // === ANIMATION LOOP ===
  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();

    planetMaterial.uniforms.uTime.value = elapsed;
    ringMaterial.uniforms.uTime.value = elapsed;

    planet.rotation.y = elapsed * 0.1;
    ring.rotation.z = elapsed * 0.05;
    stars.rotation.y = elapsed * 0.005;

    // Parallax suave
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;
    camera.position.x = mouseX * 2;
    camera.position.y = -mouseY * 2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
