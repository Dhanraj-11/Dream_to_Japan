
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function AnimationLanding({ onAnimationComplete }) {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  const [zoomStage, setZoomStage] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [showJapanReveal, setShowJapanReveal] = useState(false);

  // audio refs
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorRef = useRef(null);
  const audioStartedRef = useRef(false);

  // skip handler ref
  const skipHandlerRef = useRef(null);

  // =========================================================
  // AUDIO
  // =========================================================
  const startAmbientSound = async () => {
    try {
      if (audioStartedRef.current) return;

      const AudioContext =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      const masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.03;
      masterGain.connect(audioCtx.destination);

      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const osc3 = audioCtx.createOscillator();

      const gain1 = audioCtx.createGain();
      const gain2 = audioCtx.createGain();
      const gain3 = audioCtx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";
      osc3.type = "sine";

      osc1.frequency.value = 72;
      osc2.frequency.value = 108;
      osc3.frequency.value = 144;

      gain1.gain.value = 0.35;
      gain2.gain.value = 0.18;
      gain3.gain.value = 0.08;

      osc1.connect(gain1);
      osc2.connect(gain2);
      osc3.connect(gain3);

      gain1.connect(masterGain);
      gain2.connect(masterGain);
      gain3.connect(masterGain);

      osc1.start();
      osc2.start();
      osc3.start();

      oscillatorRef.current = [osc1, osc2, osc3];
      gainNodeRef.current = masterGain;
      audioCtxRef.current = audioCtx;
      audioStartedRef.current = true;
    } catch (err) {
      console.warn("Audio init failed:", err);
    }
  };

  const stopAmbientSound = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
      }
    } catch {}

    try {
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    } catch {}

    try {
      if (
        audioCtxRef.current &&
        audioCtxRef.current.state !== "closed"
      ) {
        audioCtxRef.current.close();
      }
    } catch {}

    oscillatorRef.current = null;
    gainNodeRef.current = null;
    audioCtxRef.current = null;
    audioStartedRef.current = false;
  };

  // =========================================================
  // MAIN 3D INTRO
  // =========================================================
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;
    const container = containerRef.current;

    let scene;
    let camera;
    let renderer;
    let controls;
    let animationId;
    let autoTimer;
    let finishTimer;
    let resizeObserver;

    // objects
    let stars;
    let nebula;
    let earth;
    let clouds;
    let atmosphere;
    let moonPivot;
    let moon;
    let markerGlow;
    let pulseRing;
    let markerGroup;

    // geometry/material refs
    let starGeometry;
    let starMaterial;
    let nebulaGeometry;
    let nebulaMaterial;
    let earthGeometry;
    let earthMaterial;
    let earthTexture;
    let cloudGeometry;
    let cloudMaterial;
    let cloudTexture;
    let atmosphereGeometry;
    let atmosphereMaterial;
    let moonGeometry;
    let moonMaterial;
    let moonTexture;
    let markerGeometry;
    let markerMaterial;
    let glowGeometry;
    let glowMaterial;
    let ringGeometry;
    let ringMaterial;
    let spikeGeometry;
    let spikeMaterial;

    const initScene = () => {
      try {
        // -----------------------------------------------------
        // WebGL support check
        // -----------------------------------------------------
        const testCanvas = document.createElement("canvas");
        const gl =
          testCanvas.getContext("webgl") ||
          testCanvas.getContext("experimental-webgl");

        if (!gl) {
          console.warn("WebGL not supported. Skipping intro animation.");
          onAnimationComplete?.();
          return;
        }

        // =====================================================
        // Scene / Camera / Renderer
        // =====================================================
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x02040a);
        scene.fog = new THREE.FogExp2(0x030611, 0.00032);

        camera = new THREE.PerspectiveCamera(52, 1, 0.1, 40000);
        camera.position.set(0, 140, 2200);

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        });

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        // =====================================================
        // Controls
        // =====================================================
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.rotateSpeed = 0.55;
        controls.zoomSpeed = 0.9;
        controls.dampingFactor = 0.06;
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.22;
        controls.minDistance = 40;
        controls.maxDistance = 2600;
        controls.minPolarAngle = Math.PI * 0.22;
        controls.maxPolarAngle = Math.PI * 0.78;

        // =====================================================
        // Lights
        // =====================================================
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 2.2, 20000);
        sunLight.position.set(950, 300, 900);
        scene.add(sunLight);

        const blueRim = new THREE.PointLight(0x65a8ff, 1.4, 9000);
        blueRim.position.set(-500, -180, 600);
        scene.add(blueRim);

        const pinkFill = new THREE.PointLight(0xff6a8e, 0.7, 6000);
        pinkFill.position.set(0, 300, -400);
        scene.add(pinkFill);

        // =====================================================
        // Starfield
        // =====================================================
        starGeometry = new THREE.BufferGeometry();
        const starCount = 8000;
        const starPositions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3;
          const radius = 2800 + Math.random() * 14000;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);

          starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          starPositions[i3 + 2] = radius * Math.cos(phi);
        }

        starGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(starPositions, 3)
        );

        starMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 1.6,
          transparent: true,
          opacity: 0.95,
          sizeAttenuation: true,
        });

        stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // =====================================================
        // Nebula
        // =====================================================
        nebulaGeometry = new THREE.BufferGeometry();
        const nebulaCount = 2500;
        const nebulaPositions = new Float32Array(nebulaCount * 3);

        for (let i = 0; i < nebulaCount * 3; i++) {
          nebulaPositions[i] = (Math.random() - 0.5) * 18000;
        }

        nebulaGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(nebulaPositions, 3)
        );

        nebulaMaterial = new THREE.PointsMaterial({
          color: 0x728cff,
          size: 18,
          transparent: true,
          opacity: 0.06,
          sizeAttenuation: true,
        });

        nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
        scene.add(nebula);

        // =====================================================
        // Earth
        // =====================================================
        const earthRadius = 110;
        earthGeometry = new THREE.SphereGeometry(earthRadius, 48, 48);

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

        for (let i = 0; i < 2500; i++) {
          earthCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
          earthCtx.fillRect(
            Math.random() * 1024,
            Math.random() * 512,
            Math.random() * 2 + 1,
            Math.random() * 2 + 1
          );
        }

        const drawLand = (x, y, rx, ry, rot = 0, color = "#4ea55e") => {
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

        earthTexture = new THREE.CanvasTexture(earthCanvas);
        earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        earthMaterial = new THREE.MeshPhongMaterial({
          map: earthTexture,
          shininess: 24,
          specular: 0x35558d,
        });

        earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // =====================================================
        // Clouds
        // =====================================================
        cloudGeometry = new THREE.SphereGeometry(earthRadius + 2.4, 48, 48);

        const cloudCanvas = document.createElement("canvas");
        cloudCanvas.width = 1024;
        cloudCanvas.height = 512;
        const cloudCtx = cloudCanvas.getContext("2d");

        for (let i = 0; i < 160; i++) {
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

        cloudTexture = new THREE.CanvasTexture(cloudCanvas);

        cloudMaterial = new THREE.MeshPhongMaterial({
          map: cloudTexture,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        });

        clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        earth.add(clouds);

        // =====================================================
        // Atmosphere
        // =====================================================
        atmosphereGeometry = new THREE.SphereGeometry(
          earthRadius + 8,
          48,
          48
        );

        atmosphereMaterial = new THREE.MeshPhongMaterial({
          color: 0x70c9ff,
          transparent: true,
          opacity: 0.14,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        });

        atmosphere = new THREE.Mesh(
          atmosphereGeometry,
          atmosphereMaterial
        );
        earth.add(atmosphere);

        // =====================================================
        // Moon
        // =====================================================
        moonPivot = new THREE.Object3D();
        scene.add(moonPivot);

        moonGeometry = new THREE.SphereGeometry(30, 24, 24);

        const moonCanvas = document.createElement("canvas");
        moonCanvas.width = 256;
        moonCanvas.height = 256;
        const moonCtx = moonCanvas.getContext("2d");

        moonCtx.fillStyle = "#a3aab7";
        moonCtx.fillRect(0, 0, 256, 256);

        for (let i = 0; i < 40; i++) {
          moonCtx.fillStyle = i % 2 === 0 ? "#7e8797" : "#9199a8";
          moonCtx.beginPath();
          moonCtx.arc(
            Math.random() * 256,
            Math.random() * 256,
            4 + Math.random() * 16,
            0,
            Math.PI * 2
          );
          moonCtx.fill();
        }

        moonTexture = new THREE.CanvasTexture(moonCanvas);

        moonMaterial = new THREE.MeshPhongMaterial({
          map: moonTexture,
          shininess: 4,
          specular: 0x222222,
        });

        moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(380, 120, -100);
        moonPivot.add(moon);

        // =====================================================
        // Japan marker
        // =====================================================
        const latLonToVector3 = (lat, lon, radius) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lon + 180) * (Math.PI / 180);

          return new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
          );
        };

        const japanPos = latLonToVector3(36.2, 138.2, earthRadius + 1.5);

        markerGroup = new THREE.Group();
        earth.add(markerGroup);
        markerGroup.position.copy(japanPos);

        markerGeometry = new THREE.SphereGeometry(3.4, 16, 16);
        markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5c82 });
        const japanMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        markerGroup.add(japanMarker);

        glowGeometry = new THREE.SphereGeometry(8, 16, 16);
        glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff7d9a,
          transparent: true,
          opacity: 0.42,
          blending: THREE.AdditiveBlending,
        });
        markerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        markerGroup.add(markerGlow);

        ringGeometry = new THREE.RingGeometry(8, 11, 32);
        ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xff7f98,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
        });
        pulseRing = new THREE.Mesh(ringGeometry, ringMaterial);
        pulseRing.rotateX(Math.PI / 2);
        markerGroup.add(pulseRing);

        spikeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 18, 8);
        spikeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff9eb1,
        });
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        spike.position.y = 10;
        markerGroup.add(spike);

        // =====================================================
        // Camera stage helpers
        // =====================================================
        const lookTarget = new THREE.Vector3(0, 0, 0);
        const desiredTarget = new THREE.Vector3(0, 0, 0);
        const desiredCameraPos = new THREE.Vector3(0, 120, 2200);

        const getJapanWorldPos = () => {
          const p = new THREE.Vector3();
          markerGroup.getWorldPosition(p);
          return p;
        };

        const stages = [
          {
            label: "Deep Space",
            camera: new THREE.Vector3(0, 160, 2200),
            targetType: "earth",
            autoDelay: 2300,
          },
          {
            label: "Earth in View",
            camera: new THREE.Vector3(260, 120, 1050),
            targetType: "earth",
            autoDelay: 1800,
          },
          {
            label: "Orbital Descent",
            camera: new THREE.Vector3(200, 70, 420),
            targetType: "earth",
            autoDelay: 1800,
          },
          {
            label: "Japan Lock",
            camera: new THREE.Vector3(115, 35, 170),
            targetType: "japan",
            autoDelay: 1700,
          },
          {
            label: "Entering Japan",
            camera: new THREE.Vector3(55, 18, 72),
            targetType: "japan",
            autoDelay: 1300,
          },
        ];

        let currentStage = 0;
        let completed = false;
        let introDone = false;
        let userInteracted = false;
        let lastWheelTime = 0;

        const updateStageTargets = (stageIndex) => {
          const stage = stages[stageIndex];
          if (!stage) return;

          desiredCameraPos.copy(stage.camera);

          if (stage.targetType === "japan") {
            desiredTarget.copy(getJapanWorldPos());
          } else {
            desiredTarget.set(0, 0, 0);
          }

          setZoomStage(stageIndex);
        };

        const completeIntro = () => {
          if (introDone) return;
          introDone = true;
          setShowJapanReveal(true);

          finishTimer = setTimeout(() => {
            onAnimationComplete?.();
          }, 1600);
        };

        const setStage = (stageIndex) => {
          const clamped = Math.max(0, Math.min(stageIndex, stages.length - 1));
          currentStage = clamped;
          updateStageTargets(clamped);

          if (clamped === stages.length - 1 && !completed) {
            completed = true;
            completeIntro();
          } else if (clamped < stages.length - 1) {
            completed = false;
            setShowJapanReveal(false);
          }
        };

        const scheduleAuto = () => {
          clearTimeout(autoTimer);

          if (userInteracted) return;
          if (currentStage >= stages.length - 1) return;

          autoTimer = setTimeout(() => {
            if (!userInteracted && currentStage < stages.length - 1) {
              setStage(currentStage + 1);
              scheduleAuto();
            }
          }, stages[currentStage]?.autoDelay || 1800);
        };

        // =====================================================
        // User interaction
        // =====================================================
        const handleWheel = (e) => {
          e.preventDefault();

          userInteracted = true;
          controls.autoRotate = false;
          clearTimeout(autoTimer);

          const now = Date.now();
          if (now - lastWheelTime < 180) return;
          lastWheelTime = now;

          if (e.deltaY > 0 && currentStage < stages.length - 1) {
            setStage(currentStage + 1);
          } else if (e.deltaY < 0 && currentStage > 0) {
            clearTimeout(finishTimer);
            introDone = false;
            completed = false;
            setShowJapanReveal(false);
            setStage(currentStage - 1);
          }
        };

        const handlePointerDown = async () => {
          userInteracted = true;
          controls.autoRotate = false;
          clearTimeout(autoTimer);

          if (soundOn && !audioStartedRef.current) {
            await startAmbientSound();
          }
        };

        const handleSkip = () => {
          clearTimeout(autoTimer);
          clearTimeout(finishTimer);
          setStage(stages.length - 1);

          setTimeout(() => {
            onAnimationComplete?.();
          }, 500);
        };

        skipHandlerRef.current = handleSkip;

        renderer.domElement.addEventListener("wheel", handleWheel, {
          passive: false,
        });
        renderer.domElement.addEventListener("pointerdown", handlePointerDown);

        // =====================================================
        // Resize
        // =====================================================
        const applySize = () => {
          if (!renderer || !camera || !container) return false;

          const width = container.clientWidth || window.innerWidth;
          const height = container.clientHeight || window.innerHeight;

          if (!width || !height) return false;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
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
        // Initial stage
        // =====================================================
        updateStageTargets(0);
        scheduleAuto();

        // =====================================================
        // Animate
        // =====================================================
        const tempTarget = new THREE.Vector3();

        const animate = () => {
          if (!mounted) return;
          animationId = requestAnimationFrame(animate);

          const time = performance.now() * 0.001;

          earth.rotation.y += 0.00085;
          clouds.rotation.y += 0.00125;
          stars.rotation.y += 0.000025;
          nebula.rotation.y += 0.000012;
          moonPivot.rotation.y += 0.00055;
          moon.rotation.y += 0.0006;

          const pulse = 1 + Math.sin(time * 3.2) * 0.18;
          markerGlow.scale.set(pulse, pulse, pulse);

          const ringPulse = 1 + Math.sin(time * 2.4) * 0.25;
          pulseRing.scale.set(ringPulse, ringPulse, ringPulse);
          ringMaterial.opacity = 0.45 + (Math.sin(time * 2.4) + 1) * 0.16;

          const cinematicYOffset = Math.sin(time * 0.6) * 3.5;

          camera.position.x += (desiredCameraPos.x - camera.position.x) * 0.035;
          camera.position.y +=
            (desiredCameraPos.y + cinematicYOffset - camera.position.y) * 0.04;
          camera.position.z += (desiredCameraPos.z - camera.position.z) * 0.04;

          lookTarget.lerp(desiredTarget, 0.06);
          controls.target.copy(lookTarget);
          controls.update();

          tempTarget.copy(controls.target);
          camera.lookAt(tempTarget);

          renderer.render(scene, camera);
        };

        animate();

        // =====================================================
        // Cleanup
        // =====================================================
        cleanupRef.current = () => {
          mounted = false;

          cancelAnimationFrame(animationId);
          clearTimeout(autoTimer);
          clearTimeout(finishTimer);

          window.removeEventListener("resize", applySize);
          resizeObserver?.disconnect();

          if (renderer?.domElement) {
            renderer.domElement.removeEventListener("wheel", handleWheel);
            renderer.domElement.removeEventListener(
              "pointerdown",
              handlePointerDown
            );
          }

          skipHandlerRef.current = null;

          controls?.dispose();

          starGeometry?.dispose();
          starMaterial?.dispose();

          nebulaGeometry?.dispose();
          nebulaMaterial?.dispose();

          earthGeometry?.dispose();
          earthMaterial?.dispose();
          earthTexture?.dispose();

          cloudGeometry?.dispose();
          cloudMaterial?.dispose();
          cloudTexture?.dispose();

          atmosphereGeometry?.dispose();
          atmosphereMaterial?.dispose();

          moonGeometry?.dispose();
          moonMaterial?.dispose();
          moonTexture?.dispose();

          markerGeometry?.dispose();
          markerMaterial?.dispose();

          glowGeometry?.dispose();
          glowMaterial?.dispose();

          ringGeometry?.dispose();
          ringMaterial?.dispose();

          spikeGeometry?.dispose();
          spikeMaterial?.dispose();

          renderer?.dispose();

          if (renderer?.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      } catch (err) {
        console.error("AnimationLanding init error:", err);
        onAnimationComplete?.();
      }
    };

    initScene();

    return () => {
      mounted = false;
      cleanupRef.current?.();
      stopAmbientSound();
    };
  }, [onAnimationComplete, soundOn]);

  // =========================================================
  // SOUND TOGGLE EFFECT
  // =========================================================
  useEffect(() => {
    if (!soundOn) {
      stopAmbientSound();
    }
  }, [soundOn]);

  const stageText = [
    "Deep Space",
    "Earth in View",
    "Orbital Descent",
    "Japan Lock",
    "Entering Japan",
  ];

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #0b1224 0%, #060914 42%, #020308 100%)",
        cursor: "grab",
      }}
    >
      {/* vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.24) 100%)",
          zIndex: 2,
        }}
      />

      {/* top panel */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          width: "min(1100px, calc(100% - 24px))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          pointerEvents: "none",
        }}
      >
        {/* left title */}
        <div
          style={{
            pointerEvents: "auto",
            padding: "18px 22px",
            borderRadius: 22,
            background: "rgba(10, 14, 28, 0.42)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
            backdropFilter: "blur(14px)",
            maxWidth: 760,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.76)",
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Japan Dream Experience
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.1rem, 5vw, 4.5rem)",
              lineHeight: 1.02,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              textShadow: "0 12px 40px rgba(0,0,0,0.42)",
            }}
          >
            Journey to Japan
          </h1>

          <p
            style={{
              margin: "14px 0 0",
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(0.95rem, 1.6vw, 1.08rem)",
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Cinematic orbital entry into Japan with auto zoom, mouse drag
            rotation, wheel stage control, moon orbit, cloud layer and premium
            HUD styling.
          </p>
        </div>

        {/* right controls */}
        <div
          style={{
            pointerEvents: "auto",
            minWidth: 250,
            padding: "16px",
            borderRadius: 20,
            background: "rgba(10, 14, 28, 0.42)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
            backdropFilter: "blur(14px)",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontSize: "0.76rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)",
              marginBottom: 12,
            }}
          >
            Controls
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.82)",
              marginBottom: 16,
            }}
          >
            <div>• Drag to rotate</div>
            <div>• Mouse wheel to move zoom stages</div>
            <div>• Auto cinematic descent</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={async () => {
                const next = !soundOn;
                setSoundOn(next);

                if (next) {
                  await startAmbientSound();
                } else {
                  stopAmbientSound();
                }
              }}
              style={glassButtonStyle}
            >
              {soundOn ? "Sound: ON" : "Sound: OFF"}
            </button>

            <button
              onClick={() => {
                if (skipHandlerRef.current) {
                  skipHandlerRef.current();
                }
              }}
              style={{
                ...glassButtonStyle,
                background:
                  "linear-gradient(135deg, rgba(88,125,255,0.35), rgba(255,96,140,0.28))",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              Skip Intro
            </button>
          </div>
        </div>
      </div>

      {/* left bottom status */}
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          zIndex: 20,
          width: "min(300px, calc(100vw - 48px))",
          padding: "18px 18px 16px",
          borderRadius: 22,
          background: "rgba(10, 14, 28, 0.42)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
          backdropFilter: "blur(14px)",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            marginBottom: 12,
          }}
        >
          Flight Status
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <Stat label="Target" value="Japan" />
          <Stat label="Mode" value="Cinematic" />
          <Stat label="Orbit" value="Active" />
          <Stat label="Marker" value="Locked" />
        </div>

        <div
          style={{
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.6,
          }}
        >
          Premium orbital intro sequence with guided approach, target locking,
          Earth cloud layer and atmospheric reveal.
        </div>
      </div>

      {/* bottom center stage tracker */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          minWidth: "min(520px, calc(100vw - 48px))",
          maxWidth: "calc(100vw - 48px)",
          padding: "18px 22px",
          borderRadius: 22,
          background: "rgba(10, 14, 28, 0.42)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
          backdropFilter: "blur(14px)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "0.76rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            marginBottom: 8,
          }}
        >
          Current Stage
        </div>

        <div
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {stageText[zoomStage]}
        </div>

        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: `${((zoomStage + 1) / stageText.length) * 100}%`,
              height: "100%",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, #5ea3ff 0%, #7b8cff 42%, #ff6f8f 100%)",
              boxShadow: "0 0 24px rgba(123,140,255,0.35)",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
            fontSize: "0.88rem",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span>Auto Zoom</span>
          <span>•</span>
          <span>Wheel Control</span>
          <span>•</span>
          <span>Drag Rotate</span>
        </div>
      </div>

      {/* JAPAN reveal */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 18,
          pointerEvents: "none",
          opacity: showJapanReveal ? 1 : 0,
          transform: showJapanReveal ? "scale(1)" : "scale(0.94)",
          transition: "all 900ms ease",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "24px 30px",
            borderRadius: 28,
            background: "rgba(10, 14, 28, 0.24)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              fontSize: "0.88rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              marginBottom: 12,
            }}
          >
            Destination Locked
          </div>

          <div
            style={{
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              color: "#ffffff",
              textShadow:
                "0 0 18px rgba(255,255,255,0.2), 0 0 40px rgba(88,125,255,0.22), 0 0 60px rgba(255,96,140,0.18)",
            }}
          >
            JAPAN
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: "1rem",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Entering dream trajectory...
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      style={{
        padding: "12px 12px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.52)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const glassButtonStyle = {
  appearance: "none",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 14,
  fontSize: "0.92rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.25s ease",
  backdropFilter: "blur(8px)",
};























































// // "use client";

// // import { useEffect, useRef, useState } from "react";

// // export default function AnimationLanding({ onAnimationComplete }) {
// //   const containerRef = useRef(null);
// //   const cleanupRef = useRef(null);

// //   const [zoomStage, setZoomStage] = useState(0);
// //   const [soundOn, setSoundOn] = useState(false);
// //   const [showJapanReveal, setShowJapanReveal] = useState(false);
// //   const [isSkipping, setIsSkipping] = useState(false);

// //   useEffect(() => {
// //     let mounted = true;

// //     const loadScript = (src) =>
// //       new Promise((resolve, reject) => {
// //         const existing = document.querySelector(`script[src="${src}"]`);
// //         if (existing) {
// //           if (existing.dataset.loaded === "true") return resolve();
// //           existing.addEventListener("load", resolve, { once: true });
// //           existing.addEventListener("error", reject, { once: true });
// //           return;
// //         }

// //         const script = document.createElement("script");
// //         script.src = src;
// //         script.async = false;
// //         script.onload = () => {
// //           script.dataset.loaded = "true";
// //           resolve();
// //         };
// //         script.onerror = reject;
// //         document.head.appendChild(script);
// //       });

// //     const initScene = async () => {
// //       try {
// //         // Three.js + OrbitControls
// //         if (!window.THREE) {
// //           await loadScript(
// //             "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"
// //           );
// //         }

// //         if (!window.THREE?.OrbitControls) {
// //           await loadScript(
// //             "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"
// //           );
// //         }

// //         if (!mounted || !containerRef.current) return;

// //         const THREE = window.THREE;
// //         const OrbitControls = THREE.OrbitControls;
// //         const container = containerRef.current;

// //         // =========================================================
// //         // Scene / Camera / Renderer
// //         // =========================================================
// //         const scene = new THREE.Scene();
// //         scene.background = new THREE.Color(0x02040a);
// //         scene.fog = new THREE.FogExp2(0x030611, 0.00032);

// //         const camera = new THREE.PerspectiveCamera(
// //           52,
// //           window.innerWidth / window.innerHeight,
// //           0.1,
// //           40000
// //         );

// //         camera.position.set(0, 140, 2200);

// //         const renderer = new THREE.WebGLRenderer({
// //           antialias: true,
// //           alpha: false,
// //           powerPreference: "high-performance",
// //         });
// //         renderer.setSize(window.innerWidth, window.innerHeight);
// //         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// //         renderer.outputEncoding = THREE.sRGBEncoding;
// //         renderer.shadowMap.enabled = false;
// //         container.appendChild(renderer.domElement);

// //         // =========================================================
// //         // Audio
// //         // =========================================================
// //         let audioCtx = null;
// //         let gainNode = null;
// //         let oscillator = null;
// //         let audioStarted = false;

// //         const startAmbientSound = () => {
// //           try {
// //             if (audioStarted) return;
// //             audioStarted = true;

// //             const AudioContext =
// //               window.AudioContext || window.webkitAudioContext;
// //             if (!AudioContext) return;

// //             audioCtx = new AudioContext();
// //             oscillator = audioCtx.createOscillator();
// //             gainNode = audioCtx.createGain();

// //             oscillator.type = "sine";
// //             oscillator.frequency.value = 72;
// //             gainNode.gain.value = 0.015;

// //             oscillator.connect(gainNode);
// //             gainNode.connect(audioCtx.destination);
// //             oscillator.start();
// //           } catch (e) {
// //             console.warn("Audio init failed:", e);
// //           }
// //         };

// //         const stopAmbientSound = () => {
// //           try {
// //             if (oscillator) {
// //               oscillator.stop();
// //               oscillator.disconnect();
// //             }
// //           } catch {}
// //           oscillator = null;

// //           try {
// //             if (gainNode) gainNode.disconnect();
// //           } catch {}
// //           gainNode = null;

// //           if (audioCtx && audioCtx.state !== "closed") {
// //             audioCtx.close();
// //           }
// //           audioCtx = null;
// //           audioStarted = false;
// //         };

// //         // =========================================================
// //         // Controls
// //         // =========================================================
// //         const controls = new OrbitControls(camera, renderer.domElement);
// //         controls.enablePan = false;
// //         controls.enableRotate = true;
// //         controls.enableZoom = true;
// //         controls.rotateSpeed = 0.55;
// //         controls.zoomSpeed = 0.9;
// //         controls.dampingFactor = 0.06;
// //         controls.enableDamping = true;
// //         controls.autoRotate = true;
// //         controls.autoRotateSpeed = 0.22;
// //         controls.minDistance = 40;
// //         controls.maxDistance = 2600;
// //         controls.minPolarAngle = Math.PI * 0.22;
// //         controls.maxPolarAngle = Math.PI * 0.78;

// //         // =========================================================
// //         // Lights
// //         // =========================================================
// //         const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
// //         scene.add(ambientLight);

// //         const sunLight = new THREE.PointLight(0xffffff, 2.5, 20000);
// //         sunLight.position.set(950, 300, 900);
// //         scene.add(sunLight);

// //         const blueRim = new THREE.PointLight(0x65a8ff, 1.7, 9000);
// //         blueRim.position.set(-500, -180, 600);
// //         scene.add(blueRim);

// //         const pinkFill = new THREE.PointLight(0xff6a8e, 0.8, 6000);
// //         pinkFill.position.set(0, 300, -400);
// //         scene.add(pinkFill);

// //         // =========================================================
// //         // Starfield
// //         // =========================================================
// //         const starGeometry = new THREE.BufferGeometry();
// //         const starCount = 26000;
// //         const starPositions = new Float32Array(starCount * 3);

// //         for (let i = 0; i < starCount; i++) {
// //           const i3 = i * 3;
// //           const radius = 2800 + Math.random() * 14000;
// //           const theta = Math.random() * Math.PI * 2;
// //           const phi = Math.acos(2 * Math.random() - 1);

// //           starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
// //           starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
// //           starPositions[i3 + 2] = radius * Math.cos(phi);
// //         }

// //         starGeometry.setAttribute(
// //           "position",
// //           new THREE.BufferAttribute(starPositions, 3)
// //         );

// //         const starMaterial = new THREE.PointsMaterial({
// //           color: 0xffffff,
// //           size: 1.9,
// //           transparent: true,
// //           opacity: 0.95,
// //           sizeAttenuation: true,
// //         });

// //         const stars = new THREE.Points(starGeometry, starMaterial);
// //         scene.add(stars);

// //         // =========================================================
// //         // Deep glow particles / nebula
// //         // =========================================================
// //         const nebulaGeometry = new THREE.BufferGeometry();
// //         const nebulaCount = 9000;
// //         const nebulaPositions = new Float32Array(nebulaCount * 3);

// //         for (let i = 0; i < nebulaCount * 3; i++) {
// //           nebulaPositions[i] = (Math.random() - 0.5) * 18000;
// //         }

// //         nebulaGeometry.setAttribute(
// //           "position",
// //           new THREE.BufferAttribute(nebulaPositions, 3)
// //         );

// //         const nebulaMaterial = new THREE.PointsMaterial({
// //           color: 0x728cff,
// //           size: 22,
// //           transparent: true,
// //           opacity: 0.07,
// //           sizeAttenuation: true,
// //         });

// //         const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
// //         scene.add(nebula);

// //         // =========================================================
// //         // Earth texture via canvas
// //         // =========================================================
// //         const earthRadius = 110;
// //         const earthGeometry = new THREE.SphereGeometry(earthRadius, 96, 96);

// //         const earthCanvas = document.createElement("canvas");
// //         earthCanvas.width = 2048;
// //         earthCanvas.height = 1024;
// //         const earthCtx = earthCanvas.getContext("2d");

// //         // ocean gradient
// //         const oceanGrad = earthCtx.createLinearGradient(0, 0, 2048, 1024);
// //         oceanGrad.addColorStop(0, "#143c9c");
// //         oceanGrad.addColorStop(0.3, "#1b56ca");
// //         oceanGrad.addColorStop(0.65, "#0e3f98");
// //         oceanGrad.addColorStop(1, "#072868");
// //         earthCtx.fillStyle = oceanGrad;
// //         earthCtx.fillRect(0, 0, 2048, 1024);

// //         // subtle ocean noise
// //         for (let i = 0; i < 5000; i++) {
// //           earthCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
// //           earthCtx.fillRect(
// //             Math.random() * 2048,
// //             Math.random() * 1024,
// //             Math.random() * 3 + 1,
// //             Math.random() * 3 + 1
// //           );
// //         }

// //         // land helper
// //         const drawLand = (x, y, rx, ry, rot = 0, color = "#4ea55e") => {
// //           earthCtx.save();
// //           earthCtx.translate(x, y);
// //           earthCtx.rotate(rot);
// //           earthCtx.fillStyle = color;
// //           earthCtx.beginPath();
// //           earthCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
// //           earthCtx.fill();
// //           earthCtx.restore();
// //         };

// //         // rough continent distribution
// //         // North America
// //         drawLand(300, 260, 180, 120, -0.25, "#4e9f58");
// //         drawLand(350, 390, 80, 90, 0.2, "#4e9f58");

// //         // South America
// //         drawLand(470, 650, 90, 160, 0.18, "#4a9a55");

// //         // Europe / Africa
// //         drawLand(1010, 260, 95, 70, 0.1, "#5eaf62");
// //         drawLand(1060, 480, 120, 180, 0.08, "#519f5a");

// //         // Asia
// //         drawLand(1380, 300, 300, 150, 0.05, "#5cad61");
// //         drawLand(1500, 390, 120, 70, -0.1, "#5cad61");

// //         // Japan islands area
// //         drawLand(1595, 310, 18, 40, -0.45, "#73c56f");
// //         drawLand(1622, 345, 12, 22, -0.35, "#73c56f");

// //         // Australia
// //         drawLand(1590, 760, 120, 70, 0.1, "#4c9f58");

// //         // land highlights
// //         for (let i = 0; i < 450; i++) {
// //           earthCtx.fillStyle = "rgba(255,255,255,0.03)";
// //           earthCtx.beginPath();
// //           earthCtx.arc(
// //             Math.random() * 2048,
// //             Math.random() * 1024,
// //             Math.random() * 10 + 2,
// //             0,
// //             Math.PI * 2
// //           );
// //           earthCtx.fill();
// //         }

// //         const earthTexture = new THREE.CanvasTexture(earthCanvas);
// //         earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// //         const earthMaterial = new THREE.MeshPhongMaterial({
// //           map: earthTexture,
// //           shininess: 24,
// //           specular: 0x35558d,
// //         });

// //         const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// //         scene.add(earth);

// //         // =========================================================
// //         // Cloud layer
// //         // =========================================================
// //         const cloudGeometry = new THREE.SphereGeometry(earthRadius + 2.4, 96, 96);

// //         const cloudCanvas = document.createElement("canvas");
// //         cloudCanvas.width = 2048;
// //         cloudCanvas.height = 1024;
// //         const cloudCtx = cloudCanvas.getContext("2d");
// //         cloudCtx.clearRect(0, 0, 2048, 1024);

// //         for (let i = 0; i < 280; i++) {
// //           cloudCtx.save();
// //           cloudCtx.globalAlpha = 0.04 + Math.random() * 0.07;
// //           cloudCtx.fillStyle = "#ffffff";
// //           cloudCtx.translate(Math.random() * 2048, Math.random() * 1024);
// //           cloudCtx.rotate(Math.random() * Math.PI);
// //           cloudCtx.beginPath();
// //           cloudCtx.ellipse(
// //             0,
// //             0,
// //             40 + Math.random() * 120,
// //             10 + Math.random() * 34,
// //             0,
// //             0,
// //             Math.PI * 2
// //           );
// //           cloudCtx.fill();
// //           cloudCtx.restore();
// //         }

// //         const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
// //         const cloudMaterial = new THREE.MeshPhongMaterial({
// //           map: cloudTexture,
// //           transparent: true,
// //           opacity: 0.55,
// //           depthWrite: false,
// //         });

// //         const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
// //         earth.add(clouds);

// //         // =========================================================
// //         // Atmosphere glow
// //         // =========================================================
// //         const atmosphereGeometry = new THREE.SphereGeometry(
// //           earthRadius + 8,
// //           96,
// //           96
// //         );
// //         const atmosphereMaterial = new THREE.MeshPhongMaterial({
// //           color: 0x70c9ff,
// //           transparent: true,
// //           opacity: 0.14,
// //           side: THREE.BackSide,
// //           blending: THREE.AdditiveBlending,
// //         });

// //         const atmosphere = new THREE.Mesh(
// //           atmosphereGeometry,
// //           atmosphereMaterial
// //         );
// //         earth.add(atmosphere);

// //         // =========================================================
// //         // Moon + orbit
// //         // =========================================================
// //         const moonPivot = new THREE.Object3D();
// //         scene.add(moonPivot);

// //         const moonGeometry = new THREE.SphereGeometry(30, 48, 48);
// //         const moonCanvas = document.createElement("canvas");
// //         moonCanvas.width = 512;
// //         moonCanvas.height = 512;
// //         const moonCtx = moonCanvas.getContext("2d");

// //         moonCtx.fillStyle = "#a3aab7";
// //         moonCtx.fillRect(0, 0, 512, 512);

// //         for (let i = 0; i < 80; i++) {
// //           moonCtx.fillStyle = i % 2 === 0 ? "#7e8797" : "#9199a8";
// //           moonCtx.beginPath();
// //           moonCtx.arc(
// //             Math.random() * 512,
// //             Math.random() * 512,
// //             8 + Math.random() * 30,
// //             0,
// //             Math.PI * 2
// //           );
// //           moonCtx.fill();
// //         }

// //         const moonTexture = new THREE.CanvasTexture(moonCanvas);
// //         const moonMaterial = new THREE.MeshPhongMaterial({
// //           map: moonTexture,
// //           shininess: 4,
// //           specular: 0x222222,
// //         });

// //         const moon = new THREE.Mesh(moonGeometry, moonMaterial);
// //         moon.position.set(380, 120, -100);
// //         moonPivot.add(moon);

// //         // =========================================================
// //         // Japan marker
// //         // =========================================================
// //         const latLonToVector3 = (lat, lon, radius) => {
// //           const phi = (90 - lat) * (Math.PI / 180);
// //           const theta = (lon + 180) * (Math.PI / 180);

// //           return new THREE.Vector3(
// //             -(radius * Math.sin(phi) * Math.cos(theta)),
// //             radius * Math.cos(phi),
// //             radius * Math.sin(phi) * Math.sin(theta)
// //           );
// //         };

// //         // slightly adjusted so it visually lands near Japan area in our custom texture
// //         const japanPos = latLonToVector3(36.2, 138.2, earthRadius + 1.5);

// //         const markerGroup = new THREE.Group();
// //         earth.add(markerGroup);
// //         markerGroup.position.copy(japanPos);

// //         const markerGeometry = new THREE.SphereGeometry(3.4, 20, 20);
// //         const markerMaterial = new THREE.MeshBasicMaterial({
// //           color: 0xff5c82,
// //         });
// //         const japanMarker = new THREE.Mesh(markerGeometry, markerMaterial);
// //         markerGroup.add(japanMarker);

// //         const glowGeometry = new THREE.SphereGeometry(8, 20, 20);
// //         const glowMaterial = new THREE.MeshBasicMaterial({
// //           color: 0xff7d9a,
// //           transparent: true,
// //           opacity: 0.42,
// //           blending: THREE.AdditiveBlending,
// //         });
// //         const markerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
// //         markerGroup.add(markerGlow);

// //         // pulse ring
// //         const ringGeometry = new THREE.RingGeometry(8, 11, 48);
// //         const ringMaterial = new THREE.MeshBasicMaterial({
// //           color: 0xff7f98,
// //           transparent: true,
// //           opacity: 0.75,
// //           side: THREE.DoubleSide,
// //         });
// //         const pulseRing = new THREE.Mesh(ringGeometry, ringMaterial);
// //         pulseRing.position.set(0, 0, 0);
// //         pulseRing.lookAt(new THREE.Vector3(0, 0, 0));
// //         pulseRing.rotateX(Math.PI / 2);
// //         markerGroup.add(pulseRing);

// //         // line spike
// //         const spikeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 18, 10);
// //         const spikeMaterial = new THREE.MeshBasicMaterial({
// //           color: 0xff9eb1,
// //         });
// //         const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
// //         spike.position.y = 10;
// //         markerGroup.add(spike);

// //         // =========================================================
// //         // Camera target helpers
// //         // =========================================================
// //         const lookTarget = new THREE.Vector3(0, 0, 0);
// //         const desiredTarget = new THREE.Vector3(0, 0, 0);
// //         const desiredCameraPos = new THREE.Vector3(0, 120, 2200);

// //         // World position of Japan marker
// //         const getJapanWorldPos = () => {
// //           const p = new THREE.Vector3();
// //           markerGroup.getWorldPosition(p);
// //           return p;
// //         };

// //         // =========================================================
// //         // Stages
// //         // =========================================================
// //         const stages = [
// //           {
// //             label: "Deep Space",
// //             camera: new THREE.Vector3(0, 160, 2200),
// //             targetType: "earth",
// //             autoDelay: 2300,
// //           },
// //           {
// //             label: "Earth in View",
// //             camera: new THREE.Vector3(260, 120, 1050),
// //             targetType: "earth",
// //             autoDelay: 1800,
// //           },
// //           {
// //             label: "Orbital Descent",
// //             camera: new THREE.Vector3(200, 70, 420),
// //             targetType: "earth",
// //             autoDelay: 1800,
// //           },
// //           {
// //             label: "Japan Lock",
// //             camera: new THREE.Vector3(115, 35, 170),
// //             targetType: "japan",
// //             autoDelay: 1700,
// //           },
// //           {
// //             label: "Entering Japan",
// //             camera: new THREE.Vector3(55, 18, 72),
// //             targetType: "japan",
// //             autoDelay: 1300,
// //           },
// //         ];

// //         let currentStage = 0;
// //         let autoTimer = null;
// //         let finishTimer = null;
// //         let animationId = null;
// //         let completed = false;
// //         let lastWheelTime = 0;
// //         let userInteracted = false;
// //         let introDone = false;

// //         const updateStageTargets = (stageIndex) => {
// //           const stage = stages[stageIndex];
// //           if (!stage) return;

// //           desiredCameraPos.copy(stage.camera);

// //           if (stage.targetType === "japan") {
// //             desiredTarget.copy(getJapanWorldPos());
// //           } else {
// //             desiredTarget.set(0, 0, 0);
// //           }

// //           setZoomStage(stageIndex);
// //         };

// //         const completeIntro = () => {
// //           if (introDone) return;
// //           introDone = true;
// //           setShowJapanReveal(true);

// //           finishTimer = setTimeout(() => {
// //             onAnimationComplete?.();
// //           }, 1600);
// //         };

// //         const setStage = (stageIndex) => {
// //           const clamped = Math.max(0, Math.min(stageIndex, stages.length - 1));
// //           currentStage = clamped;
// //           updateStageTargets(clamped);

// //           if (clamped === stages.length - 1 && !completed) {
// //             completed = true;
// //             completeIntro();
// //           } else if (clamped < stages.length - 1) {
// //             completed = false;
// //             setShowJapanReveal(false);
// //           }
// //         };

// //         const scheduleAuto = () => {
// //           clearTimeout(autoTimer);

// //           if (userInteracted) return;
// //           if (currentStage >= stages.length - 1) return;

// //           autoTimer = setTimeout(() => {
// //             if (!userInteracted && currentStage < stages.length - 1) {
// //               setStage(currentStage + 1);
// //               scheduleAuto();
// //             }
// //           }, stages[currentStage]?.autoDelay || 1800);
// //         };

// //         // =========================================================
// //         // User interaction
// //         // =========================================================
// //         const handleWheel = (e) => {
// //           e.preventDefault();

// //           userInteracted = true;
// //           controls.autoRotate = false;
// //           clearTimeout(autoTimer);

// //           const now = Date.now();
// //           if (now - lastWheelTime < 180) return;
// //           lastWheelTime = now;

// //           if (e.deltaY > 0 && currentStage < stages.length - 1) {
// //             setStage(currentStage + 1);
// //           } else if (e.deltaY < 0 && currentStage > 0) {
// //             clearTimeout(finishTimer);
// //             introDone = false;
// //             completed = false;
// //             setShowJapanReveal(false);
// //             setStage(currentStage - 1);
// //           }
// //         };

// //         const handlePointerDown = () => {
// //           userInteracted = true;
// //           controls.autoRotate = false;
// //           clearTimeout(autoTimer);
// //         };

// //         const handleSkip = () => {
// //           if (isSkipping) return;
// //           setIsSkipping(true);
// //           clearTimeout(autoTimer);
// //           clearTimeout(finishTimer);
// //           setStage(stages.length - 1);

// //           setTimeout(() => {
// //             onAnimationComplete?.();
// //           }, 500);
// //         };

// //         // expose skip to button
// //         window.__JAPAN_DREAM_SKIP_INTRO__ = handleSkip;

// //         renderer.domElement.addEventListener("wheel", handleWheel, {
// //           passive: false,
// //         });
// //         renderer.domElement.addEventListener("pointerdown", handlePointerDown);

// //         // =========================================================
// //         // Resize
// //         // =========================================================
// //         const handleResize = () => {
// //           camera.aspect = window.innerWidth / window.innerHeight;
// //           camera.updateProjectionMatrix();
// //           renderer.setSize(window.innerWidth, window.innerHeight);
// //         };
// //         window.addEventListener("resize", handleResize);

// //         // =========================================================
// //         // Initial stage
// //         // =========================================================
// //         updateStageTargets(0);
// //         scheduleAuto();

// //         // =========================================================
// //         // Animate
// //         // =========================================================
// //         const tempTarget = new THREE.Vector3();

// //         const animate = () => {
// //           animationId = requestAnimationFrame(animate);

// //           const time = performance.now() * 0.001;

// //           // Earth slow rotation
// //           earth.rotation.y += 0.00085;
// //           clouds.rotation.y += 0.00125;

// //           // star / nebula drift
// //           stars.rotation.y += 0.000025;
// //           nebula.rotation.y += 0.000012;

// //           // moon orbit
// //           moonPivot.rotation.y += 0.00055;
// //           moon.rotation.y += 0.0006;

// //           // marker pulse
// //           const pulse = 1 + Math.sin(time * 3.2) * 0.18;
// //           markerGlow.scale.set(pulse, pulse, pulse);

// //           const ringPulse = 1 + Math.sin(time * 2.4) * 0.25;
// //           pulseRing.scale.set(ringPulse, ringPulse, ringPulse);
// //           ringMaterial.opacity = 0.45 + (Math.sin(time * 2.4) + 1) * 0.16;

// //           // keep ring facing outward from earth center
// //           pulseRing.lookAt(new THREE.Vector3(0, 0, 0));

// //           // subtle cinematic float
// //           const cinematicYOffset = Math.sin(time * 0.6) * 3.5;

// //           // smooth camera movement
// //           camera.position.x += (desiredCameraPos.x - camera.position.x) * 0.035;
// //           camera.position.y +=
// //             (desiredCameraPos.y + cinematicYOffset - camera.position.y) * 0.04;
// //           camera.position.z += (desiredCameraPos.z - camera.position.z) * 0.04;

// //           // smooth target lock
// //           lookTarget.lerp(desiredTarget, 0.06);
// //           controls.target.copy(lookTarget);

// //           // when user rotates manually, keep some lock softness
// //           controls.update();

// //           // slight camera look stabilization
// //           tempTarget.copy(controls.target);
// //           camera.lookAt(tempTarget);

// //           renderer.render(scene, camera);
// //         };

// //         animate();

// //         cleanupRef.current = () => {
// //           cancelAnimationFrame(animationId);
// //           clearTimeout(autoTimer);
// //           clearTimeout(finishTimer);
// //           stopAmbientSound();

// //           delete window.__JAPAN_DREAM_SKIP_INTRO__;

// //           window.removeEventListener("resize", handleResize);

// //           if (renderer?.domElement) {
// //             renderer.domElement.removeEventListener("wheel", handleWheel);
// //             renderer.domElement.removeEventListener(
// //               "pointerdown",
// //               handlePointerDown
// //             );
// //           }

// //           controls.dispose();

// //           starGeometry.dispose();
// //           starMaterial.dispose();

// //           nebulaGeometry.dispose();
// //           nebulaMaterial.dispose();

// //           earthGeometry.dispose();
// //           earthMaterial.dispose();
// //           cloudGeometry.dispose();
// //           cloudMaterial.dispose();
// //           atmosphereGeometry.dispose();
// //           atmosphereMaterial.dispose();

// //           moonGeometry.dispose();
// //           moonMaterial.dispose();

// //           markerGeometry.dispose();
// //           markerMaterial.dispose();
// //           glowGeometry.dispose();
// //           glowMaterial.dispose();
// //           ringGeometry.dispose();
// //           ringMaterial.dispose();
// //           spikeGeometry.dispose();
// //           spikeMaterial.dispose();

// //           renderer.dispose();

// //           if (container.contains(renderer.domElement)) {
// //             container.removeChild(renderer.domElement);
// //           }
// //         };

// //         // sync sound toggle
// //         const soundSyncInterval = setInterval(() => {
// //           if (soundOn) {
// //             startAmbientSound();
// //           } else {
// //             stopAmbientSound();
// //           }
// //         }, 250);

// //         const oldCleanup = cleanupRef.current;
// //         cleanupRef.current = () => {
// //           clearInterval(soundSyncInterval);
// //           oldCleanup?.();
// //         };
// //       } catch (err) {
// //         console.error("AnimationLanding init error:", err);
// //         onAnimationComplete?.();
// //       }
// //     };

// //     initScene();

// //     return () => {
// //       mounted = false;
// //       if (cleanupRef.current) cleanupRef.current();
// //     };
// //   }, [onAnimationComplete, soundOn, isSkipping]);

// //   const stageText = [
// //     "Deep Space",
// //     "Earth in View",
// //     "Orbital Descent",
// //     "Japan Lock",
// //     "Entering Japan",
// //   ];

// //   return (
// //     <div
// //       ref={containerRef}
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         width: "100vw",
// //         height: "100vh",
// //         zIndex: 9999,
// //         overflow: "hidden",
// //         background:
// //           "radial-gradient(circle at top, #0b1224 0%, #060914 42%, #020308 100%)",
// //         cursor: "grab",
// //       }}
// //     >
// //       {/* top soft vignette */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           inset: 0,
// //           pointerEvents: "none",
// //           background:
// //             "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.24) 100%)",
// //           zIndex: 2,
// //         }}
// //       />

// //       {/* premium top title */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           top: 24,
// //           left: "50%",
// //           transform: "translateX(-50%)",
// //           zIndex: 20,
// //           width: "min(1100px, calc(100% - 24px))",
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "flex-start",
// //           gap: 16,
// //           flexWrap: "wrap",
// //           pointerEvents: "none",
// //         }}
// //       >
// //         <div
// //           style={{
// //             pointerEvents: "auto",
// //             padding: "18px 22px",
// //             borderRadius: 22,
// //             background: "rgba(10, 14, 28, 0.42)",
// //             border: "1px solid rgba(255,255,255,0.12)",
// //             boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //             backdropFilter: "blur(14px)",
// //             maxWidth: 760,
// //           }}
// //         >
// //           <div
// //             style={{
// //               display: "inline-flex",
// //               alignItems: "center",
// //               gap: 10,
// //               padding: "8px 14px",
// //               borderRadius: 999,
// //               background: "rgba(255,255,255,0.05)",
// //               border: "1px solid rgba(255,255,255,0.08)",
// //               color: "rgba(255,255,255,0.76)",
// //               fontSize: "0.78rem",
// //               letterSpacing: "0.14em",
// //               textTransform: "uppercase",
// //               marginBottom: 14,
// //             }}
// //           >
// //             Japan Dream Experience
// //           </div>

// //           <h1
// //             style={{
// //               margin: 0,
// //               fontSize: "clamp(2.1rem, 5vw, 4.5rem)",
// //               lineHeight: 1.02,
// //               fontWeight: 800,
// //               color: "#fff",
// //               letterSpacing: "-0.03em",
// //               textShadow: "0 12px 40px rgba(0,0,0,0.42)",
// //             }}
// //           >
// //             Journey to Japan
// //           </h1>

// //           <p
// //             style={{
// //               margin: "14px 0 0",
// //               color: "rgba(255,255,255,0.72)",
// //               fontSize: "clamp(0.95rem, 1.6vw, 1.08rem)",
// //               lineHeight: 1.6,
// //               maxWidth: 720,
// //             }}
// //           >
// //             Cinematic orbital entry into Japan with auto zoom, mouse drag
// //             rotation, wheel zoom, moon orbit, cloud layer, live stage tracking
// //             and premium HUD styling.
// //           </p>
// //         </div>

// //         {/* right control glass */}
// //         <div
// //           style={{
// //             pointerEvents: "auto",
// //             minWidth: 250,
// //             padding: "16px",
// //             borderRadius: 20,
// //             background: "rgba(10, 14, 28, 0.42)",
// //             border: "1px solid rgba(255,255,255,0.12)",
// //             boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //             backdropFilter: "blur(14px)",
// //             color: "#fff",
// //           }}
// //         >
// //           <div
// //             style={{
// //               fontSize: "0.76rem",
// //               letterSpacing: "0.14em",
// //               textTransform: "uppercase",
// //               color: "rgba(255,255,255,0.55)",
// //               marginBottom: 12,
// //             }}
// //           >
// //             Controls
// //           </div>

// //           <div
// //             style={{
// //               display: "grid",
// //               gap: 10,
// //               fontSize: "0.95rem",
// //               color: "rgba(255,255,255,0.82)",
// //               marginBottom: 16,
// //             }}
// //           >
// //             <div>• Drag to rotate</div>
// //             <div>• Mouse wheel to zoom stages</div>
// //             <div>• Auto cinematic descent</div>
// //           </div>

// //           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
// //             <button
// //               onClick={() => setSoundOn((prev) => !prev)}
// //               style={glassButtonStyle}
// //             >
// //               {soundOn ? "Sound: ON" : "Sound: OFF"}
// //             </button>

// //             <button
// //               onClick={() => {
// //                 if (window.__JAPAN_DREAM_SKIP_INTRO__) {
// //                   window.__JAPAN_DREAM_SKIP_INTRO__();
// //                 }
// //               }}
// //               style={{
// //                 ...glassButtonStyle,
// //                 background:
// //                   "linear-gradient(135deg, rgba(88,125,255,0.35), rgba(255,96,140,0.28))",
// //                 border: "1px solid rgba(255,255,255,0.16)",
// //               }}
// //             >
// //               Skip Intro
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* left stats card */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           left: 24,
// //           bottom: 24,
// //           zIndex: 20,
// //           width: "min(300px, calc(100vw - 48px))",
// //           padding: "18px 18px 16px",
// //           borderRadius: 22,
// //           background: "rgba(10, 14, 28, 0.42)",
// //           border: "1px solid rgba(255,255,255,0.12)",
// //           boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //           backdropFilter: "blur(14px)",
// //           color: "#fff",
// //         }}
// //       >
// //         <div
// //           style={{
// //             fontSize: "0.75rem",
// //             letterSpacing: "0.14em",
// //             textTransform: "uppercase",
// //             color: "rgba(255,255,255,0.55)",
// //             marginBottom: 12,
// //           }}
// //         >
// //           Flight Status
// //         </div>

// //         <div
// //           style={{
// //             display: "grid",
// //             gridTemplateColumns: "1fr 1fr",
// //             gap: 10,
// //             marginBottom: 14,
// //           }}
// //         >
// //           <Stat label="Target" value="Japan" />
// //           <Stat label="Mode" value="Cinematic" />
// //           <Stat label="Orbit" value="Active" />
// //           <Stat label="Marker" value="Locked" />
// //         </div>

// //         <div
// //           style={{
// //             fontSize: "0.78rem",
// //             color: "rgba(255,255,255,0.6)",
// //             lineHeight: 1.6,
// //           }}
// //         >
// //           Premium orbital intro sequence with guided approach, target locking,
// //           Earth cloud layer and atmospheric reveal.
// //         </div>
// //       </div>

// //       {/* bottom center stage tracker */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           bottom: 24,
// //           left: "50%",
// //           transform: "translateX(-50%)",
// //           zIndex: 20,
// //           minWidth: "min(520px, calc(100vw - 48px))",
// //           maxWidth: "calc(100vw - 48px)",
// //           padding: "18px 22px",
// //           borderRadius: 22,
// //           background: "rgba(10, 14, 28, 0.42)",
// //           border: "1px solid rgba(255,255,255,0.12)",
// //           boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //           backdropFilter: "blur(14px)",
// //           color: "#fff",
// //           textAlign: "center",
// //         }}
// //       >
// //         <div
// //           style={{
// //             fontSize: "0.76rem",
// //             letterSpacing: "0.14em",
// //             textTransform: "uppercase",
// //             color: "rgba(255,255,255,0.55)",
// //             marginBottom: 8,
// //           }}
// //         >
// //           Current Stage
// //         </div>

// //         <div
// //           style={{
// //             fontSize: "clamp(1rem, 2vw, 1.25rem)",
// //             fontWeight: 700,
// //             marginBottom: 14,
// //           }}
// //         >
// //           {stageText[zoomStage]}
// //         </div>

// //         <div
// //           style={{
// //             height: 6,
// //             borderRadius: 999,
// //             background: "rgba(255,255,255,0.08)",
// //             overflow: "hidden",
// //             marginBottom: 12,
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: `${((zoomStage + 1) / stageText.length) * 100}%`,
// //               height: "100%",
// //               borderRadius: 999,
// //               background:
// //                 "linear-gradient(90deg, #5ea3ff 0%, #7b8cff 42%, #ff6f8f 100%)",
// //               boxShadow: "0 0 24px rgba(123,140,255,0.35)",
// //               transition: "width 0.5s ease",
// //             }}
// //           />
// //         </div>

// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "center",
// //             gap: 10,
// //             flexWrap: "wrap",
// //             fontSize: "0.88rem",
// //             color: "rgba(255,255,255,0.7)",
// //           }}
// //         >
// //           <span>Auto Zoom</span>
// //           <span>•</span>
// //           <span>Wheel Control</span>
// //           <span>•</span>
// //           <span>Drag Rotate</span>
// //         </div>
// //       </div>

// //       {/* japan reveal */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           inset: 0,
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           zIndex: 18,
// //           pointerEvents: "none",
// //           opacity: showJapanReveal ? 1 : 0,
// //           transform: showJapanReveal ? "scale(1)" : "scale(0.94)",
// //           transition: "all 900ms ease",
// //         }}
// //       >
// //         <div
// //           style={{
// //             textAlign: "center",
// //             padding: "24px 30px",
// //             borderRadius: 28,
// //             background: "rgba(10, 14, 28, 0.24)",
// //             backdropFilter: "blur(8px)",
// //           }}
// //         >
// //           <div
// //             style={{
// //               fontSize: "0.88rem",
// //               letterSpacing: "0.18em",
// //               textTransform: "uppercase",
// //               color: "rgba(255,255,255,0.7)",
// //               marginBottom: 12,
// //             }}
// //           >
// //             Destination Locked
// //           </div>

// //           <div
// //             style={{
// //               fontSize: "clamp(2.8rem, 8vw, 6rem)",
// //               fontWeight: 900,
// //               letterSpacing: "-0.05em",
// //               color: "#ffffff",
// //               textShadow:
// //                 "0 0 18px rgba(255,255,255,0.2), 0 0 40px rgba(88,125,255,0.22), 0 0 60px rgba(255,96,140,0.18)",
// //             }}
// //           >
// //             JAPAN
// //           </div>

// //           <div
// //             style={{
// //               marginTop: 10,
// //               fontSize: "1rem",
// //               color: "rgba(255,255,255,0.72)",
// //             }}
// //           >
// //             Entering dream trajectory...
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function Stat({ label, value }) {
// //   return (
// //     <div
// //       style={{
// //         padding: "12px 12px",
// //         borderRadius: 16,
// //         background: "rgba(255,255,255,0.04)",
// //         border: "1px solid rgba(255,255,255,0.08)",
// //       }}
// //     >
// //       <div
// //         style={{
// //           fontSize: "0.72rem",
// //           letterSpacing: "0.12em",
// //           textTransform: "uppercase",
// //           color: "rgba(255,255,255,0.52)",
// //           marginBottom: 6,
// //         }}
// //       >
// //         {label}
// //       </div>
// //       <div
// //         style={{
// //           fontSize: "1rem",
// //           fontWeight: 700,
// //           color: "#fff",
// //         }}
// //       >
// //         {value}
// //       </div>
// //     </div>
// //   );
// // }

// // const glassButtonStyle = {
// //   appearance: "none",
// //   border: "1px solid rgba(255,255,255,0.12)",
// //   background: "rgba(255,255,255,0.06)",
// //   color: "#fff",
// //   padding: "10px 14px",
// //   borderRadius: 14,
// //   fontSize: "0.92rem",
// //   fontWeight: 600,
// //   cursor: "pointer",
// //   transition: "all 0.25s ease",
// //   backdropFilter: "blur(8px)",
// // };



// // "use client";

// // import { useEffect, useRef, useState } from "react";
// // import * as THREE from "three";
// // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// // export default function AnimationLanding({ onAnimationComplete }) {
// //   const containerRef = useRef(null);
// //   const cleanupRef = useRef(null);

// //   const [zoomStage, setZoomStage] = useState(0);
// //   const [soundOn, setSoundOn] = useState(false);
// //   const [showJapanReveal, setShowJapanReveal] = useState(false);

// //   // audio refs so sound can toggle without rebuilding WebGL scene
// //   const audioCtxRef = useRef(null);
// //   const gainNodeRef = useRef(null);
// //   const oscillatorRef = useRef(null);
// //   const audioStartedRef = useRef(false);

// //   // skip handler ref
// //   const skipHandlerRef = useRef(null);

// //   // =========================================================
// //   // AUDIO HELPERS
// //   // =========================================================
// //   const startAmbientSound = () => {
// //     try {
// //       if (audioStartedRef.current) return;

// //       const AudioContext =
// //         window.AudioContext || window.webkitAudioContext;
// //       if (!AudioContext) return;

// //       const audioCtx = new AudioContext();
// //       const oscillator = audioCtx.createOscillator();
// //       const gainNode = audioCtx.createGain();

// //       oscillator.type = "sine";
// //       oscillator.frequency.value = 72;
// //       gainNode.gain.value = 0.015;

// //       oscillator.connect(gainNode);
// //       gainNode.connect(audioCtx.destination);
// //       oscillator.start();

// //       audioCtxRef.current = audioCtx;
// //       gainNodeRef.current = gainNode;
// //       oscillatorRef.current = oscillator;
// //       audioStartedRef.current = true;
// //     } catch (e) {
// //       console.warn("Audio init failed:", e);
// //     }
// //   };

// //   const stopAmbientSound = () => {
// //     try {
// //       if (oscillatorRef.current) {
// //         oscillatorRef.current.stop();
// //         oscillatorRef.current.disconnect();
// //       }
// //     } catch {}

// //     try {
// //       if (gainNodeRef.current) {
// //         gainNodeRef.current.disconnect();
// //       }
// //     } catch {}

// //     try {
// //       if (
// //         audioCtxRef.current &&
// //         audioCtxRef.current.state !== "closed"
// //       ) {
// //         audioCtxRef.current.close();
// //       }
// //     } catch {}

// //     oscillatorRef.current = null;
// //     gainNodeRef.current = null;
// //     audioCtxRef.current = null;
// //     audioStartedRef.current = false;
// //   };

// //   // =========================================================
// //   // MAIN 3D EFFECT -> RUN ONLY ONCE
// //   // =========================================================
// //   useEffect(() => {
// //     if (!containerRef.current) return;

// //     let mounted = true;
// //     const container = containerRef.current;

// //     let scene,
// //       camera,
// //       renderer,
// //       controls,
// //       animationId,
// //       autoTimer,
// //       finishTimer;

// //     let stars,
// //       nebula,
// //       earth,
// //       clouds,
// //       atmosphere,
// //       moonPivot,
// //       moon,
// //       markerGlow,
// //       pulseRing;

// //     let starGeometry,
// //       starMaterial,
// //       nebulaGeometry,
// //       nebulaMaterial,
// //       earthGeometry,
// //       earthMaterial,
// //       cloudGeometry,
// //       cloudMaterial,
// //       atmosphereGeometry,
// //       atmosphereMaterial,
// //       moonGeometry,
// //       moonMaterial,
// //       markerGeometry,
// //       markerMaterial,
// //       glowGeometry,
// //       glowMaterial,
// //       ringGeometry,
// //       ringMaterial,
// //       spikeGeometry,
// //       spikeMaterial;

// //     const initScene = () => {
// //       try {
// //         // -----------------------------------------------------
// //         // WebGL support check
// //         // -----------------------------------------------------
// //         const testCanvas = document.createElement("canvas");
// //         const gl =
// //           testCanvas.getContext("webgl") ||
// //           testCanvas.getContext("experimental-webgl");

// //         if (!gl) {
// //           console.warn("WebGL not supported. Skipping intro animation.");
// //           onAnimationComplete?.();
// //           return;
// //         }

// //         // =====================================================
// //         // Scene / Camera / Renderer
// //         // =====================================================
// //         scene = new THREE.Scene();
// //         scene.background = new THREE.Color(0x02040a);
// //         scene.fog = new THREE.FogExp2(0x030611, 0.00032);

// //         camera = new THREE.PerspectiveCamera(
// //           52,
// //           window.innerWidth / window.innerHeight,
// //           0.1,
// //           40000
// //         );
// //         camera.position.set(0, 140, 2200);

// //         renderer = new THREE.WebGLRenderer({
// //           antialias: false,
// //           alpha: false,
// //           powerPreference: "default",
// //         });

// //         renderer.setSize(window.innerWidth, window.innerHeight);
// //         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
// //         renderer.outputColorSpace = THREE.SRGBColorSpace;
// //         renderer.shadowMap.enabled = false;

// //         container.appendChild(renderer.domElement);

// //         // =====================================================
// //         // Controls
// //         // =====================================================
// //         controls = new OrbitControls(camera, renderer.domElement);
// //         controls.enablePan = false;
// //         controls.enableRotate = true;
// //         controls.enableZoom = true;
// //         controls.rotateSpeed = 0.55;
// //         controls.zoomSpeed = 0.9;
// //         controls.dampingFactor = 0.06;
// //         controls.enableDamping = true;
// //         controls.autoRotate = true;
// //         controls.autoRotateSpeed = 0.22;
// //         controls.minDistance = 40;
// //         controls.maxDistance = 2600;
// //         controls.minPolarAngle = Math.PI * 0.22;
// //         controls.maxPolarAngle = Math.PI * 0.78;

// //         // =====================================================
// //         // Lights
// //         // =====================================================
// //         const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
// //         scene.add(ambientLight);

// //         const sunLight = new THREE.PointLight(0xffffff, 2.2, 20000);
// //         sunLight.position.set(950, 300, 900);
// //         scene.add(sunLight);

// //         const blueRim = new THREE.PointLight(0x65a8ff, 1.4, 9000);
// //         blueRim.position.set(-500, -180, 600);
// //         scene.add(blueRim);

// //         const pinkFill = new THREE.PointLight(0xff6a8e, 0.7, 6000);
// //         pinkFill.position.set(0, 300, -400);
// //         scene.add(pinkFill);

// //         // =====================================================
// //         // Starfield (reduced)
// //         // =====================================================
// //         starGeometry = new THREE.BufferGeometry();
// //         const starCount = 8000; // reduced from 26000
// //         const starPositions = new Float32Array(starCount * 3);

// //         for (let i = 0; i < starCount; i++) {
// //           const i3 = i * 3;
// //           const radius = 2800 + Math.random() * 14000;
// //           const theta = Math.random() * Math.PI * 2;
// //           const phi = Math.acos(2 * Math.random() - 1);

// //           starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
// //           starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
// //           starPositions[i3 + 2] = radius * Math.cos(phi);
// //         }

// //         starGeometry.setAttribute(
// //           "position",
// //           new THREE.BufferAttribute(starPositions, 3)
// //         );

// //         starMaterial = new THREE.PointsMaterial({
// //           color: 0xffffff,
// //           size: 1.6,
// //           transparent: true,
// //           opacity: 0.95,
// //           sizeAttenuation: true,
// //         });

// //         stars = new THREE.Points(starGeometry, starMaterial);
// //         scene.add(stars);

// //         // =====================================================
// //         // Nebula (reduced)
// //         // =====================================================
// //         nebulaGeometry = new THREE.BufferGeometry();
// //         const nebulaCount = 2500; // reduced from 9000
// //         const nebulaPositions = new Float32Array(nebulaCount * 3);

// //         for (let i = 0; i < nebulaCount * 3; i++) {
// //           nebulaPositions[i] = (Math.random() - 0.5) * 18000;
// //         }

// //         nebulaGeometry.setAttribute(
// //           "position",
// //           new THREE.BufferAttribute(nebulaPositions, 3)
// //         );

// //         nebulaMaterial = new THREE.PointsMaterial({
// //           color: 0x728cff,
// //           size: 18,
// //           transparent: true,
// //           opacity: 0.06,
// //           sizeAttenuation: true,
// //         });

// //         nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
// //         scene.add(nebula);

// //         // =====================================================
// //         // Earth
// //         // =====================================================
// //         const earthRadius = 110;
// //         earthGeometry = new THREE.SphereGeometry(earthRadius, 48, 48);

// //         const earthCanvas = document.createElement("canvas");
// //         earthCanvas.width = 1024;
// //         earthCanvas.height = 512;
// //         const earthCtx = earthCanvas.getContext("2d");

// //         const oceanGrad = earthCtx.createLinearGradient(0, 0, 1024, 512);
// //         oceanGrad.addColorStop(0, "#143c9c");
// //         oceanGrad.addColorStop(0.3, "#1b56ca");
// //         oceanGrad.addColorStop(0.65, "#0e3f98");
// //         oceanGrad.addColorStop(1, "#072868");
// //         earthCtx.fillStyle = oceanGrad;
// //         earthCtx.fillRect(0, 0, 1024, 512);

// //         for (let i = 0; i < 2500; i++) {
// //           earthCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
// //           earthCtx.fillRect(
// //             Math.random() * 1024,
// //             Math.random() * 512,
// //             Math.random() * 2 + 1,
// //             Math.random() * 2 + 1
// //           );
// //         }

// //         const drawLand = (x, y, rx, ry, rot = 0, color = "#4ea55e") => {
// //           earthCtx.save();
// //           earthCtx.translate(x, y);
// //           earthCtx.rotate(rot);
// //           earthCtx.fillStyle = color;
// //           earthCtx.beginPath();
// //           earthCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
// //           earthCtx.fill();
// //           earthCtx.restore();
// //         };

// //         drawLand(150, 130, 90, 60, -0.25, "#4e9f58");
// //         drawLand(175, 195, 40, 45, 0.2, "#4e9f58");
// //         drawLand(235, 325, 45, 80, 0.18, "#4a9a55");
// //         drawLand(505, 130, 48, 35, 0.1, "#5eaf62");
// //         drawLand(530, 240, 60, 90, 0.08, "#519f5a");
// //         drawLand(690, 150, 150, 75, 0.05, "#5cad61");
// //         drawLand(750, 195, 60, 35, -0.1, "#5cad61");
// //         drawLand(800, 155, 9, 20, -0.45, "#73c56f");
// //         drawLand(812, 172, 6, 11, -0.35, "#73c56f");
// //         drawLand(795, 380, 60, 35, 0.1, "#4c9f58");

// //         const earthTexture = new THREE.CanvasTexture(earthCanvas);
// //         earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// //         earthMaterial = new THREE.MeshPhongMaterial({
// //           map: earthTexture,
// //           shininess: 24,
// //           specular: 0x35558d,
// //         });

// //         earth = new THREE.Mesh(earthGeometry, earthMaterial);
// //         scene.add(earth);

// //         // =====================================================
// //         // Clouds
// //         // =====================================================
// //         cloudGeometry = new THREE.SphereGeometry(earthRadius + 2.4, 48, 48);

// //         const cloudCanvas = document.createElement("canvas");
// //         cloudCanvas.width = 1024;
// //         cloudCanvas.height = 512;
// //         const cloudCtx = cloudCanvas.getContext("2d");

// //         for (let i = 0; i < 160; i++) {
// //           cloudCtx.save();
// //           cloudCtx.globalAlpha = 0.04 + Math.random() * 0.07;
// //           cloudCtx.fillStyle = "#ffffff";
// //           cloudCtx.translate(Math.random() * 1024, Math.random() * 512);
// //           cloudCtx.rotate(Math.random() * Math.PI);
// //           cloudCtx.beginPath();
// //           cloudCtx.ellipse(
// //             0,
// //             0,
// //             20 + Math.random() * 60,
// //             8 + Math.random() * 18,
// //             0,
// //             0,
// //             Math.PI * 2
// //           );
// //           cloudCtx.fill();
// //           cloudCtx.restore();
// //         }

// //         const cloudTexture = new THREE.CanvasTexture(cloudCanvas);

// //         cloudMaterial = new THREE.MeshPhongMaterial({
// //           map: cloudTexture,
// //           transparent: true,
// //           opacity: 0.55,
// //           depthWrite: false,
// //         });

// //         clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
// //         earth.add(clouds);

// //         // =====================================================
// //         // Atmosphere
// //         // =====================================================
// //         atmosphereGeometry = new THREE.SphereGeometry(
// //           earthRadius + 8,
// //           48,
// //           48
// //         );

// //         atmosphereMaterial = new THREE.MeshPhongMaterial({
// //           color: 0x70c9ff,
// //           transparent: true,
// //           opacity: 0.14,
// //           side: THREE.BackSide,
// //           blending: THREE.AdditiveBlending,
// //         });

// //         atmosphere = new THREE.Mesh(
// //           atmosphereGeometry,
// //           atmosphereMaterial
// //         );
// //         earth.add(atmosphere);

// //         // =====================================================
// //         // Moon
// //         // =====================================================
// //         moonPivot = new THREE.Object3D();
// //         scene.add(moonPivot);

// //         moonGeometry = new THREE.SphereGeometry(30, 24, 24);

// //         const moonCanvas = document.createElement("canvas");
// //         moonCanvas.width = 256;
// //         moonCanvas.height = 256;
// //         const moonCtx = moonCanvas.getContext("2d");

// //         moonCtx.fillStyle = "#a3aab7";
// //         moonCtx.fillRect(0, 0, 256, 256);

// //         for (let i = 0; i < 40; i++) {
// //           moonCtx.fillStyle = i % 2 === 0 ? "#7e8797" : "#9199a8";
// //           moonCtx.beginPath();
// //           moonCtx.arc(
// //             Math.random() * 256,
// //             Math.random() * 256,
// //             4 + Math.random() * 16,
// //             0,
// //             Math.PI * 2
// //           );
// //           moonCtx.fill();
// //         }

// //         const moonTexture = new THREE.CanvasTexture(moonCanvas);

// //         moonMaterial = new THREE.MeshPhongMaterial({
// //           map: moonTexture,
// //           shininess: 4,
// //           specular: 0x222222,
// //         });

// //         moon = new THREE.Mesh(moonGeometry, moonMaterial);
// //         moon.position.set(380, 120, -100);
// //         moonPivot.add(moon);

// //         // =====================================================
// //         // Japan marker
// //         // =====================================================
// //         const latLonToVector3 = (lat, lon, radius) => {
// //           const phi = (90 - lat) * (Math.PI / 180);
// //           const theta = (lon + 180) * (Math.PI / 180);

// //           return new THREE.Vector3(
// //             -(radius * Math.sin(phi) * Math.cos(theta)),
// //             radius * Math.cos(phi),
// //             radius * Math.sin(phi) * Math.sin(theta)
// //           );
// //         };

// //         const japanPos = latLonToVector3(36.2, 138.2, earthRadius + 1.5);

// //         const markerGroup = new THREE.Group();
// //         earth.add(markerGroup);
// //         markerGroup.position.copy(japanPos);

// //         markerGeometry = new THREE.SphereGeometry(3.4, 16, 16);
// //         markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5c82 });
// //         const japanMarker = new THREE.Mesh(markerGeometry, markerMaterial);
// //         markerGroup.add(japanMarker);

// //         glowGeometry = new THREE.SphereGeometry(8, 16, 16);
// //         glowMaterial = new THREE.MeshBasicMaterial({
// //           color: 0xff7d9a,
// //           transparent: true,
// //           opacity: 0.42,
// //           blending: THREE.AdditiveBlending,
// //         });
// //         markerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
// //         markerGroup.add(markerGlow);

// //         ringGeometry = new THREE.RingGeometry(8, 11, 32);
// //         ringMaterial = new THREE.MeshBasicMaterial({
// //           color: 0xff7f98,
// //           transparent: true,
// //           opacity: 0.75,
// //           side: THREE.DoubleSide,
// //         });
// //         pulseRing = new THREE.Mesh(ringGeometry, ringMaterial);
// //         pulseRing.rotateX(Math.PI / 2);
// //         markerGroup.add(pulseRing);

// //         spikeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 18, 8);
// //         spikeMaterial = new THREE.MeshBasicMaterial({
// //           color: 0xff9eb1,
// //         });
// //         const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
// //         spike.position.y = 10;
// //         markerGroup.add(spike);

// //         // =====================================================
// //         // Camera helpers
// //         // =====================================================
// //         const lookTarget = new THREE.Vector3(0, 0, 0);
// //         const desiredTarget = new THREE.Vector3(0, 0, 0);
// //         const desiredCameraPos = new THREE.Vector3(0, 120, 2200);

// //         const getJapanWorldPos = () => {
// //           const p = new THREE.Vector3();
// //           markerGroup.getWorldPosition(p);
// //           return p;
// //         };

// //         // =====================================================
// //         // Stages
// //         // =====================================================
// //         const stages = [
// //           {
// //             label: "Deep Space",
// //             camera: new THREE.Vector3(0, 160, 2200),
// //             targetType: "earth",
// //             autoDelay: 2300,
// //           },
// //           {
// //             label: "Earth in View",
// //             camera: new THREE.Vector3(260, 120, 1050),
// //             targetType: "earth",
// //             autoDelay: 1800,
// //           },
// //           {
// //             label: "Orbital Descent",
// //             camera: new THREE.Vector3(200, 70, 420),
// //             targetType: "earth",
// //             autoDelay: 1800,
// //           },
// //           {
// //             label: "Japan Lock",
// //             camera: new THREE.Vector3(115, 35, 170),
// //             targetType: "japan",
// //             autoDelay: 1700,
// //           },
// //           {
// //             label: "Entering Japan",
// //             camera: new THREE.Vector3(55, 18, 72),
// //             targetType: "japan",
// //             autoDelay: 1300,
// //           },
// //         ];

// //         let currentStage = 0;
// //         let completed = false;
// //         let lastWheelTime = 0;
// //         let userInteracted = false;
// //         let introDone = false;

// //         const updateStageTargets = (stageIndex) => {
// //           const stage = stages[stageIndex];
// //           if (!stage) return;

// //           desiredCameraPos.copy(stage.camera);

// //           if (stage.targetType === "japan") {
// //             desiredTarget.copy(getJapanWorldPos());
// //           } else {
// //             desiredTarget.set(0, 0, 0);
// //           }

// //           setZoomStage(stageIndex);
// //         };

// //         const completeIntro = () => {
// //           if (introDone) return;
// //           introDone = true;
// //           setShowJapanReveal(true);

// //           finishTimer = setTimeout(() => {
// //             onAnimationComplete?.();
// //           }, 1600);
// //         };

// //         const setStage = (stageIndex) => {
// //           const clamped = Math.max(0, Math.min(stageIndex, stages.length - 1));
// //           currentStage = clamped;
// //           updateStageTargets(clamped);

// //           if (clamped === stages.length - 1 && !completed) {
// //             completed = true;
// //             completeIntro();
// //           } else if (clamped < stages.length - 1) {
// //             completed = false;
// //             setShowJapanReveal(false);
// //           }
// //         };

// //         const scheduleAuto = () => {
// //           clearTimeout(autoTimer);

// //           if (userInteracted) return;
// //           if (currentStage >= stages.length - 1) return;

// //           autoTimer = setTimeout(() => {
// //             if (!userInteracted && currentStage < stages.length - 1) {
// //               setStage(currentStage + 1);
// //               scheduleAuto();
// //             }
// //           }, stages[currentStage]?.autoDelay || 1800);
// //         };

// //         // =====================================================
// //         // User interaction
// //         // =====================================================
// //         const handleWheel = (e) => {
// //           e.preventDefault();

// //           userInteracted = true;
// //           controls.autoRotate = false;
// //           clearTimeout(autoTimer);

// //           const now = Date.now();
// //           if (now - lastWheelTime < 180) return;
// //           lastWheelTime = now;

// //           if (e.deltaY > 0 && currentStage < stages.length - 1) {
// //             setStage(currentStage + 1);
// //           } else if (e.deltaY < 0 && currentStage > 0) {
// //             clearTimeout(finishTimer);
// //             introDone = false;
// //             completed = false;
// //             setShowJapanReveal(false);
// //             setStage(currentStage - 1);
// //           }
// //         };

// //         const handlePointerDown = () => {
// //           userInteracted = true;
// //           controls.autoRotate = false;
// //           clearTimeout(autoTimer);
// //         };

// //         const handleSkip = () => {
// //           clearTimeout(autoTimer);
// //           clearTimeout(finishTimer);
// //           setStage(stages.length - 1);

// //           setTimeout(() => {
// //             onAnimationComplete?.();
// //           }, 500);
// //         };

// //         skipHandlerRef.current = handleSkip;

// //         renderer.domElement.addEventListener("wheel", handleWheel, {
// //           passive: false,
// //         });
// //         renderer.domElement.addEventListener("pointerdown", handlePointerDown);

// //         // =====================================================
// //         // Resize
// //         // =====================================================
// //         const handleResize = () => {
// //           if (!renderer || !camera) return;
// //           camera.aspect = window.innerWidth / window.innerHeight;
// //           camera.updateProjectionMatrix();
// //           renderer.setSize(window.innerWidth, window.innerHeight);
// //         };
// //         window.addEventListener("resize", handleResize);

// //         // =====================================================
// //         // Initial stage
// //         // =====================================================
// //         updateStageTargets(0);
// //         scheduleAuto();

// //         // =====================================================
// //         // Animate
// //         // =====================================================
// //         const tempTarget = new THREE.Vector3();

// //         const animate = () => {
// //           if (!mounted) return;
// //           animationId = requestAnimationFrame(animate);

// //           const time = performance.now() * 0.001;

// //           earth.rotation.y += 0.00085;
// //           clouds.rotation.y += 0.00125;
// //           stars.rotation.y += 0.000025;
// //           nebula.rotation.y += 0.000012;
// //           moonPivot.rotation.y += 0.00055;
// //           moon.rotation.y += 0.0006;

// //           const pulse = 1 + Math.sin(time * 3.2) * 0.18;
// //           markerGlow.scale.set(pulse, pulse, pulse);

// //           const ringPulse = 1 + Math.sin(time * 2.4) * 0.25;
// //           pulseRing.scale.set(ringPulse, ringPulse, ringPulse);
// //           ringMaterial.opacity = 0.45 + (Math.sin(time * 2.4) + 1) * 0.16;

// //           const cinematicYOffset = Math.sin(time * 0.6) * 3.5;

// //           camera.position.x += (desiredCameraPos.x - camera.position.x) * 0.035;
// //           camera.position.y +=
// //             (desiredCameraPos.y + cinematicYOffset - camera.position.y) * 0.04;
// //           camera.position.z += (desiredCameraPos.z - camera.position.z) * 0.04;

// //           lookTarget.lerp(desiredTarget, 0.06);
// //           controls.target.copy(lookTarget);
// //           controls.update();

// //           tempTarget.copy(controls.target);
// //           camera.lookAt(tempTarget);

// //           renderer.render(scene, camera);
// //         };

// //         animate();

// //         cleanupRef.current = () => {
// //           mounted = false;

// //           cancelAnimationFrame(animationId);
// //           clearTimeout(autoTimer);
// //           clearTimeout(finishTimer);

// //           window.removeEventListener("resize", handleResize);

// //           if (renderer?.domElement) {
// //             renderer.domElement.removeEventListener("wheel", handleWheel);
// //             renderer.domElement.removeEventListener(
// //               "pointerdown",
// //               handlePointerDown
// //             );
// //           }

// //           skipHandlerRef.current = null;

// //           controls?.dispose();

// //           starGeometry?.dispose();
// //           starMaterial?.dispose();

// //           nebulaGeometry?.dispose();
// //           nebulaMaterial?.dispose();

// //           earthGeometry?.dispose();
// //           earthMaterial?.dispose();

// //           cloudGeometry?.dispose();
// //           cloudMaterial?.dispose();

// //           atmosphereGeometry?.dispose();
// //           atmosphereMaterial?.dispose();

// //           moonGeometry?.dispose();
// //           moonMaterial?.dispose();

// //           markerGeometry?.dispose();
// //           markerMaterial?.dispose();

// //           glowGeometry?.dispose();
// //           glowMaterial?.dispose();

// //           ringGeometry?.dispose();
// //           ringMaterial?.dispose();

// //           spikeGeometry?.dispose();
// //           spikeMaterial?.dispose();

// //           renderer?.dispose();

// //           if (renderer?.domElement && container.contains(renderer.domElement)) {
// //             container.removeChild(renderer.domElement);
// //           }
// //         };
// //       } catch (err) {
// //         console.error("AnimationLanding init error:", err);
// //         onAnimationComplete?.();
// //       }
// //     };

// //     initScene();

// //     return () => {
// //       mounted = false;
// //       cleanupRef.current?.();
// //       stopAmbientSound();
// //     };
// //   }, [onAnimationComplete]);

// //   // =========================================================
// //   // SOUND TOGGLE EFFECT
// //   // =========================================================
// //   useEffect(() => {
// //     if (soundOn) {
// //       startAmbientSound();
// //     } else {
// //       stopAmbientSound();
// //     }

// //     return () => {};
// //   }, [soundOn]);

// //   const stageText = [
// //     "Deep Space",
// //     "Earth in View",
// //     "Orbital Descent",
// //     "Japan Lock",
// //     "Entering Japan",
// //   ];

// //   return (
// //     <div
// //       ref={containerRef}
// //       style={{
// //         position: "fixed",
// //         inset: 0,
// //         width: "100vw",
// //         height: "100vh",
// //         zIndex: 9999,
// //         overflow: "hidden",
// //         background:
// //           "radial-gradient(circle at top, #0b1224 0%, #060914 42%, #020308 100%)",
// //         cursor: "grab",
// //       }}
// //     >
// //       <div
// //         style={{
// //           position: "absolute",
// //           inset: 0,
// //           pointerEvents: "none",
// //           background:
// //             "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.24) 100%)",
// //           zIndex: 2,
// //         }}
// //       />

// //       {/* premium top title */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           top: 24,
// //           left: "50%",
// //           transform: "translateX(-50%)",
// //           zIndex: 20,
// //           width: "min(1100px, calc(100% - 24px))",
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "flex-start",
// //           gap: 16,
// //           flexWrap: "wrap",
// //           pointerEvents: "none",
// //         }}
// //       >
// //         <div
// //           style={{
// //             pointerEvents: "auto",
// //             padding: "18px 22px",
// //             borderRadius: 22,
// //             background: "rgba(10, 14, 28, 0.42)",
// //             border: "1px solid rgba(255,255,255,0.12)",
// //             boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //             backdropFilter: "blur(14px)",
// //             maxWidth: 760,
// //           }}
// //         >
// //           <div
// //             style={{
// //               display: "inline-flex",
// //               alignItems: "center",
// //               gap: 10,
// //               padding: "8px 14px",
// //               borderRadius: 999,
// //               background: "rgba(255,255,255,0.05)",
// //               border: "1px solid rgba(255,255,255,0.08)",
// //               color: "rgba(255,255,255,0.76)",
// //               fontSize: "0.78rem",
// //               letterSpacing: "0.14em",
// //               textTransform: "uppercase",
// //               marginBottom: 14,
// //             }}
// //           >
// //             Japan Dream Experience
// //           </div>

// //           <h1
// //             style={{
// //               margin: 0,
// //               fontSize: "clamp(2.1rem, 5vw, 4.5rem)",
// //               lineHeight: 1.02,
// //               fontWeight: 800,
// //               color: "#fff",
// //               letterSpacing: "-0.03em",
// //               textShadow: "0 12px 40px rgba(0,0,0,0.42)",
// //             }}
// //           >
// //             Journey to Japan
// //           </h1>

// //           <p
// //             style={{
// //               margin: "14px 0 0",
// //               color: "rgba(255,255,255,0.72)",
// //               fontSize: "clamp(0.95rem, 1.6vw, 1.08rem)",
// //               lineHeight: 1.6,
// //               maxWidth: 720,
// //             }}
// //           >
// //             Cinematic orbital entry into Japan with auto zoom, mouse drag
// //             rotation, wheel zoom, moon orbit, cloud layer, live stage tracking
// //             and premium HUD styling.
// //           </p>
// //         </div>

// //         <div
// //           style={{
// //             pointerEvents: "auto",
// //             minWidth: 250,
// //             padding: "16px",
// //             borderRadius: 20,
// //             background: "rgba(10, 14, 28, 0.42)",
// //             border: "1px solid rgba(255,255,255,0.12)",
// //             boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //             backdropFilter: "blur(14px)",
// //             color: "#fff",
// //           }}
// //         >
// //           <div
// //             style={{
// //               fontSize: "0.76rem",
// //               letterSpacing: "0.14em",
// //               textTransform: "uppercase",
// //               color: "rgba(255,255,255,0.55)",
// //               marginBottom: 12,
// //             }}
// //           >
// //             Controls
// //           </div>

// //           <div
// //             style={{
// //               display: "grid",
// //               gap: 10,
// //               fontSize: "0.95rem",
// //               color: "rgba(255,255,255,0.82)",
// //               marginBottom: 16,
// //             }}
// //           >
// //             <div>• Drag to rotate</div>
// //             <div>• Mouse wheel to zoom stages</div>
// //             <div>• Auto cinematic descent</div>
// //           </div>

// //           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
// //             <button
// //               onClick={() => setSoundOn((prev) => !prev)}
// //               style={glassButtonStyle}
// //             >
// //               {soundOn ? "Sound: ON" : "Sound: OFF"}
// //             </button>

// //             <button
// //               onClick={() => {
// //                 if (skipHandlerRef.current) {
// //                   skipHandlerRef.current();
// //                 }
// //               }}
// //               style={{
// //                 ...glassButtonStyle,
// //                 background:
// //                   "linear-gradient(135deg, rgba(88,125,255,0.35), rgba(255,96,140,0.28))",
// //                 border: "1px solid rgba(255,255,255,0.16)",
// //               }}
// //             >
// //               Skip Intro
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* left stats card */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           left: 24,
// //           bottom: 24,
// //           zIndex: 20,
// //           width: "min(300px, calc(100vw - 48px))",
// //           padding: "18px 18px 16px",
// //           borderRadius: 22,
// //           background: "rgba(10, 14, 28, 0.42)",
// //           border: "1px solid rgba(255,255,255,0.12)",
// //           boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //           backdropFilter: "blur(14px)",
// //           color: "#fff",
// //         }}
// //       >
// //         <div
// //           style={{
// //             fontSize: "0.75rem",
// //             letterSpacing: "0.14em",
// //             textTransform: "uppercase",
// //             color: "rgba(255,255,255,0.55)",
// //             marginBottom: 12,
// //           }}
// //         >
// //           Flight Status
// //         </div>

// //         <div
// //           style={{
// //             display: "grid",
// //             gridTemplateColumns: "1fr 1fr",
// //             gap: 10,
// //             marginBottom: 14,
// //           }}
// //         >
// //           <Stat label="Target" value="Japan" />
// //           <Stat label="Mode" value="Cinematic" />
// //           <Stat label="Orbit" value="Active" />
// //           <Stat label="Marker" value="Locked" />
// //         </div>

// //         <div
// //           style={{
// //             fontSize: "0.78rem",
// //             color: "rgba(255,255,255,0.6)",
// //             lineHeight: 1.6,
// //           }}
// //         >
// //           Premium orbital intro sequence with guided approach, target locking,
// //           Earth cloud layer and atmospheric reveal.
// //         </div>
// //       </div>

// //       {/* bottom center stage tracker */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           bottom: 24,
// //           left: "50%",
// //           transform: "translateX(-50%)",
// //           zIndex: 20,
// //           minWidth: "min(520px, calc(100vw - 48px))",
// //           maxWidth: "calc(100vw - 48px)",
// //           padding: "18px 22px",
// //           borderRadius: 22,
// //           background: "rgba(10, 14, 28, 0.42)",
// //           border: "1px solid rgba(255,255,255,0.12)",
// //           boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
// //           backdropFilter: "blur(14px)",
// //           color: "#fff",
// //           textAlign: "center",
// //         }}
// //       >
// //         <div
// //           style={{
// //             fontSize: "0.76rem",
// //             letterSpacing: "0.14em",
// //             textTransform: "uppercase",
// //             color: "rgba(255,255,255,0.55)",
// //             marginBottom: 8,
// //           }}
// //         >
// //           Current Stage
// //         </div>

// //         <div
// //           style={{
// //             fontSize: "clamp(1rem, 2vw, 1.25rem)",
// //             fontWeight: 700,
// //             marginBottom: 14,
// //           }}
// //         >
// //           {stageText[zoomStage]}
// //         </div>

// //         <div
// //           style={{
// //             height: 6,
// //             borderRadius: 999,
// //             background: "rgba(255,255,255,0.08)",
// //             overflow: "hidden",
// //             marginBottom: 12,
// //           }}
// //         >
// //           <div
// //             style={{
// //               width: `${((zoomStage + 1) / stageText.length) * 100}%`,
// //               height: "100%",
// //               borderRadius: 999,
// //               background:
// //                 "linear-gradient(90deg, #5ea3ff 0%, #7b8cff 42%, #ff6f8f 100%)",
// //               boxShadow: "0 0 24px rgba(123,140,255,0.35)",
// //               transition: "width 0.5s ease",
// //             }}
// //           />
// //         </div>

// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "center",
// //             gap: 10,
// //             flexWrap: "wrap",
// //             fontSize: "0.88rem",
// //             color: "rgba(255,255,255,0.7)",
// //           }}
// //         >
// //           <span>Auto Zoom</span>
// //           <span>•</span>
// //           <span>Wheel Control</span>
// //           <span>•</span>
// //           <span>Drag Rotate</span>
// //         </div>
// //       </div>

// //       {/* japan reveal */}
// //       <div
// //         style={{
// //           position: "absolute",
// //           inset: 0,
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           zIndex: 18,
// //           pointerEvents: "none",
// //           opacity: showJapanReveal ? 1 : 0,
// //           transform: showJapanReveal ? "scale(1)" : "scale(0.94)",
// //           transition: "all 900ms ease",
// //         }}
// //       >
// //         <div
// //           style={{
// //             textAlign: "center",
// //             padding: "24px 30px",
// //             borderRadius: 28,
// //             background: "rgba(10, 14, 28, 0.24)",
// //             backdropFilter: "blur(8px)",
// //           }}
// //         >
// //           <div
// //             style={{
// //               fontSize: "0.88rem",
// //               letterSpacing: "0.18em",
// //               textTransform: "uppercase",
// //               color: "rgba(255,255,255,0.7)",
// //               marginBottom: 12,
// //             }}
// //           >
// //             Destination Locked
// //           </div>

// //           <div
// //             style={{
// //               fontSize: "clamp(2.8rem, 8vw, 6rem)",
// //               fontWeight: 900,
// //               letterSpacing: "-0.05em",
// //               color: "#ffffff",
// //               textShadow:
// //                 "0 0 18px rgba(255,255,255,0.2), 0 0 40px rgba(88,125,255,0.22), 0 0 60px rgba(255,96,140,0.18)",
// //             }}
// //           >
// //             JAPAN
// //           </div>

// //           <div
// //             style={{
// //               marginTop: 10,
// //               fontSize: "1rem",
// //               color: "rgba(255,255,255,0.72)",
// //             }}
// //           >
// //             Entering dream trajectory...
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function Stat({ label, value }) {
// //   return (
// //     <div
// //       style={{
// //         padding: "12px 12px",
// //         borderRadius: 16,
// //         background: "rgba(255,255,255,0.04)",
// //         border: "1px solid rgba(255,255,255,0.08)",
// //       }}
// //     >
// //       <div
// //         style={{
// //           fontSize: "0.72rem",
// //           letterSpacing: "0.12em",
// //           textTransform: "uppercase",
// //           color: "rgba(255,255,255,0.52)",
// //           marginBottom: 6,
// //         }}
// //       >
// //         {label}
// //       </div>
// //       <div
// //         style={{
// //           fontSize: "1rem",
// //           fontWeight: 700,
// //           color: "#fff",
// //         }}
// //       >
// //         {value}
// //       </div>
// //     </div>
// //   );
// // }

// // const glassButtonStyle = {
// //   appearance: "none",
// //   border: "1px solid rgba(255,255,255,0.12)",
// //   background: "rgba(255,255,255,0.06)",
// //   color: "#fff",
// //   padding: "10px 14px",
// //   borderRadius: 14,
// //   fontSize: "0.92rem",
// //   fontWeight: 600,
// //   cursor: "pointer",
// //   transition: "all 0.25s ease",
// //   backdropFilter: "blur(8px)",
// // };





// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// export default function AnimationLanding({ onAnimationComplete }) {
//   const containerRef = useRef(null);
//   const cleanupRef = useRef(null);

//   const [zoomStage, setZoomStage] = useState(0);
//   const [soundOn, setSoundOn] = useState(false);
//   const [showJapanReveal, setShowJapanReveal] = useState(false);

//   const audioCtxRef = useRef(null);
//   const gainNodeRef = useRef(null);
//   const oscillatorRef = useRef(null);
//   const audioStartedRef = useRef(false);

//   const skipHandlerRef = useRef(null);

//   const startAmbientSound = () => {
//     try {
//       if (audioStartedRef.current) return;

//       const AudioContext = window.AudioContext || window.webkitAudioContext;
//       if (!AudioContext) return;

//       const audioCtx = new AudioContext();
//       const oscillator = audioCtx.createOscillator();
//       const gainNode = audioCtx.createGain();

//       oscillator.type = "sine";
//       oscillator.frequency.value = 72;
//       gainNode.gain.value = 0.015;

//       oscillator.connect(gainNode);
//       gainNode.connect(audioCtx.destination);
//       oscillator.start();

//       audioCtxRef.current = audioCtx;
//       gainNodeRef.current = gainNode;
//       oscillatorRef.current = oscillator;
//       audioStartedRef.current = true;
//     } catch (e) {
//       console.warn("Audio init failed:", e);
//     }
//   };

//   const stopAmbientSound = () => {
//     try {
//       if (oscillatorRef.current) {
//         oscillatorRef.current.stop();
//         oscillatorRef.current.disconnect();
//       }
//     } catch {}

//     try {
//       if (gainNodeRef.current) gainNodeRef.current.disconnect();
//     } catch {}

//     try {
//       if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
//         audioCtxRef.current.close();
//       }
//     } catch {}

//     oscillatorRef.current = null;
//     gainNodeRef.current = null;
//     audioCtxRef.current = null;
//     audioStartedRef.current = false;
//   };

//   useEffect(() => {
//     if (!containerRef.current) return;

//     let mounted = true;
//     const container = containerRef.current;

//     let scene, camera, renderer, animationId, autoTimer, finishTimer;
//     let stars, nebula, earth, clouds, atmosphere, moonPivot, moon, markerGlow, pulseRing;

//     let starGeometry,
//       starMaterial,
//       nebulaGeometry,
//       nebulaMaterial,
//       earthGeometry,
//       earthMaterial,
//       cloudGeometry,
//       cloudMaterial,
//       atmosphereGeometry,
//       atmosphereMaterial,
//       moonGeometry,
//       moonMaterial,
//       markerGeometry,
//       markerMaterial,
//       glowGeometry,
//       glowMaterial,
//       ringGeometry,
//       ringMaterial,
//       spikeGeometry,
//       spikeMaterial;

//     const initScene = () => {
//       try {
//         console.log("[AnimationLanding] initScene started");

//         const testCanvas = document.createElement("canvas");
//         const gl =
//           testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");

//         if (!gl) {
//           console.warn("WebGL not supported. Skipping intro animation.");
//           onAnimationComplete?.();
//           return;
//         }

//         console.log("[AnimationLanding] WebGL OK, building scene");

//         scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x02040a);
//         scene.fog = new THREE.FogExp2(0x030611, 0.00032);

//         camera = new THREE.PerspectiveCamera(
//           52,
//           window.innerWidth / window.innerHeight,
//           0.1,
//           40000
//         );
//         camera.position.set(0, 140, 2200);

//         renderer = new THREE.WebGLRenderer({
//           antialias: false,
//           alpha: false,
//           powerPreference: "default",
//         });

//         renderer.setSize(window.innerWidth, window.innerHeight);
//         renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
//         renderer.outputColorSpace = THREE.SRGBColorSpace;
//         renderer.shadowMap.enabled = false;

//         container.appendChild(renderer.domElement);

//         // Lights
//         scene.add(new THREE.AmbientLight(0xffffff, 0.95));
//         const sunLight = new THREE.PointLight(0xffffff, 2.2, 20000);
//         sunLight.position.set(950, 300, 900);
//         scene.add(sunLight);

//         const blueRim = new THREE.PointLight(0x65a8ff, 1.4, 9000);
//         blueRim.position.set(-500, -180, 600);
//         scene.add(blueRim);

//         const pinkFill = new THREE.PointLight(0xff6a8e, 0.7, 6000);
//         pinkFill.position.set(0, 300, -400);
//         scene.add(pinkFill);

//         // Starfield
//         starGeometry = new THREE.BufferGeometry();
//         const starCount = 8000;
//         const starPositions = new Float32Array(starCount * 3);

//         for (let i = 0; i < starCount; i++) {
//           const i3 = i * 3;
//           const radius = 2800 + Math.random() * 14000;
//           const theta = Math.random() * Math.PI * 2;
//           const phi = Math.acos(2 * Math.random() - 1);

//           starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
//           starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
//           starPositions[i3 + 2] = radius * Math.cos(phi);
//         }

//         starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
//         starMaterial = new THREE.PointsMaterial({
//           color: 0xffffff,
//           size: 1.6,
//           transparent: true,
//           opacity: 0.95,
//           sizeAttenuation: true,
//         });
//         stars = new THREE.Points(starGeometry, starMaterial);
//         scene.add(stars);

//         // Nebula
//         nebulaGeometry = new THREE.BufferGeometry();
//         const nebulaCount = 2500;
//         const nebulaPositions = new Float32Array(nebulaCount * 3);
//         for (let i = 0; i < nebulaCount * 3; i++) {
//           nebulaPositions[i] = (Math.random() - 0.5) * 18000;
//         }
//         nebulaGeometry.setAttribute("position", new THREE.BufferAttribute(nebulaPositions, 3));
//         nebulaMaterial = new THREE.PointsMaterial({
//           color: 0x728cff,
//           size: 18,
//           transparent: true,
//           opacity: 0.06,
//           sizeAttenuation: true,
//         });
//         nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
//         scene.add(nebula);

//         // Earth
//         const earthRadius = 110;
//         earthGeometry = new THREE.SphereGeometry(earthRadius, 48, 48);

//         const earthCanvas = document.createElement("canvas");
//         earthCanvas.width = 1024;
//         earthCanvas.height = 512;
//         const earthCtx = earthCanvas.getContext("2d");

//         const oceanGrad = earthCtx.createLinearGradient(0, 0, 1024, 512);
//         oceanGrad.addColorStop(0, "#143c9c");
//         oceanGrad.addColorStop(0.3, "#1b56ca");
//         oceanGrad.addColorStop(0.65, "#0e3f98");
//         oceanGrad.addColorStop(1, "#072868");
//         earthCtx.fillStyle = oceanGrad;
//         earthCtx.fillRect(0, 0, 1024, 512);

//         for (let i = 0; i < 2500; i++) {
//           earthCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
//           earthCtx.fillRect(
//             Math.random() * 1024,
//             Math.random() * 512,
//             Math.random() * 2 + 1,
//             Math.random() * 2 + 1
//           );
//         }

//         const drawLand = (x, y, rx, ry, rot = 0, color = "#4ea55e") => {
//           earthCtx.save();
//           earthCtx.translate(x, y);
//           earthCtx.rotate(rot);
//           earthCtx.fillStyle = color;
//           earthCtx.beginPath();
//           earthCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
//           earthCtx.fill();
//           earthCtx.restore();
//         };

//         drawLand(150, 130, 90, 60, -0.25, "#4e9f58");
//         drawLand(175, 195, 40, 45, 0.2, "#4e9f58");
//         drawLand(235, 325, 45, 80, 0.18, "#4a9a55");
//         drawLand(505, 130, 48, 35, 0.1, "#5eaf62");
//         drawLand(530, 240, 60, 90, 0.08, "#519f5a");
//         drawLand(690, 150, 150, 75, 0.05, "#5cad61");
//         drawLand(750, 195, 60, 35, -0.1, "#5cad61");
//         drawLand(800, 155, 9, 20, -0.45, "#73c56f");
//         drawLand(812, 172, 6, 11, -0.35, "#73c56f");
//         drawLand(795, 380, 60, 35, 0.1, "#4c9f58");

//         const earthTexture = new THREE.CanvasTexture(earthCanvas);
//         earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

//         earthMaterial = new THREE.MeshPhongMaterial({
//           map: earthTexture,
//           shininess: 24,
//           specular: 0x35558d,
//         });

//         earth = new THREE.Mesh(earthGeometry, earthMaterial);
//         scene.add(earth);

//         // Clouds
//         cloudGeometry = new THREE.SphereGeometry(earthRadius + 2.4, 48, 48);
//         const cloudCanvas = document.createElement("canvas");
//         cloudCanvas.width = 1024;
//         cloudCanvas.height = 512;
//         const cloudCtx = cloudCanvas.getContext("2d");

//         for (let i = 0; i < 160; i++) {
//           cloudCtx.save();
//           cloudCtx.globalAlpha = 0.04 + Math.random() * 0.07;
//           cloudCtx.fillStyle = "#ffffff";
//           cloudCtx.translate(Math.random() * 1024, Math.random() * 512);
//           cloudCtx.rotate(Math.random() * Math.PI);
//           cloudCtx.beginPath();
//           cloudCtx.ellipse(0, 0, 20 + Math.random() * 60, 8 + Math.random() * 18, 0, 0, Math.PI * 2);
//           cloudCtx.fill();
//           cloudCtx.restore();
//         }

//         const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
//         cloudMaterial = new THREE.MeshPhongMaterial({
//           map: cloudTexture,
//           transparent: true,
//           opacity: 0.55,
//           depthWrite: false,
//         });
//         clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
//         earth.add(clouds);

//         // Atmosphere
//         atmosphereGeometry = new THREE.SphereGeometry(earthRadius + 8, 48, 48);
//         atmosphereMaterial = new THREE.MeshPhongMaterial({
//           color: 0x70c9ff,
//           transparent: true,
//           opacity: 0.14,
//           side: THREE.BackSide,
//           blending: THREE.AdditiveBlending,
//         });
//         atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
//         earth.add(atmosphere);

//         // Moon
//         moonPivot = new THREE.Object3D();
//         scene.add(moonPivot);

//         moonGeometry = new THREE.SphereGeometry(30, 24, 24);
//         const moonCanvas = document.createElement("canvas");
//         moonCanvas.width = 256;
//         moonCanvas.height = 256;
//         const moonCtx = moonCanvas.getContext("2d");

//         moonCtx.fillStyle = "#a3aab7";
//         moonCtx.fillRect(0, 0, 256, 256);

//         for (let i = 0; i < 40; i++) {
//           moonCtx.fillStyle = i % 2 === 0 ? "#7e8797" : "#9199a8";
//           moonCtx.beginPath();
//           moonCtx.arc(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 16, 0, Math.PI * 2);
//           moonCtx.fill();
//         }

//         const moonTexture = new THREE.CanvasTexture(moonCanvas);
//         moonMaterial = new THREE.MeshPhongMaterial({
//           map: moonTexture,
//           shininess: 4,
//           specular: 0x222222,
//         });
//         moon = new THREE.Mesh(moonGeometry, moonMaterial);
//         moon.position.set(380, 120, -100);
//         moonPivot.add(moon);

//         // Japan marker
//         const latLonToVector3 = (lat, lon, radius) => {
//           const phi = (90 - lat) * (Math.PI / 180);
//           const theta = (lon + 180) * (Math.PI / 180);
//           return new THREE.Vector3(
//             -(radius * Math.sin(phi) * Math.cos(theta)),
//             radius * Math.cos(phi),
//             radius * Math.sin(phi) * Math.sin(theta)
//           );
//         };

//         const japanPos = latLonToVector3(36.2, 138.2, earthRadius + 1.5);
//         const markerGroup = new THREE.Group();
//         earth.add(markerGroup);
//         markerGroup.position.copy(japanPos);

//         markerGeometry = new THREE.SphereGeometry(3.4, 16, 16);
//         markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5c82 });
//         const japanMarker = new THREE.Mesh(markerGeometry, markerMaterial);
//         markerGroup.add(japanMarker);

//         glowGeometry = new THREE.SphereGeometry(8, 16, 16);
//         glowMaterial = new THREE.MeshBasicMaterial({
//           color: 0xff7d9a,
//           transparent: true,
//           opacity: 0.42,
//           blending: THREE.AdditiveBlending,
//         });
//         markerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
//         markerGroup.add(markerGlow);

//         ringGeometry = new THREE.RingGeometry(8, 11, 32);
//         ringMaterial = new THREE.MeshBasicMaterial({
//           color: 0xff7f98,
//           transparent: true,
//           opacity: 0.75,
//           side: THREE.DoubleSide,
//         });
//         pulseRing = new THREE.Mesh(ringGeometry, ringMaterial);
//         pulseRing.rotateX(Math.PI / 2);
//         markerGroup.add(pulseRing);

//         spikeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 18, 8);
//         spikeMaterial = new THREE.MeshBasicMaterial({ color: 0xff9eb1 });
//         const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
//         spike.position.y = 10;
//         markerGroup.add(spike);

//         // Camera helpers
//         const lookTarget = new THREE.Vector3(0, 0, 0);
//         const desiredTarget = new THREE.Vector3(0, 0, 0);
//         const desiredCameraPos = new THREE.Vector3(0, 120, 2200);

//         const getJapanWorldPos = () => {
//           const p = new THREE.Vector3();
//           markerGroup.getWorldPosition(p);
//           return p;
//         };

//         const stages = [
//           { camera: new THREE.Vector3(0, 160, 2200), targetType: "earth", autoDelay: 2300 },
//           { camera: new THREE.Vector3(260, 120, 1050), targetType: "earth", autoDelay: 1800 },
//           { camera: new THREE.Vector3(200, 70, 420), targetType: "earth", autoDelay: 1800 },
//           { camera: new THREE.Vector3(115, 35, 170), targetType: "japan", autoDelay: 1700 },
//           { camera: new THREE.Vector3(55, 18, 72), targetType: "japan", autoDelay: 1300 },
//         ];

//         let currentStage = 0;
//         let completed = false;
//         let userInteracted = false;
//         let introDone = false;
//         let dragging = false;
//         let lastPointer = { x: 0, y: 0 };
//         let manualRotation = { x: 0, y: 0 };

//         const updateStageTargets = (stageIndex) => {
//           const stage = stages[stageIndex];
//           if (!stage) return;
//           desiredCameraPos.copy(stage.camera);
//           desiredTarget.copy(stage.targetType === "japan" ? getJapanWorldPos() : new THREE.Vector3(0, 0, 0));
//           setZoomStage(stageIndex);
//         };

//         const completeIntro = () => {
//           if (introDone) return;
//           introDone = true;
//           setShowJapanReveal(true);
//           finishTimer = setTimeout(() => onAnimationComplete?.(), 1600);
//         };

//         const setStage = (stageIndex) => {
//           const clamped = Math.max(0, Math.min(stageIndex, stages.length - 1));
//           currentStage = clamped;
//           updateStageTargets(clamped);

//           if (clamped === stages.length - 1 && !completed) {
//             completed = true;
//             completeIntro();
//           } else if (clamped < stages.length - 1) {
//             completed = false;
//             setShowJapanReveal(false);
//           }
//         };

//         const scheduleAuto = () => {
//           clearTimeout(autoTimer);
//           if (userInteracted || currentStage >= stages.length - 1) return;
//           autoTimer = setTimeout(() => {
//             if (!userInteracted && currentStage < stages.length - 1) {
//               setStage(currentStage + 1);
//               scheduleAuto();
//             }
//           }, stages[currentStage]?.autoDelay || 1800);
//         };

//         // Manual rotation via drag (replaces OrbitControls)
//         const handlePointerDown = (e) => {
//           userInteracted = true;
//           dragging = true;
//           clearTimeout(autoTimer);
//           lastPointer = { x: e.clientX, y: e.clientY };
//         };
//         const handlePointerMove = (e) => {
//           if (!dragging) return;
//           const dx = e.clientX - lastPointer.x;
//           const dy = e.clientY - lastPointer.y;
//           manualRotation.y += dx * 0.005;
//           manualRotation.x += dy * 0.005;
//           lastPointer = { x: e.clientX, y: e.clientY };
//         };
//         const handlePointerUp = () => {
//           dragging = false;
//         };

//         let lastWheelTime = 0;
//         const handleWheel = (e) => {
//           e.preventDefault();
//           userInteracted = true;
//           clearTimeout(autoTimer);

//           const now = Date.now();
//           if (now - lastWheelTime < 180) return;
//           lastWheelTime = now;

//           if (e.deltaY > 0 && currentStage < stages.length - 1) {
//             setStage(currentStage + 1);
//           } else if (e.deltaY < 0 && currentStage > 0) {
//             clearTimeout(finishTimer);
//             introDone = false;
//             completed = false;
//             setShowJapanReveal(false);
//             setStage(currentStage - 1);
//           }
//         };

//         const handleSkip = () => {
//           clearTimeout(autoTimer);
//           clearTimeout(finishTimer);
//           setStage(stages.length - 1);
//           setTimeout(() => onAnimationComplete?.(), 500);
//         };
//         skipHandlerRef.current = handleSkip;

//         renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });
//         renderer.domElement.addEventListener("pointerdown", handlePointerDown);
//         window.addEventListener("pointermove", handlePointerMove);
//         window.addEventListener("pointerup", handlePointerUp);

//         const handleResize = () => {
//           if (!renderer || !camera) return;
//           camera.aspect = window.innerWidth / window.innerHeight;
//           camera.updateProjectionMatrix();
//           renderer.setSize(window.innerWidth, window.innerHeight);
//         };
//         window.addEventListener("resize", handleResize);

//         updateStageTargets(0);
//         scheduleAuto();

//         const tempTarget = new THREE.Vector3();
//         let autoAngle = 0;

//         const animate = () => {
//           if (!mounted) return;
//           animationId = requestAnimationFrame(animate);

//           const time = performance.now() * 0.001;

//           earth.rotation.y += 0.00085;
//           clouds.rotation.y += 0.00125;
//           stars.rotation.y += 0.000025;
//           nebula.rotation.y += 0.000012;
//           moonPivot.rotation.y += 0.00055;
//           moon.rotation.y += 0.0006;

//           const pulse = 1 + Math.sin(time * 3.2) * 0.18;
//           markerGlow.scale.set(pulse, pulse, pulse);

//           const ringPulse = 1 + Math.sin(time * 2.4) * 0.25;
//           pulseRing.scale.set(ringPulse, ringPulse, ringPulse);
//           ringMaterial.opacity = 0.45 + (Math.sin(time * 2.4) + 1) * 0.16;

//           const cinematicYOffset = Math.sin(time * 0.6) * 3.5;

//           // gentle auto-orbit when the user hasn't grabbed the scene
//           if (!userInteracted) {
//             autoAngle += 0.0009;
//           }

//           const orbitRadius = Math.hypot(desiredCameraPos.x, desiredCameraPos.z);
//           const baseAngle = Math.atan2(desiredCameraPos.z, desiredCameraPos.x);
//           const angle = baseAngle + autoAngle + manualRotation.y;

//           const targetX = lookTarget.x + orbitRadius * Math.cos(angle);
//           const targetZ = lookTarget.z + orbitRadius * Math.sin(angle);
//           const targetY = desiredCameraPos.y + manualRotation.x * 80 + cinematicYOffset;

//           camera.position.x += (targetX - camera.position.x) * 0.035;
//           camera.position.y += (targetY - camera.position.y) * 0.04;
//           camera.position.z += (targetZ - camera.position.z) * 0.04;

//           lookTarget.lerp(desiredTarget, 0.06);
//           tempTarget.copy(lookTarget);
//           camera.lookAt(tempTarget);

//           renderer.render(scene, camera);
//         };

//         animate();

//         cleanupRef.current = () => {
//           mounted = false;
//           cancelAnimationFrame(animationId);
//           clearTimeout(autoTimer);
//           clearTimeout(finishTimer);

//           window.removeEventListener("resize", handleResize);
//           window.removeEventListener("pointermove", handlePointerMove);
//           window.removeEventListener("pointerup", handlePointerUp);

//           if (renderer?.domElement) {
//             renderer.domElement.removeEventListener("wheel", handleWheel);
//             renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
//           }

//           skipHandlerRef.current = null;

//           starGeometry?.dispose();
//           starMaterial?.dispose();
//           nebulaGeometry?.dispose();
//           nebulaMaterial?.dispose();
//           earthGeometry?.dispose();
//           earthMaterial?.dispose();
//           cloudGeometry?.dispose();
//           cloudMaterial?.dispose();
//           atmosphereGeometry?.dispose();
//           atmosphereMaterial?.dispose();
//           moonGeometry?.dispose();
//           moonMaterial?.dispose();
//           markerGeometry?.dispose();
//           markerMaterial?.dispose();
//           glowGeometry?.dispose();
//           glowMaterial?.dispose();
//           ringGeometry?.dispose();
//           ringMaterial?.dispose();
//           spikeGeometry?.dispose();
//           spikeMaterial?.dispose();

//           renderer?.dispose();
//           if (renderer?.domElement && container.contains(renderer.domElement)) {
//             container.removeChild(renderer.domElement);
//           }
//         };
//       } catch (err) {
//         console.error("AnimationLanding init error:", err);
//         onAnimationComplete?.();
//       }
//     };

//     initScene();

//     return () => {
//       mounted = false;
//       cleanupRef.current?.();
//       stopAmbientSound();
//     };
//   }, [onAnimationComplete]);

//   useEffect(() => {
//     if (soundOn) {
//       startAmbientSound();
//     } else {
//       stopAmbientSound();
//     }
//   }, [soundOn]);

//   const stageText = ["Deep Space", "Earth in View", "Orbital Descent", "Japan Lock", "Entering Japan"];

//   return (
//     <div
//       ref={containerRef}
//       style={{
//         position: "fixed",
//         inset: 0,
//         width: "100vw",
//         height: "100vh",
//         zIndex: 9999,
//         overflow: "hidden",
//         background: "radial-gradient(circle at top, #0b1224 0%, #060914 42%, #020308 100%)",
//         cursor: "grab",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           pointerEvents: "none",
//           background: "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.24) 100%)",
//           zIndex: 2,
//         }}
//       />

//       <div
//         style={{
//           position: "absolute",
//           top: 24,
//           left: "50%",
//           transform: "translateX(-50%)",
//           zIndex: 20,
//           width: "min(1100px, calc(100% - 24px))",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//           gap: 16,
//           flexWrap: "wrap",
//           pointerEvents: "none",
//         }}
//       >
//         <div
//           style={{
//             pointerEvents: "auto",
//             padding: "18px 22px",
//             borderRadius: 22,
//             background: "rgba(10, 14, 28, 0.42)",
//             border: "1px solid rgba(255,255,255,0.12)",
//             boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
//             backdropFilter: "blur(14px)",
//             maxWidth: 760,
//           }}
//         >
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 10,
//               padding: "8px 14px",
//               borderRadius: 999,
//               background: "rgba(255,255,255,0.05)",
//               border: "1px solid rgba(255,255,255,0.08)",
//               color: "rgba(255,255,255,0.76)",
//               fontSize: "0.78rem",
//               letterSpacing: "0.14em",
//               textTransform: "uppercase",
//               marginBottom: 14,
//             }}
//           >
//             Japan Dream Experience
//           </div>

//           <h1
//             style={{
//               margin: 0,
//               fontSize: "clamp(2.1rem, 5vw, 4.5rem)",
//               lineHeight: 1.02,
//               fontWeight: 800,
//               color: "#fff",
//               letterSpacing: "-0.03em",
//               textShadow: "0 12px 40px rgba(0,0,0,0.42)",
//             }}
//           >
//             Journey to Japan
//           </h1>

//           <p
//             style={{
//               margin: "14px 0 0",
//               color: "rgba(255,255,255,0.72)",
//               fontSize: "clamp(0.95rem, 1.6vw, 1.08rem)",
//               lineHeight: 1.6,
//               maxWidth: 720,
//             }}
//           >
//             Cinematic orbital entry into Japan with auto zoom, drag rotation,
//             wheel zoom, moon orbit, cloud layer, live stage tracking and
//             premium HUD styling.
//           </p>
//         </div>

//         <div
//           style={{
//             pointerEvents: "auto",
//             minWidth: 250,
//             padding: "16px",
//             borderRadius: 20,
//             background: "rgba(10, 14, 28, 0.42)",
//             border: "1px solid rgba(255,255,255,0.12)",
//             boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
//             backdropFilter: "blur(14px)",
//             color: "#fff",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "0.76rem",
//               letterSpacing: "0.14em",
//               textTransform: "uppercase",
//               color: "rgba(255,255,255,0.55)",
//               marginBottom: 12,
//             }}
//           >
//             Controls
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gap: 10,
//               fontSize: "0.95rem",
//               color: "rgba(255,255,255,0.82)",
//               marginBottom: 16,
//             }}
//           >
//             <div>• Drag to rotate</div>
//             <div>• Mouse wheel to zoom stages</div>
//             <div>• Auto cinematic descent</div>
//           </div>

//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             <button onClick={() => setSoundOn((prev) => !prev)} style={glassButtonStyle}>
//               {soundOn ? "Sound: ON" : "Sound: OFF"}
//             </button>

//             <button
//               onClick={() => skipHandlerRef.current?.()}
//               style={{
//                 ...glassButtonStyle,
//                 background: "linear-gradient(135deg, rgba(88,125,255,0.35), rgba(255,96,140,0.28))",
//                 border: "1px solid rgba(255,255,255,0.16)",
//               }}
//             >
//               Skip Intro
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         style={{
//           position: "absolute",
//           left: 24,
//           bottom: 24,
//           zIndex: 20,
//           width: "min(300px, calc(100vw - 48px))",
//           padding: "18px 18px 16px",
//           borderRadius: 22,
//           background: "rgba(10, 14, 28, 0.42)",
//           border: "1px solid rgba(255,255,255,0.12)",
//           boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
//           backdropFilter: "blur(14px)",
//           color: "#fff",
//         }}
//       >
//         <div
//           style={{
//             fontSize: "0.75rem",
//             letterSpacing: "0.14em",
//             textTransform: "uppercase",
//             color: "rgba(255,255,255,0.55)",
//             marginBottom: 12,
//           }}
//         >
//           Flight Status
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
//           <Stat label="Target" value="Japan" />
//           <Stat label="Mode" value="Cinematic" />
//           <Stat label="Orbit" value="Active" />
//           <Stat label="Marker" value="Locked" />
//         </div>

//         <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
//           Premium orbital intro sequence with guided approach, target locking,
//           Earth cloud layer and atmospheric reveal.
//         </div>
//       </div>

//       <div
//         style={{
//           position: "absolute",
//           bottom: 24,
//           left: "50%",
//           transform: "translateX(-50%)",
//           zIndex: 20,
//           minWidth: "min(520px, calc(100vw - 48px))",
//           maxWidth: "calc(100vw - 48px)",
//           padding: "18px 22px",
//           borderRadius: 22,
//           background: "rgba(10, 14, 28, 0.42)",
//           border: "1px solid rgba(255,255,255,0.12)",
//           boxShadow: "0 12px 40px rgba(0,0,0,0.32)",
//           backdropFilter: "blur(14px)",
//           color: "#fff",
//           textAlign: "center",
//         }}
//       >
//         <div
//           style={{
//             fontSize: "0.76rem",
//             letterSpacing: "0.14em",
//             textTransform: "uppercase",
//             color: "rgba(255,255,255,0.55)",
//             marginBottom: 8,
//           }}
//         >
//           Current Stage
//         </div>

//         <div style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", fontWeight: 700, marginBottom: 14 }}>
//           {stageText[zoomStage]}
//         </div>

//         <div
//           style={{
//             height: 6,
//             borderRadius: 999,
//             background: "rgba(255,255,255,0.08)",
//             overflow: "hidden",
//             marginBottom: 12,
//           }}
//         >
//           <div
//             style={{
//               width: `${((zoomStage + 1) / stageText.length) * 100}%`,
//               height: "100%",
//               borderRadius: 999,
//               background: "linear-gradient(90deg, #5ea3ff 0%, #7b8cff 42%, #ff6f8f 100%)",
//               boxShadow: "0 0 24px rgba(123,140,255,0.35)",
//               transition: "width 0.5s ease",
//             }}
//           />
//         </div>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: 10,
//             flexWrap: "wrap",
//             fontSize: "0.88rem",
//             color: "rgba(255,255,255,0.7)",
//           }}
//         >
//           <span>Auto Zoom</span>
//           <span>•</span>
//           <span>Wheel Control</span>
//           <span>•</span>
//           <span>Drag Rotate</span>
//         </div>
//       </div>

//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 18,
//           pointerEvents: "none",
//           opacity: showJapanReveal ? 1 : 0,
//           transform: showJapanReveal ? "scale(1)" : "scale(0.94)",
//           transition: "all 900ms ease",
//         }}
//       >
//         <div
//           style={{
//             textAlign: "center",
//             padding: "24px 30px",
//             borderRadius: 28,
//             background: "rgba(10, 14, 28, 0.24)",
//             backdropFilter: "blur(8px)",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "0.88rem",
//               letterSpacing: "0.18em",
//               textTransform: "uppercase",
//               color: "rgba(255,255,255,0.7)",
//               marginBottom: 12,
//             }}
//           >
//             Destination Locked
//           </div>

//           <div
//             style={{
//               fontSize: "clamp(2.8rem, 8vw, 6rem)",
//               fontWeight: 900,
//               letterSpacing: "-0.05em",
//               color: "#ffffff",
//               textShadow: "0 0 18px rgba(255,255,255,0.2), 0 0 40px rgba(88,125,255,0.22), 0 0 60px rgba(255,96,140,0.18)",
//             }}
//           >
//             JAPAN
//           </div>

//           <div style={{ marginTop: 10, fontSize: "1rem", color: "rgba(255,255,255,0.72)" }}>
//             Entering dream trajectory...
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Stat({ label, value }) {
//   return (
//     <div
//       style={{
//         padding: "12px 12px",
//         borderRadius: 16,
//         background: "rgba(255,255,255,0.04)",
//         border: "1px solid rgba(255,255,255,0.08)",
//       }}
//     >
//       <div
//         style={{
//           fontSize: "0.72rem",
//           letterSpacing: "0.12em",
//           textTransform: "uppercase",
//           color: "rgba(255,255,255,0.52)",
//           marginBottom: 6,
//         }}
//       >
//         {label}
//       </div>
//       <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{value}</div>
//     </div>
//   );
// }

// const glassButtonStyle = {
//   appearance: "none",
//   border: "1px solid rgba(255,255,255,0.12)",
//   background: "rgba(255,255,255,0.06)",
//   color: "#fff",
//   padding: "10px 14px",
//   borderRadius: 14,
//   fontSize: "0.92rem",
//   fontWeight: 600,
//   cursor: "pointer",
//   transition: "all 0.25s ease",
//   backdropFilter: "blur(8px)",
// };