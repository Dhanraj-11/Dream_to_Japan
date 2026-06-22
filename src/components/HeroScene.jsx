// // // "use client";

// // // import { Canvas, useFrame } from "@react-three/fiber";
// // // import { Float, OrbitControls, Stars } from "@react-three/drei";
// // // import { useMemo, useRef } from "react";
// // // import * as THREE from "three";

// // // function Earth() {
// // //   const earthRef = useRef();
// // //   const cloudsRef = useRef();
// // //   const ringRef = useRef();

// // //   useFrame((state, delta) => {
// // //     if (earthRef.current) earthRef.current.rotation.y += delta * 0.18;
// // //     if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.24;
// // //     if (ringRef.current) ringRef.current.rotation.z += delta * 0.08;
// // //   });

// // //   return (
// // //     <group position={[1.8, 0.2, 0]}>
// // //       {/* Main earth */}
// // //       <mesh ref={earthRef} castShadow receiveShadow>
// // //         <sphereGeometry args={[1.15, 64, 64]} />
// // //         <meshStandardMaterial
// // //           color="#1d4ed8"
// // //           roughness={0.85}
// // //           metalness={0.12}
// // //           emissive="#0b3b9f"
// // //           emissiveIntensity={0.35}
// // //         />
// // //       </mesh>

// // //       {/* Cloud layer */}
// // //       <mesh ref={cloudsRef} scale={1.03}>
// // //         <sphereGeometry args={[1.15, 64, 64]} />
// // //         <meshStandardMaterial
// // //           color="#dbeafe"
// // //           transparent
// // //           opacity={0.14}
// // //           roughness={1}
// // //           metalness={0}
// // //         />
// // //       </mesh>

// // //       {/* Atmosphere glow */}
// // //       <mesh scale={1.18}>
// // //         <sphereGeometry args={[1.15, 64, 64]} />
// // //         <meshBasicMaterial
// // //           color="#60a5fa"
// // //           transparent
// // //           opacity={0.08}
// // //           side={THREE.BackSide}
// // //         />
// // //       </mesh>

// // //       {/* Orbit ring */}
// // //       <mesh ref={ringRef} rotation={[Math.PI / 2.8, 0, 0]}>
// // //         <torusGeometry args={[1.65, 0.02, 16, 200]} />
// // //         <meshStandardMaterial
// // //           color="#7dd3fc"
// // //           emissive="#38bdf8"
// // //           emissiveIntensity={1.6}
// // //           transparent
// // //           opacity={0.75}
// // //         />
// // //       </mesh>

// // //       {/* Small satellite moon */}
// // //       <Float speed={1.2} rotationIntensity={1} floatIntensity={1.4}>
// // //         <mesh position={[1.8, 0.35, -0.2]}>
// // //           <sphereGeometry args={[0.12, 32, 32]} />
// // //           <meshStandardMaterial
// // //             color="#f8fafc"
// // //             emissive="#e2e8f0"
// // //             emissiveIntensity={0.5}
// // //           />
// // //         </mesh>
// // //       </Float>
// // //     </group>
// // //   );
// // // }

// // // function Sun() {
// // //   const sunRef = useRef();

// // //   useFrame((state) => {
// // //     if (sunRef.current) {
// // //       sunRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.25 - 4.8;
// // //       sunRef.current.position.y = 2.6 + Math.cos(state.clock.elapsedTime * 0.2) * 0.15;
// // //     }
// // //   });

// // //   return (
// // //     <group ref={sunRef} position={[-4.8, 2.6, -2]}>
// // //       <mesh>
// // //         <sphereGeometry args={[0.6, 32, 32]} />
// // //         <meshBasicMaterial color="#fbbf24" />
// // //       </mesh>

// // //       <pointLight color="#fbbf24" intensity={60} distance={25} decay={2} />
// // //     </group>
// // //   );
// // // }

// // // function FloatingParticles() {
// // //   const pointsRef = useRef();

// // //   const particles = useMemo(() => {
// // //     const count = 140;
// // //     const positions = new Float32Array(count * 3);

