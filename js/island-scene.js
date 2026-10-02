// About Section: 3D Floating Island Scene
// ==================== 3D FLOATING ISLAND SCENE ====================
(function initIsland() {
  const islandCv = document.getElementById('c-island');
  if (!islandCv) return;

  const islandR = new THREE.WebGLRenderer({
    canvas: islandCv,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  islandR.setPixelRatio(Math.min(devicePixelRatio, 2));
  islandR.shadowMap.enabled = true;
  islandR.shadowMap.type = THREE.PCFSoftShadowMap;
  islandR.toneMapping = THREE.ACESFilmicToneMapping;
  islandR.toneMappingExposure = 1.25;
  islandR.setClearColor(0x000000, 0);

  const islandS = new THREE.Scene();
  const islandCam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  islandCam.position.set(0, 1.4, 12.8);
  islandCam.lookAt(0, 0, 0);

  // Sunset studio lighting
  const islSun = new THREE.DirectionalLight(0xffbe76, 1.7);
  islSun.position.set(7, 10, 6);
  islSun.castShadow = true;
  islSun.shadow.mapSize.width = 1024;
  islSun.shadow.mapSize.height = 1024;
  islSun.shadow.camera.near = 1;
  islSun.shadow.camera.far = 30;
  islSun.shadow.camera.left = -6;
  islSun.shadow.camera.right = 6;
  islSun.shadow.camera.top = 6;
  islSun.shadow.camera.bottom = -6;
  islSun.shadow.bias = -0.001;
  islandS.add(islSun);

  islandS.add(new THREE.HemisphereLight(0xc4b5fd, 0x22163b, 0.85));

  const islBackLight = new THREE.DirectionalLight(0xf472b6, 0.95);
  islBackLight.position.set(-6, 3, -7);
  islandS.add(islBackLight);

  const islWaterLight = new THREE.PointLight(0x38bdf8, 2.2, 8, 1.2);
  islWaterLight.position.set(-0.2, 0.4, 2.2);
  islandS.add(islWaterLight);

  const islandPivot = new THREE.Group();
  islandS.add(islandPivot);
  const islandGroup = new THREE.Group();
  islandPivot.add(islandGroup);

  // Waterfall procedural animated texture
  const waterTexCanvas = document.createElement('canvas');
  waterTexCanvas.width = 256;
  waterTexCanvas.height = 512;
  const wCtx = waterTexCanvas.getContext('2d');
  function updateWaterTexture(offset) {
    wCtx.fillStyle = '#0284c7';
    wCtx.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 28; i++) {
      const x = (i * 9.5) % 256;
      const w = 4 + (i % 4) * 2;
      wCtx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.75)' : 'rgba(255, 255, 255, 0.9)';
      const yStart = ((i * 37) + offset) % 512;
      wCtx.fillRect(x, yStart, w, 85 + (i % 4) * 45);
      if (yStart + 130 > 512) {
        wCtx.fillRect(x, yStart - 512, w, 85 + (i % 4) * 45);
      }
    }
  }
  updateWaterTexture(0);
  const waterTex = new THREE.CanvasTexture(waterTexCanvas);
  waterTex.wrapS = THREE.RepeatWrapping;
  waterTex.wrapT = THREE.RepeatWrapping;

  // 1. Floating Craggy Rock Cone (Underside)
  const rockGeo = new THREE.ConeGeometry(3.6, 3.8, 18, 8);
  rockGeo.rotateX(Math.PI);
  const rPos = rockGeo.attributes.position;
  for (let i = 0; i < rPos.count; i++) {
    const y = rPos.getY(i);
    const x = rPos.getX(i);
    const z = rPos.getZ(i);
    if (y < 1.8) {
      const angle = Math.atan2(z, x);
      const noise = Math.sin(y * 4.2 + angle * 3) * 0.18 + Math.cos(angle * 6) * 0.12 + Math.sin(y * 9) * 0.07;
      rPos.setX(i, x * (1 + noise));
      rPos.setZ(i, z * (1 + noise));
      if (Math.abs(Math.sin(angle * 2.5)) < 0.28) {
        rPos.setX(i, rPos.getX(i) * 0.88);
        rPos.setZ(i, rPos.getZ(i) * 0.88);
      }
      if (y < -1.2) {
        rPos.setX(i, rPos.getX(i) + 0.15);
        rPos.setZ(i, rPos.getZ(i) - 0.1);
      }
    }
  }
  rockGeo.computeVertexNormals();
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x2e2a3c,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true
  });
  const rockMesh = new THREE.Mesh(rockGeo, rockMat);
  rockMesh.position.y = -0.15;
  rockMesh.castShadow = true;
  rockMesh.receiveShadow = true;
  islandGroup.add(rockMesh);

  // 2. Grass Top Plateau
  const grassGeo = new THREE.CylinderGeometry(3.7, 3.5, 0.45, 24);
  const gPos = grassGeo.attributes.position;
  for (let i = 0; i < gPos.count; i++) {
    const y = gPos.getY(i);
    if (y > 0.05) {
      const x = gPos.getX(i);
      const z = gPos.getZ(i);
      let dY = Math.sin(x * 1.1) * 0.14 + Math.cos(z * 1.3) * 0.1;
      const distToRiver = Math.abs(x + 0.2 - z * 0.3);
      if (distToRiver < 0.8 && z > -1.5) {
        dY -= 0.18 * (1 - distToRiver / 0.8);
      }
      gPos.setY(i, y + dY);
    }
  }
  grassGeo.computeVertexNormals();
  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x217d35,
    roughness: 0.82,
    flatShading: true
  });
  const grassMesh = new THREE.Mesh(grassGeo, grassMat);
  grassMesh.position.y = 1.72;
  grassMesh.receiveShadow = true;
  grassMesh.castShadow = true;
  islandGroup.add(grassMesh);

  // 3. Mountain Peaks (Tall crags catching warm sunset light)
  const mtnMat1 = new THREE.MeshStandardMaterial({ color: 0x56536b, roughness: 0.85, flatShading: true });
  const mtnMat2 = new THREE.MeshStandardMaterial({ color: 0x4a475d, roughness: 0.88, flatShading: true });

  const p1Geo = new THREE.ConeGeometry(1.5, 2.8, 6);
  p1Geo.computeVertexNormals();
  const mtn1 = new THREE.Mesh(p1Geo, mtnMat1);
  mtn1.position.set(0.3, 3.0, -0.7);
  mtn1.rotation.y = 0.5;
  mtn1.castShadow = true;
  mtn1.receiveShadow = true;
  islandGroup.add(mtn1);

  const p2Geo = new THREE.ConeGeometry(1.2, 2.2, 5);
  p2Geo.computeVertexNormals();
  const mtn2 = new THREE.Mesh(p2Geo, mtnMat2);
  mtn2.position.set(-0.9, 2.7, -1.0);
  mtn2.rotation.y = -0.4;
  mtn2.castShadow = true;
  mtn2.receiveShadow = true;
  islandGroup.add(mtn2);

  const p3Geo = new THREE.ConeGeometry(0.85, 1.5, 5);
  p3Geo.computeVertexNormals();
  const mtn3 = new THREE.Mesh(p3Geo, mtnMat1);
  mtn3.position.set(1.5, 2.3, 0.4);
  mtn3.rotation.y = 0.8;
  mtn3.castShadow = true;
  mtn3.receiveShadow = true;
  islandGroup.add(mtn3);

  // 4. Moss Mounds
  const mossMats = [
    new THREE.MeshStandardMaterial({ color: 0x165c26, roughness: 0.8, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x238234, roughness: 0.8, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x349e47, roughness: 0.75, flatShading: true })
  ];
  const mossPositions = [
    [-1.4, 1.95, 1.2, 0.65, 0.35, 0.65, 1],
    [-0.7, 1.9, 1.5, 0.5, 0.3, 0.5, 2],
    [0.8, 1.9, 1.3, 0.6, 0.35, 0.6, 0],
    [1.7, 1.92, 1.1, 0.55, 0.3, 0.55, 1],
    [-2.2, 1.9, 0.4, 0.75, 0.4, 0.75, 0],
    [-2.0, 1.95, -0.8, 0.65, 0.35, 0.65, 1],
    [2.2, 1.9, -0.6, 0.6, 0.35, 0.6, 2],
    [-0.2, 2.1, -0.2, 0.5, 0.3, 0.5, 1],
    [1.0, 2.05, -0.1, 0.55, 0.35, 0.55, 0],
    [-0.1, 1.85, 1.7, 0.4, 0.22, 0.4, 2],
    [0.5, 1.85, 1.8, 0.38, 0.2, 0.38, 1]
  ];
  mossPositions.forEach(([x, y, z, sx, sy, sz, mi]) => {
    const mGeo = new THREE.DodecahedronGeometry(1, 1);
    const mMesh = new THREE.Mesh(mGeo, mossMats[mi]);
    mMesh.position.set(x, y, z);
    mMesh.scale.set(sx, sy, sz);
    mMesh.castShadow = true;
    mMesh.receiveShadow = true;
    islandGroup.add(mMesh);
  });

  // 5. Trees (Magnificent Big Bonsai Tree on Left, Acacia on Right)
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x361f12, roughness: 0.9, flatShading: true });
  const folMats = [
    new THREE.MeshStandardMaterial({ color: 0x165b26, roughness: 0.72, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x1f7a33, roughness: 0.72, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x2a963e, roughness: 0.68, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x3cae53, roughness: 0.68, flatShading: true })
  ];

  // Tree 1 (Left Main Tree)
  const t1Group = new THREE.Group();
  t1Group.position.set(-1.4, 1.85, 0.2);
  t1Group.scale.set(1.18, 1.18, 1.18);

  const tr1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, 1.2, 7), trunkMat);
  tr1.position.set(0, 0.55, 0);
  tr1.rotation.z = -0.18;
  tr1.castShadow = true;
  t1Group.add(tr1);

  const tr2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 1.05, 7), trunkMat);
  tr2.position.set(-0.18, 1.5, 0);
  tr2.rotation.z = -0.25;
  tr2.castShadow = true;
  t1Group.add(tr2);

  const br1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 0.9, 6), trunkMat);
  br1.position.set(0.18, 1.75, 0.1);
  br1.rotation.z = -0.72;
  br1.castShadow = true;
  t1Group.add(br1);

  const tree1Foliage = [
    [-0.4, 2.3, 0, 1.2, 0],
    [-1.0, 2.15, 0.25, 1.0, 1],
    [0.3, 2.1, -0.1, 0.95, 2],
    [-0.35, 2.85, 0.1, 1.1, 3],
    [-0.9, 2.75, -0.2, 0.9, 1],
    [0.45, 2.05, 0.35, 0.8, 2],
    [-0.1, 2.5, 0.55, 0.85, 3],
    [-0.65, 2.6, 0.45, 0.9, 0],
    [-0.05, 2.95, 0.05, 0.95, 2],
    [-0.6, 2.05, -0.3, 0.9, 0],
    [0.1, 2.7, 0.2, 0.85, 3]
  ];
  tree1Foliage.forEach(([fx, fy, fz, fr, mi]) => {
    const fGeo = new THREE.DodecahedronGeometry(fr, 1);
    const fMesh = new THREE.Mesh(fGeo, folMats[mi]);
    fMesh.position.set(fx, fy, fz);
    fMesh.scale.set(1.12, 0.88, 1.0);
    fMesh.castShadow = true;
    fMesh.receiveShadow = true;
    t1Group.add(fMesh);
  });
  islandGroup.add(t1Group);

  // Tree 2 (Right Secondary Tree - Golden Lime)
  const folMats2 = [
    new THREE.MeshStandardMaterial({ color: 0x267a2c, roughness: 0.72, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x3b9435, roughness: 0.72, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x54af40, roughness: 0.68, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x6ec44f, roughness: 0.68, flatShading: true })
  ];

  const t2Group = new THREE.Group();
  t2Group.position.set(1.4, 1.85, -0.3);
  t2Group.scale.set(1.06, 1.06, 1.06);

  const tr2_1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 1.25, 6), trunkMat);
  tr2_1.position.set(0, 0.6, 0);
  tr2_1.rotation.z = 0.14;
  tr2_1.castShadow = true;
  t2Group.add(tr2_1);

  const tree2Foliage = [
    [0.1, 1.5, 0, 0.95, 2],
    [-0.35, 1.45, 0.2, 0.8, 1],
    [0.45, 1.45, -0.15, 0.8, 3],
    [0.0, 1.95, 0.1, 0.9, 3],
    [0.25, 1.75, 0.35, 0.7, 2],
    [-0.15, 2.2, -0.05, 0.75, 3],
    [0.35, 2.0, 0.15, 0.65, 2]
  ];
  tree2Foliage.forEach(([fx, fy, fz, fr, mi]) => {
    const fGeo = new THREE.DodecahedronGeometry(fr, 1);
    const fMesh = new THREE.Mesh(fGeo, folMats2[mi]);
    fMesh.position.set(fx, fy, fz);
    fMesh.scale.set(1.1, 0.85, 1.0);
    fMesh.castShadow = true;
    fMesh.receiveShadow = true;
    t2Group.add(fMesh);
  });
  islandGroup.add(t2Group);

  // 6. Waterfall & Rivers
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 0.6,
    map: waterTex,
    roughness: 0.08,
    metalness: 0.15,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide
  });

  const riverShape = new THREE.Shape();
  riverShape.moveTo(-0.7, 2.0);
  riverShape.bezierCurveTo(-0.6, 1.0, -0.25, 0.2, 0.1, -0.8);
  riverShape.lineTo(0.65, -0.8);
  riverShape.bezierCurveTo(0.3, 0.2, -0.05, 1.0, -0.1, 2.0);
  riverShape.closePath();
  const riverGeo = new THREE.ShapeGeometry(riverShape);
  riverGeo.rotateX(-Math.PI / 2);
  const riverMesh = new THREE.Mesh(riverGeo, waterMat);
  riverMesh.position.set(0, 1.86, 0);
  islandGroup.add(riverMesh);

  // Main Waterfall (Wide and Cascading)
  const wfGeo = new THREE.PlaneGeometry(1.25, 3.5, 10, 16);
  const wfPos = wfGeo.attributes.position;
  for (let i = 0; i < wfPos.count; i++) {
    const y = wfPos.getY(i);
    if (y > 1.2) {
      wfPos.setZ(i, Math.sin((y - 1.2) * 2.5) * 0.2);
    } else {
      wfPos.setZ(i, Math.sin(y * 2) * 0.06);
    }
  }
  wfGeo.computeVertexNormals();
  const mainWf = new THREE.Mesh(wfGeo, waterMat);
  mainWf.position.set(-0.35, 0.05, 2.08);
  islandGroup.add(mainWf);

  // Secondary Waterfall
  const wf2Geo = new THREE.PlaneGeometry(0.48, 2.8, 6, 12);
  const secondWf = new THREE.Mesh(wf2Geo, waterMat);
  secondWf.position.set(1.25, 0.35, 1.72);
  secondWf.rotation.y = 0.3;
  islandGroup.add(secondWf);

  // White foam crest & edges
  const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const foam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.3, 8), foamMat);
  foam1.rotation.z = Math.PI / 2;
  foam1.position.set(-0.35, 1.82, 1.98);
  islandGroup.add(foam1);

  const foamEdgeGeo = new THREE.PlaneGeometry(0.09, 3.4, 2, 8);
  const foamL = new THREE.Mesh(foamEdgeGeo, foamMat);
  foamL.position.set(-0.97, 0.05, 2.1);
  islandGroup.add(foamL);
  const foamR = new THREE.Mesh(foamEdgeGeo, foamMat);
  foamR.position.set(0.27, 0.05, 2.1);
  islandGroup.add(foamR);

  // 7. Base Clouds (Fluffy and Dense)
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    metalness: 0.02
  });
  const cloudGroup = new THREE.Group();
  const cloudSpheres = [
    [-1.6, -1.9, 0.8, 0.85],
    [-1.1, -2.1, 1.4, 0.75],
    [-0.4, -2.2, 1.6, 0.8],
    [0.3, -2.1, 1.5, 0.75],
    [1.0, -2.0, 1.1, 0.8],
    [1.5, -2.1, 0.5, 0.75],
    [1.7, -2.0, -0.3, 0.8],
    [1.3, -2.2, -1.0, 0.7],
    [0.6, -2.3, -1.5, 0.85],
    [-0.2, -2.2, -1.6, 0.8],
    [-1.0, -2.1, -1.3, 0.75],
    [-1.6, -2.0, -0.6, 0.8],
    [-1.8, -2.1, 0.1, 0.75],
    // Inner ring / lower puffs
    [-0.8, -2.4, 0.6, 0.7],
    [0.0, -2.5, 0.9, 0.75],
    [0.8, -2.4, 0.5, 0.7],
    [-0.5, -2.6, -0.4, 0.65],
    [0.4, -2.5, -0.5, 0.7],
    [-1.3, -2.3, 1.1, 0.65],
    [0.0, -1.8, 1.8, 0.65],
    [-0.5, -1.75, 1.9, 0.6],
    [0.5, -1.8, 1.7, 0.6],
    // Extra fluffy outer puffs
    [-1.9, -2.2, 0.5, 0.7],
    [1.8, -2.2, 0.1, 0.7],
    [0.0, -2.7, 0.3, 0.75],
    [-0.7, -2.6, -0.8, 0.65]
  ];
  cloudSpheres.forEach(([cx, cy, cz, cr]) => {
    const cMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(cr, 2), cloudMat);
    cMesh.position.set(cx, cy, cz);
    cMesh.scale.set(1.15, 0.85, 1.1);
    cMesh.receiveShadow = true;
    cloudGroup.add(cMesh);
  });
  islandGroup.add(cloudGroup);

  // Auto-center islandGroup at origin so it rotates and sits on true visual center
  islandGroup.updateMatrixWorld(true);
  const islandBox = new THREE.Box3().setFromObject(islandGroup);
  const islandCenter = islandBox.getCenter(new THREE.Vector3());
  islandGroup.position.set(-islandCenter.x, -islandCenter.y, -islandCenter.z);

  // Drag and Pointer interaction
  const card = islandCv.closest('.about-3d-wrapper') || islandCv.parentElement;
  let isDrag = false;
  let px = 0, py = 0;
  let targetRotY = 0.28, targetRotX = -0.22;
  let curRotY = 0.28, curRotX = -0.22;
  let hoverY = 0, hoverX = 0;

  if (card) {
    card.addEventListener('pointerdown', e => {
      isDrag = true;
      px = e.clientX;
      py = e.clientY;
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', e => {
      if (isDrag) {
        const dx = e.clientX - px;
        const dy = e.clientY - py;
        targetRotY += dx * 0.008;
        targetRotX = Math.max(-0.4, Math.min(0.55, targetRotX + dy * 0.006));
        px = e.clientX;
        py = e.clientY;
      } else {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        hoverY = nx * 0.35;
        hoverX = ny * 0.2;
      }
    });
    const stopDrag = e => {
      if (isDrag) {
        isDrag = false;
        try { card.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    card.addEventListener('pointerup', stopDrag);
    card.addEventListener('pointercancel', stopDrag);
    card.addEventListener('pointerleave', () => {
      hoverY = 0;
      hoverX = 0;
    });
  }

  function resizeIsland() {
    const wrap = islandCv.closest('.about-3d-wrapper') || islandCv.parentElement;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w === 0 || h === 0) return;
    islandR.setSize(w, h, false);
    const aspect = w / h;
    islandCam.aspect = aspect;

    // Full model fit, tight and large with safe clearance
    const fitRadius = 4.65;
    const dist = 12.8;
    const fovV = (2 * Math.atan(fitRadius / dist) * 180) / Math.PI;
    const fovH = (2 * Math.atan((fitRadius / dist) / aspect) * 180) / Math.PI;
    islandCam.fov = Math.max(fovV, fovH);
    islandCam.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeIsland);
  resizeIsland();

  let islandVis = true;
  new IntersectionObserver(entries => {
    islandVis = entries[0].isIntersecting;
  }).observe(islandCv);

  let waterOffset = 0;
  function loopIsland(t) {
    t *= 0.001;

    waterOffset = (waterOffset + 4.5) % 512;
    updateWaterTexture(waterOffset);
    waterTex.needsUpdate = true;

    islandPivot.position.y = Math.sin(t * 1.3) * 0.12;
    cloudGroup.position.y = Math.sin(t * 1.7) * 0.04;

    const destY = targetRotY + hoverY + (isDrag ? 0 : Math.sin(t * 0.45) * 0.08);
    const destX = targetRotX + hoverX + (isDrag ? 0 : Math.cos(t * 0.35) * 0.03);
    curRotY += (destY - curRotY) * 0.08;
    curRotX += (destX - curRotX) * 0.08;
    islandPivot.rotation.y = curRotY;
    islandPivot.rotation.x = curRotX;

    if (islandVis) {
      islandR.render(islandS, islandCam);
    }
    requestAnimationFrame(loopIsland);
  }
  requestAnimationFrame(loopIsland);
})();
