'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const viewportW = window.innerWidth;
    const isMobile  = viewportW < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scale particle work to the device: far fewer on phones, fewer still when
    // the user prefers reduced motion (we render a single static frame then).
    const PARTICLE_COUNT = reducedMotion
      ? 600
      : isMobile
        ? 900
        : viewportW < 1280
          ? 1500
          : 2200;

    // ── Scene ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    // Cap DPR harder on mobile — the biggest GPU fill-rate cost on phones.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Soft-circle texture (replaces custom fragment shader) ─────
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0,   'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);

    // ── Particle System ───────────────────────────────────────────
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const colors     = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: { vx: number; vy: number; vz: number }[] = [];

    const palette = [
      new THREE.Color('#10B981'), // emerald
      new THREE.Color('#06B6D4'), // cyan
      new THREE.Color('#14B8A6'), // teal
      new THREE.Color('#34D399'), // emerald-light
      new THREE.Color('#F0F4F8'), // near-white
      new THREE.Color('#8892A4'), // muted blue-grey
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      velocities.push({
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
        vz: (Math.random() - 0.5) * 0.002,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    // PointsMaterial — no custom GLSL, universally GPU-compatible
    const material = new THREE.PointsMaterial({
      size: 0.18,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── Mouse parallax ────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation Loop (pausable) ─────────────────────────────────
    let cleanupExtras = () => {};
    let frameId = 0;
    let running = false;
    let t = 0;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;

    const renderFrame = () => {
      t += 0.004;

      const pos = posAttr.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const v  = velocities[i];
        pos[i3]     += v.vx;
        pos[i3 + 1] += v.vy;
        pos[i3 + 2] += v.vz;

        // Wrap boundaries
        if (pos[i3]     >  20) pos[i3]     = -20;
        if (pos[i3]     < -20) pos[i3]     =  20;
        if (pos[i3 + 1] >  15) pos[i3 + 1] = -15;
        if (pos[i3 + 1] < -15) pos[i3 + 1] =  15;
        if (pos[i3 + 2] >  10) pos[i3 + 2] = -10;
        if (pos[i3 + 2] < -10) pos[i3 + 2] =  10;
      }
      posAttr.needsUpdate = true;

      // Smooth camera follow
      camera.position.x += (mouseX  - camera.position.x) * 0.025;
      camera.position.y += (-mouseY - camera.position.y) * 0.025;

      // Slow global rotation
      particles.rotation.y = t * 0.04;
      particles.rotation.x = Math.sin(t * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      renderFrame();
      frameId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      frameId = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(frameId);
    };

    // Render only when the tab is visible AND the canvas is on-screen.
    let onScreen = true;
    const syncRunning = () => {
      if (!document.hidden && onScreen) startLoop();
      else stopLoop();
    };

    if (reducedMotion) {
      // Reduced motion: draw one static frame, never start the rAF loop.
      renderFrame();
    } else {
      // Pause when the tab is backgrounded.
      const onVisibility = () => syncRunning();
      document.addEventListener('visibilitychange', onVisibility);

      // Pause when the canvas leaves the viewport (e.g. display:none, or a
      // future non-fixed layout). Harmless no-op while it's a fixed bg.
      const io = new IntersectionObserver(
        ([entry]) => { onScreen = entry.isIntersecting; syncRunning(); },
        { threshold: 0 },
      );
      io.observe(mount);

      syncRunning();

      // Stash teardown for these listeners on the cleanup closure below.
      cleanupExtras = () => {
        document.removeEventListener('visibilitychange', onVisibility);
        io.disconnect();
      };
    }

    return () => {
      stopLoop();
      cleanupExtras();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
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
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.04) 0%, transparent 60%),' +
          'radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.04) 0%, transparent 60%),' +
          '#0A0A0C',
      }}
    />
  );
}