// // //     for (let i = 0; i < count; i++) {
// // //       positions[i * 3] = (Math.random() - 0.5) * 16;
// // //       positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
// // //       positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
// // //     }

// // //     return positions;
// // //   }, []);

// // //   useFrame((state) => {
// // //     if (pointsRef.current) {
// // //       pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
// // //       pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
// // //     }
// // //   });

// // //   return (
// // //     <points ref={pointsRef}>
// // //       <bufferGeometry>
// // //         <bufferAttribute
// // //           attach="attributes-position"
// // //           count={particles.length / 3}
// // //           array={particles}
// // //           itemSize={3}
// // //         />
// // //       </bufferGeometry>
// // //       <pointsMaterial
// // //         size={0.03}
// // //         color="#93c5fd"
// // //         transparent
// // //         opacity={0.9}
// // //         sizeAttenuation
// // //       />
// // //     </points>
// // //   );
// // // }

// // // function SceneLights() {
// // //   return (
// // //     <>
// // //       <ambientLight intensity={0.8} />
// // //       <directionalLight position={[4, 4, 3]} intensity={1.8} color="#ffffff" />
// // //       <pointLight position={[-4, 2, 2]} intensity={4} color="#f59e0b" />
// // //       <pointLight position={[2, -2, 3]} intensity={2.2} color="#60a5fa" />
// // //     </>
// // //   );
// // // }

// // // export default function HeroScene() {
// // //   return (
// // //     <Canvas
// // //       camera={{ position: [0, 0, 6], fov: 48 }}
// // //       dpr={[1, 2]}
// // //       gl={{ antialias: true, alpha: true }}
// // //     >
// // //       <SceneLights />

// // //       <Stars
// // //         radius={120}
// // //         depth={60}
// // //         count={4000}
// // //         factor={4}
// // //         saturation={0}
// // //         fade
// // //         speed={0.8}
// // //       />

// // //       <FloatingParticles />
// // //       <Sun />

// // //       <Float speed={1.3} rotationIntensity={0.6} floatIntensity={0.9}>
// // //         <Earth />
// // //       </Float>

// // //       <OrbitControls
// // //         enableZoom={false}
// // //         enablePan={false}
// // //         autoRotate={false}
// // //         maxPolarAngle={Math.PI / 1.8}
// // //         minPolarAngle={Math.PI / 2.4}
// // //       />
// // //     </Canvas>
// // //   );
// // // }


// // "use client";

// // import { Canvas, useFrame } from "@react-three/fiber";
// // import { Float, OrbitControls, Stars } from "@react-three/drei";
// // import { useEffect, useMemo, useRef, useState } from "react";
// // import * as THREE from "three";

// // function isWebGLAvailable() {
// //   if (typeof window === "undefined") return false;

// //   try {
// //     const canvas = document.createElement("canvas");

// //     const gl =
// //       canvas.getContext("webgl") ||
// //       canvas.getContext("experimental-webgl") ||
// //       canvas.getContext("webgl2");

// //     return !!gl;
// //   } catch {
// //     return false;
// //   }
// // }

// // function Earth() {
// //   const earthRef = useRef(null);
// //   const cloudsRef = useRef(null);
// //   const ringRef = useRef(null);

// //   useFrame((state, delta) => {
// //     if (earthRef.current) earthRef.current.rotation.y += delta * 0.18;
// //     if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.24;
// //     if (ringRef.current) ringRef.current.rotation.z += delta * 0.08;
// //   });

// //   return (
// //     <group position={[1.8, 0.2, 0]}>
// //       {/* Main earth */}
// //       <mesh ref={earthRef}>
// //         <sphereGeometry args={[1.15, 64, 64]} />
// //         <meshStandardMaterial
// //           color="#1d4ed8"
// //           roughness={0.85}
// //           metalness={0.12}
// //           emissive="#0b3b9f"
// //           emissiveIntensity={0.35}
// //         />
// //       </mesh>

