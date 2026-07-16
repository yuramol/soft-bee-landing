'use client';

import { RefObject, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame, useThree } from '@react-three/fiber';

const VERTEX_SHADER = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRadius;
  varying vec2 vUv;
  varying float vSize;
  varying vec2 vPos;

  attribute vec3 aOffset;
  attribute float aRandom;

  #define PI 3.14159265359

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  mat2 rotate2d(float _angle) {
    return mat2(cos(_angle), sin(_angle), -sin(_angle), cos(_angle));
  }

  float sdTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec2 e0 = b - a;
    vec2 e1 = c - b;
    vec2 e2 = a - c;
    vec2 v0 = p - a;
    vec2 v1 = p - b;
    vec2 v2 = p - c;

    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);

    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(
      vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
      vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
      vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));

    return -sqrt(d.x) * sign(d.y);
  }

  // Softbee "b" descender: straight left diagonal + nearly vertical right edge
  // that meets the circle in a sharp corner (the ring curve does the rest).
  float sdSoftbeeTip(vec2 p, float r) {
    vec2 apex = vec2(-r * 0.22, -r * 1.46);
    vec2 leftA = vec2(-r * 1.0, -r * 0.22);
    // Almost directly above the tip → vertical stem into the rim junction.
    vec2 rightA = vec2(-r * 0.16, -r * 0.995);
    return sdTriangle(p, apex, leftA, rightA);
  }

  float medusaeBand(vec2 p, float r) {
    float dOuter = length(p) - r;
    float dInner = length(p) - r * 0.48;
    float dAnnulus = max(dOuter, -dInner);
    float dTip = sdSoftbeeTip(p, r);

    // Tip stays solid so the stem/circle corner matches Softbee.
    return min(dAnnulus, dTip);
  }

  void main() {
    vUv = uv;

    vec3 pos = aOffset;
    float rand = aRandom;

    // Layered fluid drift — field feels alive even before the halo reacts.
    float t = uTime;
    float drift1 = t * 0.18;
    float drift2 = t * 0.09;
    float dx = sin(drift1 + pos.y * 0.55) * 0.55 + sin(drift2 + pos.y * 1.7 + rand) * 0.35;
    float dy = cos(drift1 + pos.x * 0.55) * 0.55 + cos(drift2 + pos.x * 1.7 - rand) * 0.35;
    pos.x += dx * 0.32;
    pos.y += dy * 0.32;

    vec2 relToMouse = pos.xy - uMouse;
    float distFromMouse = length(relToMouse);
    float angleToMouse = atan(relToMouse.y, relToMouse.x);
    vec2 radialDir = normalize(relToMouse + vec2(0.0001, 0.0));
    vec2 tangentDir = vec2(-radialDir.y, radialDir.x);

    // Organic breathing of the Softbee silhouette.
    float shapeNoise = noise(vec2(angleToMouse * 2.2, t * 0.12));
    float breathSlow = sin(t * 0.65 + rand * 1.5);
    float breathFast = sin(t * 1.35 + angleToMouse * 2.0);
    float breathCycle = breathSlow * 0.7 + breathFast * 0.3;
    float currentRadius = uRadius * (0.70 + breathCycle * 0.07 + shapeNoise * 0.05);

    float bandDist = medusaeBand(relToMouse, currentRadius);
    float rimSoft = uRadius * (0.09 + breathCycle * 0.02);
    float rimInfluence = 1.0 - smoothstep(-rimSoft, rimSoft, bandDist);

    // Traveling concentric ripples + swirl (Antigravity-style volume).
    float ripple = sin(distFromMouse * 2.4 - t * 2.1 + rand * 2.0);
    float swirl = sin(angleToMouse * 3.0 + distFromMouse * 1.1 - t * 1.1);
    float pulse = breathCycle * 0.5 + 0.5;

    float radialPush = (pulse * uRadius * 0.085 + ripple * uRadius * 0.035) * rimInfluence;
    float tangentialPush = (swirl * uRadius * 0.055 + ripple * uRadius * 0.02) * rimInfluence;

    pos.xy += radialDir * radialPush;
    pos.xy += tangentDir * tangentialPush;

    // Depth parallax — particles lift off the plane for a volumetric read.
    float depthWave = sin(t * 1.1 + distFromMouse * 1.8 + rand * 6.28318);
    float depthBreath = pulse * 0.55 + depthWave * 0.45;
    pos.z += rimInfluence * (0.55 + rand * 0.45) * depthBreath * (uRadius * 0.08);

    // Size swells with breath + ripple so dashes feel dimensional.
    float sizePulse = 0.75 + pulse * 0.35 + ripple * 0.12 * rimInfluence;
    float baseSize = uRadius * 0.0038;
    float activeSize = uRadius * 0.026 * sizePulse;
    float currentScale = baseSize + rimInfluence * activeSize;
    float stretch = rimInfluence * uRadius * (0.01 + pulse * 0.006);

    vec3 transformed = position;
    transformed.x *= (currentScale + stretch);
    transformed.y *= currentScale * (0.62 + rand * 0.12);

    vSize = rimInfluence * (0.85 + pulse * 0.15);
    vPos = pos.xy;

    // Orientation follows the swirl field, not a rigid spoke.
    float orientAngle = angleToMouse + swirl * 0.35 + ripple * 0.12;
    transformed.xy = rotate2d(orientAngle) * transformed.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + transformed, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vSize;
  varying vec2 vPos;

  void main() {
    vec2 center = vec2(0.5);
    vec2 pos = abs(vUv - center) * 2.0;

    float d = pow(pow(pos.x, 2.6) + pow(pos.y, 2.6), 1.0 / 2.6);
    float alpha = 1.0 - smoothstep(0.8, 1.0, d);

    if (alpha < 0.01) discard;

    vec3 cBlue = vec3(0.26, 0.52, 0.96);
    vec3 cRed = vec3(0.92, 0.26, 0.21);
    vec3 cYellow = vec3(0.98, 0.73, 0.01);
    vec3 cPurple = vec3(0.55, 0.32, 0.92);

    float t = uTime * 1.05;
    float p1 = sin(vPos.x * 0.7 + t);
    float p2 = sin(vPos.y * 0.7 + t * 0.85 + p1);
    float p3 = sin((vPos.x + vPos.y) * 0.45 - t * 0.6);

    vec3 activeColor = mix(cBlue, cPurple, p1 * 0.5 + 0.5);
    activeColor = mix(activeColor, cRed, p2 * 0.45 + 0.2);
    activeColor = mix(activeColor, cYellow, p3 * 0.35 + 0.15);

    float ringAlpha = smoothstep(0.05, 0.55, vSize);
    float shimmer = 0.88 + 0.12 * sin(uTime * 2.0 + vPos.x * 1.5);
    float finalAlpha = alpha * ringAlpha * uOpacity * shimmer;

    if (finalAlpha < 0.01) discard;

    gl_FragColor = vec4(activeColor, finalAlpha);
  }
`;

interface ParticleUniforms {
  [uniform: string]: THREE.IUniform;
  uTime: THREE.IUniform<number>;
  uMouse: THREE.IUniform<THREE.Vector2>;
  uResolution: THREE.IUniform<THREE.Vector2>;
  uRadius: THREE.IUniform<number>;
  uOpacity: THREE.IUniform<number>;
}

interface ParticlesProps {
  isHovering: boolean;
}

interface MedusaeProps {
  eventSource: RefObject<HTMLElement | null>;
  isHovering: boolean;
  className?: string;
}

function createParticleUniforms(): ParticleUniforms {
  return {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uRadius: { value: 6 },
    uOpacity: { value: 0 }
  };
}

function Particles({ isHovering }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, size } = useThree();
  const hoveringRef = useRef(isHovering);
  const wasHoveringRef = useRef(false);

  useEffect(() => {
    hoveringRef.current = isHovering;
  }, [isHovering]);

  const countX = 90;
  const countY = 55;
  const count = countX * countY;

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const uniforms = useMemo(() => createParticleUniforms(), []);
  const uniformsRef = useRef(uniforms);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false
      }),
    [uniforms]
  );

  useEffect(() => {
    uniformsRef.current.uResolution.value.set(size.width, size.height);
  }, [size.width, size.height]);

  useEffect(() => {
    if (!meshRef.current) return;

    const offsets = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const angles = new Float32Array(count);
    const gridWidth = viewport.width * 1.35;
    const gridHeight = viewport.height * 1.35;
    const jitter = 0.4;

    let i = 0;
    for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
        const u = x / (countX - 1);
        const v = y / (countY - 1);

        let px = (u - 0.5) * gridWidth;
        let py = (v - 0.5) * gridHeight;

        px += (Math.random() - 0.5) * jitter;
        py += (Math.random() - 0.5) * jitter;

        offsets[i * 3] = px;
        offsets[i * 3 + 1] = py;
        offsets[i * 3 + 2] = 0;

        randoms[i] = Math.random();
        angles[i] = Math.random() * Math.PI * 2;
        i++;
      }
    }

    meshRef.current.geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
    meshRef.current.geometry.setAttribute('aRandom', new THREE.InstancedBufferAttribute(randoms, 1));
    meshRef.current.geometry.setAttribute('aAngleOffset', new THREE.InstancedBufferAttribute(angles, 1));
  }, [count, countX, countY, viewport.width, viewport.height]);

  useFrame((state) => {
    const { clock, pointer } = state;
    const nextUniforms = uniformsRef.current;
    const isActive = hoveringRef.current;
    const current = nextUniforms.uMouse.value;

    nextUniforms.uTime.value = clock.getElapsedTime();
    nextUniforms.uRadius.value = Math.min(viewport.width, viewport.height) * 0.52;

    const targetOpacity = isActive ? 1 : 0;
    nextUniforms.uOpacity.value += (targetOpacity - nextUniforms.uOpacity.value) * 0.1;

    if (isActive) {
      const targetX = (pointer.x * viewport.width) / 2;
      const targetY = (pointer.y * viewport.height) / 2;

      if (!wasHoveringRef.current) {
        current.x = targetX;
        current.y = targetY;
      } else {
        // Heavier follow — Antigravity-like weight.
        const dragFactor = 0.04;
        current.x += (targetX - current.x) * dragFactor;
        current.y += (targetY - current.y) * dragFactor;
      }
    }

    wasHoveringRef.current = isActive;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

export function Medusae({ eventSource, isHovering, className }: MedusaeProps) {
  return (
    <Canvas
      className={className}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix='client'
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 20], fov: 50, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Particles isHovering={isHovering} />
    </Canvas>
  );
}
