'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ── Tunable particle constants ─────────────────────────────────────
// Tweak these to change how the background feels. Kept at module scope
// so they're easy to find and adjust. They drive the 3D point cloud below.
//
//   EASING        — cursor-follow lerp factor. Higher = the camera/cloud
//                   tracks the pointer faster (snappier). 0..1.
//   DRIFT_SPEED   — autonomous movement: per-particle drift + auto-rotation.
//   MOUSE_RADIUS  — pointer interaction reach, normalized to half the
//                   viewport. Smaller = full strength nearer the centre.
//   MOUSE_FORCE   — parallax strength (camera pan + cloud-tilt amplitude).
//   PARTICLE_COUNT— desktop base count; scaled down per device at runtime.
const EASING         = 0.18;
const DRIFT_SPEED    = 0.006;
const MOUSE_RADIUS   = 0.5;
const MOUSE_FORCE    = 0.6;
const PARTICLE_COUNT = 2200;

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── GUARD: prefers-reduced-motion → no WebGL at all ───────────────
    // We never create a renderer/loop; the div's CSS gradient is the
    // static fallback the user sees.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // ── Device profiling (particle-count + pixel-ratio guards) ────────
    const dpr       = window.devicePixelRatio || 1;
    const isTouch   = window.matchMedia('(pointer: coarse)').matches;
    const viewportW = window.innerWidth;
    // "low power" = phones/tablets, touch devices, or low-DPR displays.
    const lowPower  = isTouch || dpr < 1.5 || viewportW < 768;

    // GUARD: significantly fewer particles on mobile/touch + low-DPR.
    const particleCount = lowPower
      ? Math.round(PARTICLE_COUNT * 0.30)   // ~660
      : viewportW < 1280
        ? Math.round(PARTICLE_COUNT * 0.68) // ~1500
        : PARTICLE_COUNT;                   // 2200

    // ── Scene / camera / renderer ─────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, viewportW / window.innerHeight, 0.1, 2000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: !lowPower,
      alpha: true,
      powerPreference: 'high-performance',
    });
    // GUARD: cap the device-pixel-ratio (biggest GPU fill-rate cost).
    renderer.setPixelRatio(Math.min(dpr, lowPower ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Soft-circle sprite texture (round, glowing points) ────────────
    const sprite = document.createElement('canvas');
    sprite.width = 64;
    sprite.height = 64;
    const sctx = sprite.getContext('2d')!;
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1,   'rgba(255,255,255,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(sprite);

    // ── Build the point cloud (BufferGeometry of N 3D vertices) ───────
    const positions  = new Float32Array(particleCount * 3);
    const colors     = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Span across X/Y and a deep Z range so perspective parallax is felt.
    const SPREAD_X = 40;
    const SPREAD_Y = 30;
    const SPREAD_Z = 24;

    const palette = [
      new THREE.Color('#10B981'), // emerald
      new THREE.Color('#06B6D4'), // cyan
      new THREE.Color('#14B8A6'), // teal
      new THREE.Color('#34D399'), // emerald-light
      new THREE.Color('#F0F4F8'), // near-white
      new THREE.Color('#8892A4'), // muted blue-grey
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * SPREAD_X;
      positions[i3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
      positions[i3 + 2] = (Math.random() - 0.5) * SPREAD_Z;

      const col = palette[(Math.random() * palette.length) | 0];
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      velocities[i3]     = (Math.random() - 0.5) * DRIFT_SPEED;
      velocities[i3 + 1] = (Math.random() - 0.5) * DRIFT_SPEED;
      velocities[i3 + 2] = (Math.random() - 0.5) * DRIFT_SPEED * 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    const material = new THREE.PointsMaterial({
      size: 0.18,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,   // nearer points render larger → depth cue
    });

    const points = new THREE.Points(geometry, material);
    // Wrap in a group so pointer-driven tilt (parallax) is independent of
    // the cloud's own slow auto-rotation.
    const cloud = new THREE.Group();
    cloud.add(points);
    scene.add(cloud);

    // ── Pointer-driven parallax targets ───────────────────────────────
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    let targetCamX = 0, targetCamY = 0;   // camera pan target
    let targetTiltX = 0, targetTiltY = 0; // cloud tilt target
    const onPointer = (e: PointerEvent) => {
      // Normalize pointer offset from centre by MOUSE_RADIUS (reach).
      const nx = clamp((e.clientX / window.innerWidth  - 0.5) / MOUSE_RADIUS);
      const ny = clamp((e.clientY / window.innerHeight - 0.5) / MOUSE_RADIUS);
      // Camera pan (subtle) + cloud tilt (depth parallax), both via MOUSE_FORCE.
      targetCamX  =  nx * MOUSE_FORCE;
      targetCamY  = -ny * MOUSE_FORCE;
      targetTiltY =  nx * MOUSE_FORCE * 0.35;
      targetTiltX =  ny * MOUSE_FORCE * 0.35;
    };
    window.addEventListener('pointermove', onPointer);

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop (pausable) ──────────────────────────────────────
    let frameId = 0;
    let running = false;
    let autoRot = 0;
    const AUTO_ROT = DRIFT_SPEED * 0.06;       // slow auto-spin, tied to drift
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const hx = SPREAD_X / 2, hy = SPREAD_Y / 2, hz = SPREAD_Z / 2;

    const renderFrame = () => {
      // Autonomous per-particle drift with wrap-around.
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pos[i3]     += velocities[i3];
        pos[i3 + 1] += velocities[i3 + 1];
        pos[i3 + 2] += velocities[i3 + 2];
        if (pos[i3]     >  hx) pos[i3]     = -hx; else if (pos[i3]     < -hx) pos[i3]     =  hx;
        if (pos[i3 + 1] >  hy) pos[i3 + 1] = -hy; else if (pos[i3 + 1] < -hy) pos[i3 + 1] =  hy;
        if (pos[i3 + 2] >  hz) pos[i3 + 2] = -hz; else if (pos[i3 + 2] < -hz) pos[i3 + 2] =  hz;
      }
      posAttr.needsUpdate = true;

      // Slow auto-rotation reveals the cloud's depth.
      autoRot += AUTO_ROT;
      points.rotation.y = autoRot;
      points.rotation.x = Math.sin(autoRot * 0.5) * 0.05;

      // Ease camera pan + cloud tilt toward the pointer targets (EASING
      // sets responsiveness). Differing particle depths make the tilt read
      // as genuine 3D parallax.
      camera.position.x += (targetCamX - camera.position.x) * EASING;
      camera.position.y += (targetCamY - camera.position.y) * EASING;
      cloud.rotation.x  += (targetTiltX - cloud.rotation.x) * EASING;
      cloud.rotation.y  += (targetTiltY - cloud.rotation.y) * EASING;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      renderFrame();
      frameId = requestAnimationFrame(loop);
    };
    const startLoop = () => { if (!running) { running = true; frameId = requestAnimationFrame(loop); } };
    const stopLoop  = () => { running = false; cancelAnimationFrame(frameId); };

    // ── GUARD: render only when tab visible AND canvas on-screen ──────
    let onScreen = true;
    const syncRunning = () => {
      if (!document.hidden && onScreen) startLoop();
      else stopLoop();
    };
    const onVisibility = () => syncRunning();
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => { onScreen = entry.isIntersecting; syncRunning(); },
      { threshold: 0 },
    );
    io.observe(mount);

    syncRunning();

    // ── GUARD: full teardown — no WebGL context / listener leaks ──────
    return () => {
      stopLoop();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      id="three-bg"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        // Static gradient — also the reduced-motion fallback (no canvas then).
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.04) 0%, transparent 60%),' +
          'radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.04) 0%, transparent 60%),' +
          '#0A0A0C',
      }}
    />
  );
}