// //       {/* Cloud layer */}
// //       <mesh ref={cloudsRef} scale={1.03}>
// //         <sphereGeometry args={[1.15, 64, 64]} />
// //         <meshStandardMaterial
// //           color="#dbeafe"
// //           transparent
// //           opacity={0.14}
// //           roughness={1}
// //           metalness={0}
// //         />
// //       </mesh>

// //       {/* Atmosphere glow */}
// //       <mesh scale={1.18}>
// //         <sphereGeometry args={[1.15, 64, 64]} />
// //         <meshBasicMaterial
// //           color="#60a5fa"
// //           transparent
// //           opacity={0.08}
// //           side={THREE.BackSide}
// //         />
// //       </mesh>

// //       {/* Orbit ring */}
// //       <mesh ref={ringRef} rotation={[Math.PI / 2.8, 0, 0]}>
// //         <torusGeometry args={[1.65, 0.02, 16, 200]} />
// //         <meshStandardMaterial
// //           color="#7dd3fc"
// //           emissive="#38bdf8"
// //           emissiveIntensity={1.6}
// //           transparent
// //           opacity={0.75}
// //         />
// //       </mesh>

// //       {/* Small moon */}
// //       <Float speed={1.2} rotationIntensity={1} floatIntensity={1.4}>
// //         <mesh position={[1.8, 0.35, -0.2]}>
// //           <sphereGeometry args={[0.12, 32, 32]} />
// //           <meshStandardMaterial
// //             color="#f8fafc"
// //             emissive="#e2e8f0"
// //             emissiveIntensity={0.5}
// //           />
// //         </mesh>
// //       </Float>
// //     </group>
// //   );
// // }

// // function Sun() {
// //   const sunRef = useRef(null);

// //   useFrame((state) => {
// //     if (sunRef.current) {
// //       sunRef.current.position.x =
// //         Math.sin(state.clock.elapsedTime * 0.18) * 0.25 - 4.8;
// //       sunRef.current.position.y =
// //         2.6 + Math.cos(state.clock.elapsedTime * 0.2) * 0.15;
// //     }
// //   });

// //   return (
// //     <group ref={sunRef} position={[-4.8, 2.6, -2]}>
// //       <mesh>
// //         <sphereGeometry args={[0.6, 32, 32]} />
// //         <meshBasicMaterial color="#fbbf24" />
// //       </mesh>

// //       <pointLight color="#fbbf24" intensity={60} distance={25} decay={2} />
// //     </group>
// //   );
// // }

// // function FloatingParticles() {
// //   const pointsRef = useRef(null);

// //   const particles = useMemo(() => {
// //     const count = 140;
// //     const positions = new Float32Array(count * 3);

// //     for (let i = 0; i < count; i++) {
// //       positions[i * 3] = (Math.random() - 0.5) * 16;
// //       positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
// //       positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
// //     }

// //     return positions;
// //   }, []);

// //   useFrame((state) => {
// //     if (pointsRef.current) {
// //       pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
// //       pointsRef.current.rotation.x =
// //         Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
// //     }
// //   });

// //   return (
// //     <points ref={pointsRef}>
// //       <bufferGeometry>
// //         <bufferAttribute
// //           attach="attributes-position"
// //           count={particles.length / 3}
// //           array={particles}
// //           itemSize={3}
// //         />
// //       </bufferGeometry>
// //       <pointsMaterial
// //         size={0.03}
// //         color="#93c5fd"
// //         transparent
// //         opacity={0.9}
// //         sizeAttenuation
// //       />
// //     </points>
// //   );
// // }

// // function SceneLights() {
// //   return (
// //     <>
// //       <ambientLight intensity={0.8} />
// //       <directionalLight position={[4, 4, 3]} intensity={1.8} color="#ffffff" />
// //       <pointLight position={[-4, 2, 2]} intensity={4} color="#f59e0b" />
// //       <pointLight position={[2, -2, 3]} intensity={2.2} color="#60a5fa" />
// //     </>
// //   );
// // }

