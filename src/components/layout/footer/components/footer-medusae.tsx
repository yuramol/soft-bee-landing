'use client';

import { RefObject, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame, useThree } from '@react-three/fiber';

import { LOGO_ASPECT, sampleLogoPoints } from './utils';

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uMorph;
  uniform float uScale;
  uniform float uPointSize;

  attribute vec3 aHome;
  attribute vec2 aTarget;
  attribute float aRandom;

  varying float vStrength;

  void main() {
    float rand = aRandom;
    float t = uTime;
    float morph = clamp(uMorph, 0.0, 1.0);
    // Quintic smoothstep — soft assemble into Soft Bee.
    float eased = morph * morph * morph * (morph * (morph * 6.0 - 15.0) + 10.0);
    float localMorph = eased;
    float scatter = 1.0 - localMorph;

    float phase = rand * 6.28318;

    // Idle float while scattered across the net.
    float floatAmp = uScale * 0.014 * scatter;
    vec3 home = aHome;
    home.x += cos(t * 0.22 + phase) * floatAmp;
    home.y += sin(t * 0.28 + phase * 0.8) * floatAmp;

    // Formed Soft Bee: filled letters + gentle life (no leftover field dots).
    float wave = sin(aTarget.x * 5.0 - t * 0.85 + phase * 0.4);
    float waveY = cos(aTarget.y * 7.0 + t * 0.65 + phase);
    float orbit = t * 0.75 + phase;
    vec2 logoJitter = vec2(
      cos(orbit) * 0.006 + wave * 0.004 + cos(t * 0.48 + phase) * 0.0025,
      sin(orbit * 1.15) * 0.006 + waveY * 0.0035 + sin(t * 0.58 + phase) * 0.0025
    );
    float markPulse = 1.0 + localMorph * (sin(t * 0.55) * 0.012 + wave * 0.003);
    vec3 logo = vec3((aTarget * markPulse + logoJitter * localMorph) * uScale, 0.0);

    vec3 pos = mix(home, logo, localMorph);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizePulse = 1.0 + localMorph * (0.08 * sin(t * 0.9 + phase) + 0.035 * wave);
    gl_PointSize = uPointSize * mix(0.85, 1.02, localMorph) * (0.92 + rand * 0.14) * sizePulse;

    float shimmer = 0.88 + 0.12 * sin(t * 1.0 + phase) + 0.05 * wave;
    vStrength = mix(0.55 + rand * 0.25, clamp(shimmer, 0.78, 1.0), localMorph);
  }
`;

const FRAGMENT_SHADER = `
  uniform float uOpacity;
  varying float vStrength;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float d = length(centered) * 2.0;
    float alpha = 1.0 - smoothstep(0.55, 1.0, d);
    if (alpha < 0.03) discard;

    vec3 brandBlack = vec3(0.106, 0.110, 0.137);
    gl_FragColor = vec4(brandBlack, alpha * vStrength * uOpacity);
  }
