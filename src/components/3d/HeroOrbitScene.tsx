import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useDiv } from '../../context/DivContext';
import type { ClubId } from '../../types';

export type OrbitSceneVariant = 'hero' | ClubId;

interface HeroOrbitSceneProps {
  variant?: OrbitSceneVariant;
  className?: string;
  interactiveHint?: boolean;
}

// Reusable scratch math helpers at module scope (zero GC in render loop)
const _dummy = new THREE.Object3D();
const _targetColor = new THREE.Color();

function createChevronsTexture(symbol: string, subtitle: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#11100C';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle concentric brushed metallic rings on dial face
    for (let r = 40; r < 245; r += 6) {
      ctx.beginPath();
      ctx.arc(256, 256, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(218, 178, 76, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Precision outer gold hairline ring
    ctx.beginPath();
    ctx.arc(256, 256, 232, 0, Math.PI * 2);
    ctx.strokeStyle = '#DAB24C';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Inner subtle ring
    ctx.beginPath();
    ctx.arc(256, 256, 206, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(248, 236, 171, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Main centerpiece typography or emblem
    if (symbol === '<div >') {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 108px "Outfit", sans-serif';
      ctx.fillStyle = '#DAB24C';
      ctx.fillText('<', 112, 240);
      ctx.fillText('>', 400, 240);
      ctx.fillStyle = '#F8ECAB';
      ctx.fillText('div', 256, 242);

      ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#DAB24C';
      ctx.fillText('Dive Into Vision', 256, 326);
    } else {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 132px "Outfit", sans-serif';
      ctx.fillStyle = '#DAB24C';
      ctx.fillText(symbol, 256, 238);

      ctx.font = '500 18px "JetBrains Mono", monospace';
      ctx.fillStyle = '#B8AD8A';
      ctx.fillText(subtitle, 256, 344);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildSculptedBracketGeometry(isRight: boolean): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const dir = isRight ? -1 : 1;
  // Crisp geometric chevron `<` or `>`
  shape.moveTo(dir * 0.22, 0.34);
  shape.lineTo(dir * -0.22, 0.0);
  shape.lineTo(dir * 0.22, -0.34);
  shape.lineTo(dir * 0.31, -0.23);
  shape.lineTo(dir * -0.02, 0.0);
  shape.lineTo(dir * 0.31, 0.23);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}

function buildClubSculpture(
  variant: OrbitSceneVariant,
  goldMat: THREE.Material,
  creamMat: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();

  if (variant === 'coding') {
    const leftB = new THREE.Mesh(buildSculptedBracketGeometry(false), goldMat);
    leftB.position.set(-0.68, 0, 0.22);
    leftB.scale.setScalar(0.75);

    const slashGeo = new THREE.BoxGeometry(0.11, 0.84, 0.1);
    const slash = new THREE.Mesh(slashGeo, creamMat);
    slash.rotation.z = -0.28;
    slash.position.set(0, 0, 0.22);

    const rightB = new THREE.Mesh(buildSculptedBracketGeometry(true), goldMat);
    rightB.position.set(0.68, 0, 0.22);
    rightB.scale.setScalar(0.75);

    group.add(leftB, slash, rightB);
  } else if (variant === 'industry-readiness') {
    // Sculpted ascending arrow `↗`
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.92, 20),
      goldMat,
    );
    shaft.rotation.z = -Math.PI / 4;
    shaft.position.set(-0.04, -0.04, 0.22);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.36, 24), creamMat);
    head.rotation.z = -Math.PI / 4;
    head.position.set(0.32, 0.32, 0.22);

    group.add(shaft, head);
  } else if (variant === 'cultural') {
    // Sculpted eighth note `♪`
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.85, 16),
      goldMat,
    );
    stem.position.set(0.12, 0.1, 0.22);

    const noteHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 24, 24),
      creamMat,
    );
    noteHead.scale.set(1.25, 0.9, 0.65);
    noteHead.rotation.z = 0.3;
    noteHead.position.set(-0.04, -0.28, 0.22);

    const flag = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.04, 12, 24, Math.PI * 0.7),
      goldMat,
    );
    flag.position.set(0.3, 0.32, 0.22);
    flag.rotation.z = -0.5;

    group.add(stem, noteHead, flag);
  } else if (variant === 'sports') {
    // Concentric athletic target rings `◎`
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.06, 20, 48),
      goldMat,
    );
    outerRing.position.z = 0.22;
    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      creamMat,
    );
    innerCore.position.z = 0.22;
    group.add(outerRing, innerCore);
  } else if (variant === 'social-media') {
    // Sculpted hashtag `#`
    const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.92, 16);
    const v1 = new THREE.Mesh(barGeo, goldMat);
    v1.position.set(-0.18, 0, 0.22);
    v1.rotation.z = -0.14;
    const v2 = new THREE.Mesh(barGeo, goldMat);
    v2.position.set(0.18, 0, 0.22);
    v2.rotation.z = -0.14;

    const h1 = new THREE.Mesh(barGeo, creamMat);
    h1.rotation.z = Math.PI / 2;
    h1.position.set(0, 0.17, 0.25);
    const h2 = new THREE.Mesh(barGeo, creamMat);
    h2.rotation.z = Math.PI / 2;
    h2.position.set(0, -0.17, 0.25);

    group.add(v1, v2, h1, h2);
  }

  return group;
}