// // function HeroFallback() {
// //   return (
// //     <div className="hero-scene-fallback">
// //       <div className="hero-scene-fallback__glow hero-scene-fallback__glow1" />
// //       <div className="hero-scene-fallback__glow hero-scene-fallback__glow2" />
// //       <div className="hero-scene-fallback__stars" />
// //       <div className="hero-scene-earth-wrap">
// //         <div className="hero-scene-sun" />
// //         <div className="hero-scene-earth">
// //           <div className="hero-scene-clouds" />
// //           <div className="hero-scene-atmosphere" />
// //           <div className="hero-scene-ring" />
// //           <div className="hero-scene-moon" />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function HeroScene() {
// //   const [canUseWebGL, setCanUseWebGL] = useState(null);

// //   useEffect(() => {
// //     setCanUseWebGL(isWebGLAvailable());
// //   }, []);

// //   if (canUseWebGL === null) {
// //     return <div className="hero-scene-loading" />;
// //   }

// //   if (!canUseWebGL) {
// //     return <HeroFallback />;
// //   }

// //   return (
// //     <div className="hero-scene-canvas-wrap">
// //       <Canvas
// //         camera={{ position: [0, 0, 6], fov: 48 }}
// //         dpr={[1, 1.5]}
// //         gl={{
// //           antialias: true,
// //           alpha: true,
// //           powerPreference: "high-performance",
// //         }}
// //         onCreated={({ gl }) => {
// //           gl.setClearColor(0x000000, 0);
// //         }}
// //       >
// //         <SceneLights />

// //         <Stars
// //           radius={120}
// //           depth={60}
// //           count={2500}
// //           factor={4}
// //           saturation={0}
// //           fade
// //           speed={0.8}
// //         />

// //         <FloatingParticles />
// //         <Sun />

// //         <Float speed={1.3} rotationIntensity={0.6} floatIntensity={0.9}>
// //           <Earth />
// //         </Float>

// //         <OrbitControls
// //           enableZoom={false}
// //           enablePan={false}
// //           autoRotate={false}
// //           maxPolarAngle={Math.PI / 1.8}
// //           minPolarAngle={Math.PI / 2.4}
// //         />
// //       </Canvas>
// //     </div>
// //   );
// // }



// "use client";

// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// export default function HeroScene() {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const container = containerRef.current;
//     let mounted = true;
//     let renderer;
//     let animationId;
//     let resizeObserver;

//     const testCanvas = document.createElement("canvas");
//     const gl =
//       testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
//     if (!gl) {
//       console.warn("[HeroScene] WebGL not supported, skipping 3D background.");
//       return;
//     }

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
//     camera.position.set(0, 0, 320);

//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//     container.appendChild(renderer.domElement);

//     scene.add(new THREE.AmbientLight(0xffffff, 1));
//     const sun = new THREE.PointLight(0xffffff, 1.4, 2000);
//     sun.position.set(300, 150, 300);
//     scene.add(sun);

//     const earthGeometry = new THREE.SphereGeometry(100, 48, 48);
//     const earthMaterial = new THREE.MeshPhongMaterial({
//       color: 0x1b56ca,
//       shininess: 18,
//       specular: 0x35558d,
//     });
//     const earth = new THREE.Mesh(earthGeometry, earthMaterial);
//     scene.add(earth);

//     const markerGeometry = new THREE.SphereGeometry(3.2, 16, 16);
//     const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5c82 });
//     const marker = new THREE.Mesh(markerGeometry, markerMaterial);
//     marker.position.set(70, 40, 60);
//     earth.add(marker);

//     const glowGeometry = new THREE.SphereGeometry(7, 16, 16);
//     const glowMaterial = new THREE.MeshBasicMaterial({
//       color: 0xff7d9a,
//       transparent: true,
//       opacity: 0.4,
//       blending: THREE.AdditiveBlending,
//     });
//     const glow = new THREE.Mesh(glowGeometry, glowMaterial);
//     marker.add(glow);

