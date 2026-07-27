"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ---------------- DNA HELIX VISUALIZATION ----------------
    A double helix DNA visualization that responds to scroll.
    Shows two intertwined helical strands with connecting base pairs.
    As user scrolls:
      - The helix rotates and twists
      - Base pairs pulse with energy
      - The structure gently pulses and breathes
    Designed to work with the existing scroll-driven animation system.

    Static-export safe (no window at module scope). Reduced-motion / no-WebGL:
    renders nothing — the CSS fallback remains. */

const VERT = /* glsl */ `
  attribute float aOffset;      // angular offset around helix (0..1)
  attribute float aStrand;      // which strand (0 or 1)
  attribute float aBaseIndex;   // position along helix (0..1)
  attribute float aSize;        // point size

  uniform float uTime;
  uniform float uPhase;         // 0..1 scroll progress
  uniform float uTimeScale;     // animation speed
  uniform float uHelixRadius;   // radius of helix
  uniform float uHelixPitch;    // vertical distance per turn
  uniform float uTwistAmount;   // how much to twist based on scroll
  uniform float uPulseAmount;   // pulsing intensity
  uniform float uBaseGlow;      // base pair connection glow
  uniform vec2 uResolution;     // screen resolution
  uniform vec2 uMouse;          // mouse position (normalized)
  uniform float uMouseEffect;   // mouse interaction strength

  varying float vStrand;
  varying float vBaseIndex;
  varying float vGlow;
  varying float vPulse;

  void main() {
    // Calculate helix position
    float angle = aBaseIndex * 6.2831853 * 2.0; // 2 full turns per unit
    angle += aOffset * 6.2831853;               // offset by strand
    
    // Apply twist based on scroll progress
    float twist = uTwistAmount * uPhase * 6.2831853;
    angle += twist * aBaseIndex;
    
    float y = (aBaseIndex - 0.5) * uHelixPitch * 2.0; // center vertically
    float x = cos(angle) * uHelixRadius;
    float z = sin(angle) * uHelixRadius;
    
    // Alternate strands in opposite directions
    if (aStrand > 0.5) {
      angle += 3.14159265; // opposite strand
      x = cos(angle) * uHelixRadius;
      z = sin(angle) * uHelixRadius;
    }
    
    // Apply pulse effect
    float pulse = sin(uTime * uTimeScale * 2.0 + aBaseIndex * 6.2831853 * 3.0) * 0.5 + 0.5;
    vPulse = pulse;
    float pulseScale = 1.0 + (pulse - 0.5) * uPulseAmount * 0.5;
    
    // Apply mouse interaction
    float mouseDist = distance(vec2(x, z), uMouse);
    float mouseEffect = (1.0 - smoothstep(0.0, 0.3, mouseDist)) * uMouseEffect;
    vec3 offset = vec3(
      (x - uMouse.x) * mouseEffect * 0.1,
      0.0,
      (z - uMouse.y) * mouseEffect * 0.1
    );
    
    vec3 position = vec3(x, y, z) * pulseScale + offset;
    
    // Calculate glow for base pairs (strongest near center of helix)
    float dx = x - 0.0;
    float dz = z - 0.0;
    float distFromCenter = sqrt(dx * dx + dz * dz);
    float glow = smoothstep(0.0, uHelixRadius * 0.8, distFromCenter);
    vGlow = glow * uBaseGlow;
    
    // Pass varying data to fragment shader
    vStrand = aStrand;
    vBaseIndex = aBaseIndex;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Point size based on distance and pulse
    float distToCamera = length(mvPosition.xyz);
    float size = aSize * (300.0 / distToCamera) * (1.0 + vPulse * 0.5);
    gl_PointSize = size;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  
  uniform vec3 uStrandColor1;   // first strand color
  uniform vec3 uStrandColor2;   // second strand color
  uniform vec3 uBaseColor;      // base pair color
  uniform float uBaseThickness; // thickness of base connections
  
  varying float vStrand;
  varying float vBaseIndex;
  varying float vGlow;
  varying float vPulse;
  
  void main() {
    // Calculate distance from center of point (for circular points)
    float dist = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.48, 0.5, dist); // anti-aliased circle
    
    // Discard outside circle
    if (alpha < 0.02) discard;
    
    // Determine color based on whether this is a strand point or base pair
    // For simplicity, we'll make all points glow based on vGlow and vPulse
    vec3 color;
    
    // Base color pulses with vPulse
    float pulseFactor = 0.5 + vPulse * 0.5;
    
    // Mix between strand colors based on vStrand
    vec3 strandColor = mix(uStrandColor1, uStrandColor2, vStrand);
    
    // Base glow adds to the center
    vec3 finalColor = mix(strandColor, uBaseColor, vGlow * 0.7);
    finalColor *= pulseFactor;
    
    // Add a subtle inner glow
    float centerDist = length(gl_PointCoord - 0.5);
    float centerGlow = smoothstep(0.0, 0.2, centerDist);
    finalColor += vec3(1.0, 0.8, 0.6) * centerGlow * 0.3 * vGlow;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default function DnaHelix() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mount.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = mount.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch {
      return; // no WebGL — CSS fallback remains
    }

    gsap.registerPlugin(ScrollTrigger);

    const isCoarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const COUNT = isCoarse ? 8000 : 25000; // number of points per strand
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 15);

    // Create geometry for both strands
    const totalPoints = COUNT * 2; // two strands
    const positions = new Float32Array(totalPoints * 3);
    const offsets = new Float32Array(totalPoints);
    const strands = new Float32Array(totalPoints);
    const baseIndices = new Float32Array(totalPoints);
    const sizes = new Float32Array(totalPoints);

    // Generate helix points
    for (let i = 0; i < COUNT; i++) {
      const baseIndex = i / (COUNT - 1); // 0 to 1
      const angle = baseIndex * Math.PI * 4; // 2 full turns
      const radius = 2.0;
      const y = (baseIndex - 0.5) * 8.0; // -4 to 4

      // Strand 1
      const i1 = i * 2;
      positions[i1 * 3] = Math.cos(angle) * radius;
      positions[i1 * 3 + 1] = y;
      positions[i1 * 3 + 2] = Math.sin(angle) * radius;
      offsets[i1] = 0.0; // no offset for first strand
      strands[i1] = 0.0;
      baseIndices[i1] = baseIndex;
      sizes[i1] = 0.8 + Math.random() * 0.4;

      // Strand 2 (offset by 180 degrees)
      const i2 = i * 2 + 1;
      positions[i2 * 3] = Math.cos(angle + Math.PI) * radius;
      positions[i2 * 3 + 1] = y;
      positions[i2 * 3 + 2] = Math.sin(angle + Math.PI) * radius;
      offsets[i2] = 0.5; // half way around
      strands[i2] = 1.0;
      baseIndices[i2] = baseIndex;
      sizes[i2] = 0.8 + Math.random() * 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    geometry.setAttribute("aStrand", new THREE.BufferAttribute(strands, 1));
    geometry.setAttribute("aBaseIndex", new THREE.BufferAttribute(baseIndices, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const uniforms = {
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uTimeScale: { value: 1.5 },
      uHelixRadius: { value: 2.0 },
      uHelixPitch: { value: 8.0 },
      uTwistAmount: { value: 0.5 },
      uPulseAmount: { value: 0.8 },
      uBaseGlow: { value: 0.6 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseEffect: { value: 0.0 },
      uStrandColor1: { value: new THREE.Color(0xff6b6b) }, // coral red
      uStrandColor2: { value: new THREE.Color(0x4ecdc4) }, // turquoise
      uBaseColor: { value: new THREE.Color(0xffffcc) }, // pale yellow
      uBaseThickness: { value: 0.1 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: uniforms,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    // Add a subtle ambient glow
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Set up scroll tracking
    gsap.registerPlugin(ScrollTrigger);
    
    let sectionPhase = 0;
    
    // Find sections that might control the DNA animation
    const setupScrollTriggers = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-dna-phase]"));
      sections.forEach((section) => {
        const startPhase = parseFloat(section.dataset.dnaStart || "0");
        const endPhase = parseFloat(section.dataset.dnaEnd || "1");
        
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: (self) => {
            sectionPhase = startPhase + (endPhase - startPhase) * self.progress;
            uniforms.uPhase.value = sectionPhase;
          }
        });
      });
    };

    // Mouse tracking
    const mouse = new THREE.Vector2(0.5, 0.5);
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth);
      mouse.y = 1.0 - (event.clientY / window.innerHeight);
    };
    
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      uniforms.uTime.value += delta;
      
      // Update mouse effect with decay
      uniforms.uMouse.value.lerp(mouse, 0.1);
      uniforms.uMouseEffect.value = Math.min(1.0, 
        (0.5 - Math.abs(mouse.x - 0.5)) * (0.5 - Math.abs(mouse.y - 0.5)) * 4.0
      );
      
      // Update resolution
      uniforms.uResolution.value.set(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle resize
    const onResize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener("resize", onResize);
    setupScrollTriggers();

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "strict" }}
    />
  );
}