const ORBITAL_CLUB_ORDER: ClubId[] = [
  'coding',
  'industry-readiness',
  'cultural',
  'sports',
  'social-media',
];

function buildGoldenClubSatellite(
  clubId: ClubId,
  goldMat: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();

  if (clubId === 'coding') {
    const leftB = new THREE.Mesh(buildSculptedBracketGeometry(false), goldMat);
    leftB.position.set(-0.46, 0, 0);
    leftB.scale.setScalar(0.62);
    leftB.castShadow = true;

    const slash = new THREE.Mesh(
      new THREE.BoxGeometry(0.085, 0.62, 0.085),
      goldMat,
    );
    slash.rotation.z = -0.3;
    slash.castShadow = true;

    const rightB = new THREE.Mesh(buildSculptedBracketGeometry(true), goldMat);
    rightB.position.set(0.46, 0, 0);
    rightB.scale.setScalar(0.62);
    rightB.castShadow = true;

    group.add(leftB, slash, rightB);
    group.scale.setScalar(0.36);
  } else if (clubId === 'industry-readiness') {
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.78, 20),
      goldMat,
    );
    shaft.rotation.z = -Math.PI / 4;
    shaft.position.set(-0.08, -0.08, 0);
    shaft.castShadow = true;

    const head = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.36, 24),
      goldMat,
    );
    head.rotation.z = -Math.PI / 4;
    head.position.set(0.24, 0.24, 0);
    head.castShadow = true;

    group.add(shaft, head);
    group.scale.setScalar(0.38);
  } else if (clubId === 'cultural') {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.052, 0.74, 16),
      goldMat,
    );
    stem.position.set(0.1, 0.08, 0);
    stem.castShadow = true;

    const noteHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 24, 24),
      goldMat,
    );
    noteHead.scale.set(1.3, 0.92, 0.68);
    noteHead.rotation.z = 0.32;
    noteHead.position.set(-0.07, -0.24, 0);
    noteHead.castShadow = true;

    const flagCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.43, 0),
      new THREE.Vector3(0.26, 0.33, 0),
      new THREE.Vector3(0.38, 0.13, 0),
      new THREE.Vector3(0.32, -0.03, 0),
    ]);
    const flag = new THREE.Mesh(
      new THREE.TubeGeometry(flagCurve, 16, 0.05, 12, false),
      goldMat,
    );
    flag.castShadow = true;

    const flagTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      goldMat,
    );
    flagTip.position.set(0.32, -0.03, 0);

    group.add(stem, noteHead, flag, flagTip);
    group.scale.setScalar(0.4);
  } else if (clubId === 'sports') {
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.072, 20, 48),
      goldMat,
    );
    outerRing.castShadow = true;

    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.165, 24, 24),
      goldMat,
    );
    innerCore.castShadow = true;

    group.add(outerRing, innerCore);
    group.scale.setScalar(0.4);
  } else if (clubId === 'social-media') {
    const barGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.88, 16);
    const v1 = new THREE.Mesh(barGeo, goldMat);
    v1.position.set(-0.16, 0, 0);
    v1.rotation.z = -0.14;
    v1.castShadow = true;

    const v2 = new THREE.Mesh(barGeo, goldMat);
    v2.position.set(0.16, 0, 0);
    v2.rotation.z = -0.14;
    v2.castShadow = true;

    const h1 = new THREE.Mesh(barGeo, goldMat);
    h1.rotation.z = Math.PI / 2;
    h1.position.set(0, 0.16, 0.03);
    h1.castShadow = true;

    const h2 = new THREE.Mesh(barGeo, goldMat);
    h2.rotation.z = Math.PI / 2;
    h2.position.set(0, -0.16, 0.03);
    h2.castShadow = true;

    group.add(v1, v2, h1, h2);
    group.scale.setScalar(0.38);
  }

  return group;
}