//     const starGeometry = new THREE.BufferGeometry();
//     const starCount = 1200;
//     const starPositions = new Float32Array(starCount * 3);
//     for (let i = 0; i < starCount * 3; i++) {
//       starPositions[i] = (Math.random() - 0.5) * 1600;
//     }
//     starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
//     const starMaterial = new THREE.PointsMaterial({
//       color: 0xffffff,
//       size: 1.2,
//       transparent: true,
//       opacity: 0.7,
//     });
//     const stars = new THREE.Points(starGeometry, starMaterial);
//     scene.add(stars);

//     // Size the renderer to the container's real measured size, retrying on
//     // the next animation frame if the layout hasn't settled yet (common
//     // inside CSS grid on first paint, which silently gives 0x0 canvases).
//     const applySize = () => {
//       const w = container.clientWidth || window.innerWidth;
//       const h = container.clientHeight || window.innerHeight;
//       if (w === 0 || h === 0) return false;
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//       renderer.setSize(w, h, false);
//       return true;
//     };

//     let attempts = 0;
//     const trySize = () => {
//       if (applySize() || attempts > 20) return;
//       attempts += 1;
//       requestAnimationFrame(trySize);
//     };
//     trySize();

//     if (typeof ResizeObserver !== "undefined") {
//       resizeObserver = new ResizeObserver(() => applySize());
//       resizeObserver.observe(container);
//     }
//     window.addEventListener("resize", applySize);

//     const animate = () => {
//       if (!mounted) return;
//       animationId = requestAnimationFrame(animate);

//       earth.rotation.y += 0.0012;
//       const pulse = 1 + Math.sin(performance.now() * 0.002) * 0.15;
//       glow.scale.set(pulse, pulse, pulse);

//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       mounted = false;
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("resize", applySize);
//       resizeObserver?.disconnect();

//       earthGeometry.dispose();
//       earthMaterial.dispose();
//       markerGeometry.dispose();
//       markerMaterial.dispose();
//       glowGeometry.dispose();
//       glowMaterial.dispose();
//       starGeometry.dispose();
//       starMaterial.dispose();

//       renderer.dispose();
//       if (container.contains(renderer.domElement)) {
//         container.removeChild(renderer.domElement);
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
//     />
//   );
// }