`;

interface ParticleUniforms {
  [uniform: string]: THREE.IUniform;
  uTime: THREE.IUniform<number>;
  uMorph: THREE.IUniform<number>;
  uScale: THREE.IUniform<number>;
  uPointSize: THREE.IUniform<number>;
  uOpacity: THREE.IUniform<number>;
}

interface ParticlesProps {
  isHovering: boolean;
}

interface FooterMedusaeProps {
  eventSource: RefObject<HTMLElement | null>;
  isHovering: boolean;
  className?: string;
}

const MAX_PARTICLES = 12000;
const TARGET_DOT_CSS_PX = 2.25;
const LOGO_SAMPLE_POOL = 12000;
const PARTICLE_BUILD_REVISION = 4;

let cachedLogoPool: Float32Array | null = null;

function getLogoPool(): Float32Array {
  if (!cachedLogoPool) {
    // Mostly filled letter interiors so Soft Bee reads like the real mark.
    cachedLogoPool = sampleLogoPoints({ count: LOGO_SAMPLE_POOL, edgeRatio: 0.14 });
  }
  return cachedLogoPool;
}

function createParticleUniforms(): ParticleUniforms {
  return {
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uScale: { value: 1 },
    uPointSize: { value: 2.25 },
    uOpacity: { value: 1 }
  };
}

function assignNearestLogoHomes(
  homes: Float32Array,
  gridCount: number,
  targets: Float32Array,
  logoCount: number,
  fitScale: number,
  cellSize: number
): Float32Array {
  const targetAttr = new Float32Array(gridCount * 2);
  const taken = new Uint8Array(gridCount);

  const invCell = 1 / Math.max(cellSize, 0.0001);
  const buckets = new Map<number, number[]>();

  function bucketKey(bx: number, by: number) {
    return bx * 73856093 + by * 19349663;
  }

  for (let i = 0; i < gridCount; i++) {
    const bx = Math.floor(homes[i * 3] * invCell);
    const by = Math.floor(homes[i * 3 + 1] * invCell);
    const key = bucketKey(bx, by);
    const list = buckets.get(key);
    if (list) list.push(i);
    else buckets.set(key, [i]);
  }

  for (let logoIndex = 0; logoIndex < logoCount; logoIndex++) {
    const tx = targets[logoIndex * 2] * fitScale;
    const ty = targets[logoIndex * 2 + 1] * fitScale;
    const bx = Math.floor(tx * invCell);
    const by = Math.floor(ty * invCell);

    let bestIndex = -1;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let radius = 0; radius <= 8 && bestIndex < 0; radius++) {
      for (let oy = -radius; oy <= radius; oy++) {
        for (let ox = -radius; ox <= radius; ox++) {
          if (radius > 0 && Math.max(Math.abs(ox), Math.abs(oy)) !== radius) continue;
          const list = buckets.get(bucketKey(bx + ox, by + oy));
          if (!list) continue;

          for (let n = 0; n < list.length; n++) {
            const index = list[n];
            if (taken[index]) continue;
            const dx = homes[index * 3] - tx;
            const dy = homes[index * 3 + 1] - ty;
            const dist = dx * dx + dy * dy;
            if (dist < bestDist) {
              bestDist = dist;
              bestIndex = index;
            }
          }
        }
      }
    }

    if (bestIndex < 0) continue;

    taken[bestIndex] = 1;
    targetAttr[bestIndex * 2] = targets[logoIndex * 2];
    targetAttr[bestIndex * 2 + 1] = targets[logoIndex * 2 + 1];
  }

  // Any leftover net cells still join Soft Bee (no residual field when formed).
  for (let i = 0; i < gridCount; i++) {
    if (taken[i]) continue;
    const fallback = (i * 17) % Math.max(logoCount, 1);
    targetAttr[i * 2] = targets[fallback * 2];
    targetAttr[i * 2 + 1] = targets[fallback * 2 + 1];
  }

  return targetAttr;
}

function Particles({ isHovering }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport, size, gl } = useThree();
  const hoveringRef = useRef(isHovering);
  const morphRef = useRef(0);
  const morphVelocityRef = useRef(0);
  const readyRef = useRef(false);
  const lastBuildKeyRef = useRef('');

  useEffect(() => {
    hoveringRef.current = isHovering;
  }, [isHovering]);

  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const uniforms = useMemo(() => createParticleUniforms(), []);
  const uniformsRef = useRef(uniforms);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        depthTest: false
      }),
    [uniforms]
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useEffect(() => {
    if (viewport.width < 0.1 || viewport.height < 0.1 || size.height < 1) return;

    // Skip tiny resizes that would hitch the main thread rebuilding the net.
    const buildKey = `${PARTICLE_BUILD_REVISION}_${Math.round(viewport.width * 4)}_${Math.round(viewport.height * 4)}`;
    if (buildKey === lastBuildKeyRef.current && readyRef.current) return;
    lastBuildKeyRef.current = buildKey;

    // Drop legacy attributes from earlier streamer builds.
    geometry.deleteAttribute('aIsLogo');
    geometry.deleteAttribute('aIsStreamer');

    const fieldWidth = viewport.width * 1.02;
    const fieldHeight = viewport.height * 1.02;
    const worldPerCssPx = viewport.height / size.height;
    const idealSpacing = worldPerCssPx * 9;
    const idealCols = Math.max(1, Math.floor(fieldWidth / idealSpacing));
    const idealRows = Math.max(1, Math.floor(fieldHeight / idealSpacing));
    const idealCount = idealCols * idealRows;

    let cols: number;
    let rows: number;
    let gridCount: number;

    if (idealCount <= MAX_PARTICLES) {
      cols = idealCols;
      rows = idealRows;
      gridCount = idealCount;
    } else {
      const aspect = fieldWidth / Math.max(fieldHeight, 0.001);
      cols = Math.max(1, Math.round(Math.sqrt(MAX_PARTICLES * aspect)));
      rows = Math.max(1, Math.floor(MAX_PARTICLES / cols));
      gridCount = cols * rows;
    }

    const cellW = fieldWidth / cols;
    const cellH = fieldHeight / rows;
    const jitter = Math.min(cellW, cellH) * 0.08;
    const cellSize = Math.max(cellW, cellH);
    const fitScale = Math.min((viewport.width * 0.94) / LOGO_ASPECT, viewport.height * 0.72);
    // Every net particle becomes Soft Bee on hover — no leftover dots around the words.
    const logoCount = Math.min(gridCount, LOGO_SAMPLE_POOL);

    const homes = new Float32Array(gridCount * 3);
    const randoms = new Float32Array(gridCount);
    const positions = new Float32Array(gridCount * 3);

    for (let i = 0; i < gridCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      randoms[i] = Math.random();

      const gx = (col + 0.5) / cols - 0.5;
      const gy = (row + 0.5) / rows - 0.5;
      const hx = gx * fieldWidth + (Math.random() - 0.5) * jitter;
      const hy = gy * fieldHeight + (Math.random() - 0.5) * jitter;
      homes[i * 3] = hx;
      homes[i * 3 + 1] = hy;
      homes[i * 3 + 2] = 0;
      positions[i * 3] = hx;
      positions[i * 3 + 1] = hy;
      positions[i * 3 + 2] = 0;
    }

    const pool = getLogoPool();
    const targets = pool.subarray(0, logoCount * 2);
    const targetAttr = assignNearestLogoHomes(homes, gridCount, targets, logoCount, fitScale, cellSize);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aHome', new THREE.BufferAttribute(homes, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(targetAttr, 2));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setDrawRange(0, gridCount);
    readyRef.current = true;
  }, [geometry, viewport.width, viewport.height, size.height]);

  useFrame((_, delta) => {
    const nextUniforms = uniformsRef.current;
    const targetMorph = hoveringRef.current ? 1 : 0;
    const dt = Math.min(Math.max(delta, 0), 0.033);

    // Slower assemble so dots ease into Soft Bee more gently.
    const frequency = 3.0;
    const damping = 2 * Math.sqrt(frequency);
    const accel = frequency * frequency * (targetMorph - morphRef.current) - damping * morphVelocityRef.current;
    morphVelocityRef.current += accel * dt;
    morphRef.current += morphVelocityRef.current * dt;
    if (morphRef.current < 0) {
      morphRef.current = 0;
      morphVelocityRef.current = 0;
    } else if (morphRef.current > 1) {
      morphRef.current = 1;
      morphVelocityRef.current = 0;
    }

    nextUniforms.uTime.value += dt;
    nextUniforms.uMorph.value = morphRef.current;
    nextUniforms.uOpacity.value = readyRef.current ? 1 : 0;

    const fitWidth = (viewport.width * 0.94) / LOGO_ASPECT;
    const fitHeight = viewport.height * 0.72;
    nextUniforms.uScale.value = Math.min(fitWidth, fitHeight);
    nextUniforms.uPointSize.value = TARGET_DOT_CSS_PX * gl.getPixelRatio();
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}

export function FooterMedusae({ eventSource, isHovering, className }: FooterMedusaeProps) {
  return (
    <Canvas
      className={className}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix='client'
      dpr={1}
      resize={{ scroll: false, debounce: 100 }}
      camera={{ position: [0, 0, 20], fov: 50, near: 0.1, far: 100 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false
      }}
      style={{ pointerEvents: 'none' }}
    >
      <Particles isHovering={isHovering} />
    </Canvas>
  );
}