export function HeroOrbitScene({
  variant = 'hero',
  className = '',
  interactiveHint = true,
}: HeroOrbitSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollMetricsRef } = useDiv();
  const [webglFailed, setWebglFailed] = useState(false);

  const variantMeta: Record<OrbitSceneVariant, { symbol: string; sub: string }> = {
    hero: { symbol: '<div >', sub: 'DIVE INTO VISION' },
    coding: { symbol: '< / >', sub: 'DIVE INTO CODING' },
    'industry-readiness': { symbol: '↗', sub: 'INDUSTRY READINESS' },
    cultural: { symbol: '♪', sub: 'DIVE INTO CULTURAL' },
    sports: { symbol: '◎', sub: 'DIVE INTO SPORTS' },
    'social-media': { symbol: '#', sub: 'SOCIAL MEDIA CLUB' },
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // 1. Software WebGL detection via renderer string
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 560;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Scene, Camera, Fog & Studio Environment
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080807, 0.042);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    const baseCameraZ = variant === 'hero' ? 7.6 : 7.2;
    const computeCameraZ = (aspect: number) =>
      aspect < 1 ? baseCameraZ / Math.max(aspect, 0.78) : baseCameraZ;
    camera.position.set(0, 0.15, computeCameraZ(width / height));

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 3. 3-Point Studio Lighting Rig (warm key, cool fill, warm rim)
    const keyLight = new THREE.DirectionalLight(0xffe6a3, 2.4);
    keyLight.position.set(4.5, 5.5, 5.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiFill = new THREE.HemisphereLight(0xa3b8d9, 0x1a150b, 0.75);
    scene.add(hemiFill);

    const rimLight = new THREE.DirectionalLight(0xdab24c, 1.85);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // 4. PBR Material Library (varied roughness & metalness >= 0.25 delta)
    const brushedGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xdab24c,
      metalness: 0.94,
      roughness: 0.18,
      anisotropy: 0.8,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });

    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x10100d,
      metalness: 0.22,
      roughness: 0.62,
    });

    const creamGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf8ecab,
      metalness: 0.72,
      roughness: 0.24,
    });

    const dialMeta = variantMeta[variant];
    const dialTex = createChevronsTexture(dialMeta.symbol, dialMeta.sub);
    dialTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const dialFaceMat = new THREE.MeshStandardMaterial({
      map: dialTex,
      roughness: 0.42,
      metalness: 0.35,
    });

    // 5. Composite Multi-Part Hero Assembly (THREE.Group)
    const rootAssembly = new THREE.Group();
    scene.add(rootAssembly);

    // Core Coin / Disc Assembly
    const coreGroup = new THREE.Group();
    rootAssembly.add(coreGroup);

    const obsidianDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.42, 0.18, 64),
      obsidianMat,
    );
    obsidianDisc.rotation.x = Math.PI / 2;
    obsidianDisc.castShadow = true;
    obsidianDisc.receiveShadow = true;

    const dialPlate = new THREE.Mesh(
      new THREE.CircleGeometry(1.36, 64),
      dialFaceMat,
    );
    dialPlate.position.z = 0.095;

    const backPlate = new THREE.Mesh(
      new THREE.CircleGeometry(1.36, 64),
      dialFaceMat,
    );
    backPlate.position.z = -0.095;
    backPlate.rotation.y = Math.PI;

    const outerBezel = new THREE.Mesh(
      new THREE.TorusGeometry(1.46, 0.065, 24, 80),
      brushedGoldMat,
    );
    outerBezel.castShadow = true;

    const innerStepBezel = new THREE.Mesh(
      new THREE.TorusGeometry(1.24, 0.022, 16, 72),
      creamGoldMat,
    );
    innerStepBezel.position.z = 0.1;

    coreGroup.add(obsidianDisc, dialPlate, backPlate, outerBezel, innerStepBezel);

    // Sculpted 3D Emblem mounted in front of the core
    const emblemSculpture = buildClubSculpture(
      variant,
      brushedGoldMat,
      creamGoldMat,
    );
    emblemSculpture.position.z = variant === 'hero' ? 0.06 : 0.02;
    coreGroup.add(emblemSculpture);

    // 6. Three Concentric Orbital Gyroscope Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.015, 12, 100),
      brushedGoldMat,
    );
    ring1.rotation.set(0.42, 0.35, 0);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.012, 12, 120),
      creamGoldMat,
    );
    ring2.rotation.set(-0.55, 0.4, 0.25);

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(2.85, 0.01, 10, 128),
      brushedGoldMat,
    );
    ring3.rotation.set(0.2, -0.6, 0.5);

    rootAssembly.add(ring1, ring2, ring3);

    // 7. Instanced Precision Tick Ring (72 markers)
    const tickCount = 72;
    const tickGeo = new THREE.BoxGeometry(0.018, 0.075, 0.018);
    const tickInstanced = new THREE.InstancedMesh(
      tickGeo,
      brushedGoldMat,
      tickCount,
    );
    for (let i = 0; i < tickCount; i++) {
      const a = (i / tickCount) * Math.PI * 2;
      const r = 1.78;
      _dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
      _dummy.rotation.set(0, 0, a - Math.PI / 2);
      const scale = i % 6 === 0 ? 1.55 : 0.8;
      _dummy.scale.set(1, scale, 1);
      _dummy.updateMatrix();
      tickInstanced.setMatrixAt(i, _dummy.matrix);
    }
    tickInstanced.instanceMatrix.needsUpdate = true;
    tickInstanced.computeBoundingSphere();
    rootAssembly.add(tickInstanced);

    // 8. Five Orbiting Club Satellite Nodes
    const satelliteGroup = new THREE.Group();
    rootAssembly.add(satelliteGroup);
    const satellites: THREE.Group[] = [];

    if (variant === 'hero') {
      const orbitalLogoGoldMat = new THREE.MeshPhysicalMaterial({
        color: 0xf0c75e,
        emissive: 0x3b2a06,
        emissiveIntensity: 0.42,
        metalness: 0.88,
        roughness: 0.2,
        clearcoat: 0.55,
        clearcoatRoughness: 0.16,
      });

      for (let i = 0; i < ORBITAL_CLUB_ORDER.length; i++) {
        const clubLogo = buildGoldenClubSatellite(
          ORBITAL_CLUB_ORDER[i],
          orbitalLogoGoldMat,
        );
        const angle = (i * Math.PI * 2) / 5;
        clubLogo.position.set(
          Math.cos(angle) * 2.18,
          Math.sin(angle) * 2.18 * 0.88,
          Math.sin(angle * 2) * 0.38 + 0.18,
        );
        satelliteGroup.add(clubLogo);
        satellites.push(clubLogo);
      }
    } else {
      const satGeo = new THREE.OctahedronGeometry(0.095, 0);
      const satRingGeo = new THREE.TorusGeometry(0.14, 0.012, 10, 24);

      for (let i = 0; i < 5; i++) {
        const sat = new THREE.Group();
        const gem = new THREE.Mesh(
          satGeo,
          i % 2 === 0 ? brushedGoldMat : creamGoldMat,
        );
        const halo = new THREE.Mesh(satRingGeo, brushedGoldMat);
        halo.rotation.x = Math.PI / 2.4;
        sat.add(gem, halo);
        const baseRadius = 2.05 + (i % 3) * 0.4;
        const angle = (i * Math.PI * 2) / 5;
        sat.position.set(
          Math.cos(angle) * baseRadius,
          Math.sin(angle) * baseRadius * 0.72,
          Math.sin(angle * 2) * 0.65,
        );
        satelliteGroup.add(sat);
        satellites.push(sat);
      }
    }

    // 9. Ambient 3D Geometric Dust Field (InstancedMesh, 84 motes)
    const moteCount = 84;
    const moteGeo = new THREE.OctahedronGeometry(0.025, 0);
    const moteMat = new THREE.MeshStandardMaterial({
      color: 0xdab24c,
      roughness: 0.35,
      metalness: 0.7,
    });
    const motes = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
    const moteSeeds = new Float32Array(moteCount * 4);
    for (let i = 0; i < moteCount; i++) {
      const radius = 2.6 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4.4;
      const speed = 0.25 + Math.random() * 0.45;
      moteSeeds[i * 4] = radius;
      moteSeeds[i * 4 + 1] = theta;
      moteSeeds[i * 4 + 2] = y;
      moteSeeds[i * 4 + 3] = speed;

      _dummy.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius - 1.2);
      _dummy.scale.setScalar(0.6 + Math.random() * 0.9);
      _dummy.updateMatrix();
      motes.setMatrixAt(i, _dummy.matrix);
      _targetColor.setHex(i % 3 === 0 ? 0xf8ecab : 0xdab24c);
      motes.setColorAt(i, _targetColor);
    }
    motes.instanceMatrix.needsUpdate = true;
    if (motes.instanceColor) motes.instanceColor.needsUpdate = true;
    motes.frustumCulled = false;
    scene.add(motes);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Pointer Drag / Hover Parallax State
    let pointerX = 0;
    let pointerY = 0;
    let dragOffsetY = 0;
    let dragOffsetX = 0;
    let isDragging = false;
    let lastClientX = 0;
    let lastClientY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      }
      if (isDragging) {
        const dx = e.clientX - lastClientX;
        const dy = e.clientY - lastClientY;
        dragOffsetY += dx * 0.008;
        dragOffsetX = THREE.MathUtils.clamp(dragOffsetX + dy * 0.006, -0.7, 0.7);
        lastClientX = e.clientX;
        lastClientY = e.clientY;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    // ResizeObserver for crisp responsiveness
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(100, entry.contentRect.width);
        const h = Math.max(100, entry.contentRect.height);
        camera.aspect = w / h;
        camera.position.z = computeCameraZ(camera.aspect);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    // WebGL Context loss listeners
    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    const onContextRestored = () => {
      renderer.render(scene, camera);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // 11. Animation Loop (rAF on GPU, afterDraw fence pacing on software WebGL)
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    let currentRotX = 0;
    let currentRotY = 0;
    let currentScrollTilt = 0;

    function tick() {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const scroll = scrollMetricsRef.current;
      const scrollInfluence = THREE.MathUtils.clamp(scroll.scrollY * 0.0018, 0, 1.4);
      const velInfluence = THREE.MathUtils.clamp(scroll.velocity * 0.015, -0.5, 0.5);

      if (!prefersReducedMotion) {
        const targetRotY = pointerX * 0.32 + dragOffsetY + Math.sin(elapsed * 0.35) * 0.14;
        const targetRotX = -pointerY * 0.22 + dragOffsetX + velInfluence * 0.35;

        currentRotY = THREE.MathUtils.damp(currentRotY, targetRotY, 4.5, dt);
        currentRotX = THREE.MathUtils.damp(currentRotX, targetRotX, 4.5, dt);
        currentScrollTilt = THREE.MathUtils.damp(
          currentScrollTilt,
          scrollInfluence,
          5.0,
          dt,
        );

        rootAssembly.rotation.y = currentRotY;
        rootAssembly.rotation.x = currentRotX + currentScrollTilt * 0.35;
        rootAssembly.position.y = Math.sin(elapsed * 1.1) * 0.07 - currentScrollTilt * 0.35;

        // Gentle core breathing
        coreGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.12;

        // Concentric gyroscope orbital spins
        ring1.rotation.z = elapsed * 0.22;
        ring1.rotation.x = 0.42 + currentScrollTilt * 0.4;
        ring2.rotation.z = -elapsed * 0.16;
        ring2.rotation.y = 0.4 + Math.cos(elapsed * 0.28) * 0.15;
        ring3.rotation.z = elapsed * 0.11;
        tickInstanced.rotation.z = -elapsed * 0.08;

        // 5 club satellites orbiting around the core
        for (let i = 0; i < satellites.length; i++) {
          const sat = satellites[i];
          if (variant === 'hero') {
            const orbitRadius = 2.18;
            const angle = elapsed * 0.34 + (i * Math.PI * 2) / 5;
            sat.position.set(
              Math.cos(angle) * orbitRadius,
              Math.sin(angle) * orbitRadius * 0.88,
              Math.sin(angle * 2) * 0.38 + 0.18,
            );
            sat.rotation.y = Math.sin(elapsed * 1.1 + i * 1.3) * 0.36;
            sat.rotation.x = Math.cos(elapsed * 0.9 + i * 1.1) * 0.16;
            sat.rotation.z = Math.sin(elapsed * 0.7 + i) * 0.06;
          } else {
            const baseRadius = 2.05 + (i % 3) * 0.4;
            const angle = elapsed * (0.38 + i * 0.06) + (i * Math.PI * 2) / 5;
            sat.position.set(
              Math.cos(angle) * baseRadius,
              Math.sin(angle) * baseRadius * 0.72,
              Math.sin(angle * 2) * 0.65,
            );
            sat.rotation.y = elapsed * 1.4;
            sat.rotation.x = elapsed * 0.9;
          }
        }

        // Ambient particles drift
        for (let i = 0; i < moteCount; i++) {
          const radius = moteSeeds[i * 4];
          const theta = moteSeeds[i * 4 + 1] + elapsed * 0.06 * moteSeeds[i * 4 + 3];
          const y =
            moteSeeds[i * 4 + 2] + Math.sin(elapsed * 0.7 + i) * 0.18;
          _dummy.position.set(
            Math.cos(theta) * radius,
            y,
            Math.sin(theta) * radius - 1.2,
          );
          _dummy.rotation.set(elapsed * 0.5 + i, elapsed * 0.4, 0);
          _dummy.scale.setScalar(0.75 + Math.sin(elapsed * 1.5 + i) * 0.25);
          _dummy.updateMatrix();
          motes.setMatrixAt(i, _dummy.matrix);
        }
        motes.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) return;
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      ro.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        onContextRestored,
      );

      // Dispose all GPU resources
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else {
            m.material.dispose();
          }
        }
      });
      dialTex.dispose();
      scene.environment?.dispose();
      renderer.dispose();
    };
  }, [variant, scrollMetricsRef]);

  if (webglFailed) {
    return (
      <div
        className={`relative flex items-center justify-center rounded-full border border-[#DAB24C]/25 bg-[#11110E] ${className}`}
      >
        <div className="flex h-64 w-64 flex-col items-center justify-center rounded-full border-2 border-[#DAB24C] bg-[#0B0B09] text-center shadow-2xl">
          <span className="font-display text-5xl font-bold text-[#DAB24C]">
            {variantMeta[variant].symbol}
          </span>
          <span className="mt-2 font-mono text-xs tracking-widest text-[#F8ECAB]">
            {variantMeta[variant].sub}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative select-none ${className}`}>
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        aria-label={`Interactive 3D ${variantMeta[variant].sub} orbital model`}
      />
      {interactiveHint && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.18em] text-[#9E967C] uppercase whitespace-nowrap">
          Drag to orbit · Scroll reactive
        </div>
      )}
    </div>
  );
}