"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let mounted = true;
    let animationId;
    let resizeObserver;

    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");

    if (!gl) {
      console.warn("[HeroScene] WebGL not supported.");
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 3000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // =====================================================
    // Lights
    // =====================================================
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    const sunLight = new THREE.PointLight(0xffffff, 1.8, 2500);
    sunLight.position.set(300, 180, 320);
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x65a8ff, 1.2, 1800);
    blueLight.position.set(-220, -60, 220);
    scene.add(blueLight);

    // =====================================================
    // Earth
    // =====================================================
    const earthRadius = 100;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);

    const earthCanvas = document.createElement("canvas");
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const earthCtx = earthCanvas.getContext("2d");

    const oceanGrad = earthCtx.createLinearGradient(0, 0, 1024, 512);
    oceanGrad.addColorStop(0, "#143c9c");
    oceanGrad.addColorStop(0.3, "#1b56ca");
    oceanGrad.addColorStop(0.65, "#0e3f98");
    oceanGrad.addColorStop(1, "#072868");
    earthCtx.fillStyle = oceanGrad;
    earthCtx.fillRect(0, 0, 1024, 512);

    const drawLand = (x, y, rx, ry, rot = 0, color = "#57a764") => {
      earthCtx.save();
      earthCtx.translate(x, y);
      earthCtx.rotate(rot);
      earthCtx.fillStyle = color;
      earthCtx.beginPath();
      earthCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      earthCtx.fill();
      earthCtx.restore();
    };

    drawLand(150, 130, 90, 60, -0.25, "#4e9f58");
    drawLand(175, 195, 40, 45, 0.2, "#4e9f58");
    drawLand(235, 325, 45, 80, 0.18, "#4a9a55");
    drawLand(505, 130, 48, 35, 0.1, "#5eaf62");
    drawLand(530, 240, 60, 90, 0.08, "#519f5a");
    drawLand(690, 150, 150, 75, 0.05, "#5cad61");
    drawLand(750, 195, 60, 35, -0.1, "#5cad61");
    drawLand(800, 155, 9, 20, -0.45, "#73c56f");
    drawLand(812, 172, 6, 11, -0.35, "#73c56f");
    drawLand(795, 380, 60, 35, 0.1, "#4c9f58");

    for (let i = 0; i < 2200; i++) {
      earthCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
      earthCtx.fillRect(
        Math.random() * 1024,
        Math.random() * 512,
        Math.random() * 2 + 1,
        Math.random() * 2 + 1
      );
    }

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 22,
      specular: 0x35558d,
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(70, 10, 0);
    scene.add(earth);

    // =====================================================
    // Clouds
    // =====================================================
    const cloudGeometry = new THREE.SphereGeometry(earthRadius + 2.5, 48, 48);

    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cloudCtx = cloudCanvas.getContext("2d");

    for (let i = 0; i < 150; i++) {
      cloudCtx.save();
      cloudCtx.globalAlpha = 0.04 + Math.random() * 0.07;
      cloudCtx.fillStyle = "#ffffff";
      cloudCtx.translate(Math.random() * 1024, Math.random() * 512);
      cloudCtx.rotate(Math.random() * Math.PI);
      cloudCtx.beginPath();
      cloudCtx.ellipse(
        0,
        0,
        20 + Math.random() * 60,
        8 + Math.random() * 18,
        0,
        0,
        Math.PI * 2
      );
      cloudCtx.fill();
      cloudCtx.restore();
    }

    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    });

    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earth.add(clouds);

    // =====================================================
    // Atmosphere
    // =====================================================
    const atmosphereGeometry = new THREE.SphereGeometry(
      earthRadius + 8,
      48,
      48
    );

    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x70c9ff,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    const atmosphere = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );
    earth.add(atmosphere);

    // =====================================================
    // Japan marker
    // =====================================================
    const markerGeometry = new THREE.SphereGeometry(3.4, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5c82 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(72, 42, 56);
    earth.add(marker);

    const glowGeometry = new THREE.SphereGeometry(8, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff7d9a,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    marker.add(glow);

    // =====================================================
    // Moon
    // =====================================================
    const moonPivot = new THREE.Object3D();
    scene.add(moonPivot);

    const moonGeometry = new THREE.SphereGeometry(20, 24, 24);
    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0xb6bcc8,
      shininess: 4,
      specular: 0x222222,
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(220, 70, -40);
    moonPivot.add(moon);

    // =====================================================
    // Stars
    // =====================================================
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1600;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 2200;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 1400;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 1800;
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // =====================================================
    // Resize
    // =====================================================
    const applySize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 600;
      if (!w || !h) return false;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      return true;
    };

    let attempts = 0;
    const trySize = () => {
      if (applySize() || attempts > 20) return;
      attempts += 1;
      requestAnimationFrame(trySize);
    };
    trySize();

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => applySize());
      resizeObserver.observe(container);
    }

    window.addEventListener("resize", applySize);

    // =====================================================
    // Animate
    // =====================================================
    const animate = () => {
      if (!mounted) return;
      animationId = requestAnimationFrame(animate);

      earth.rotation.y += 0.0014;
      clouds.rotation.y += 0.0019;
      moonPivot.rotation.y += 0.002;
      stars.rotation.y += 0.00008;

      const pulse = 1 + Math.sin(performance.now() * 0.002) * 0.18;
      glow.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mounted = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", applySize);
      resizeObserver?.disconnect();

      earthGeometry.dispose();
      earthMaterial.dispose();
      earthTexture.dispose();

      cloudGeometry.dispose();
      cloudMaterial.dispose();
      cloudTexture.dispose();

      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();

      markerGeometry.dispose();
      markerMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();

      moonGeometry.dispose();
      moonMaterial.dispose();

      starGeometry.dispose();
      starMaterial.dispose();

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}