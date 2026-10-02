// Contact Section: 3D Isometric App Flow Scene
// 3D Isometric App Flow & Contact Scene
(() => {
  const cv = document.getElementById('c-contact');
  if (!cv) return;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(22, 1, 0.1, 100);
  cam.position.set(13.2, 13.2, 13.2);
  cam.lookAt(0, 0.35, 0);

  // Studio Lighting
  scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x1e1b4b, 1.25));

  const sun = new THREE.DirectionalLight(0xffffff, 1.3);
  sun.position.set(16, 26, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 50;
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  // Soft cyan fill light
  const cyanFill = new THREE.DirectionalLight(0x38bdf8, 0.7);
  cyanFill.position.set(-15, 12, -15);
  scene.add(cyanFill);

  // Warm glowing point light from the lightbulb
  const bulbLight = new THREE.PointLight(0xffd53d, 4.2, 8, 1.2);
  bulbLight.position.set(-0.9, 1.7, 1.25);
  scene.add(bulbLight);

  // Vibrant orange thruster light from the rocket
  const rocketLight = new THREE.PointLight(0xff6a00, 4.0, 7, 1.2);
  rocketLight.position.set(-0.9, 0.7, 4.35);
  scene.add(rocketLight);

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Rounded rectangle helper
  function createRoundedRectShape(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e2238,
    roughness: 0.42,
    metalness: 0.15
  });

  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.38,
    metalness: 0.05,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.24
  });

  const whiteTileMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.05
  });

  const blueTileMat = new THREE.MeshStandardMaterial({
    color: 0xbfdbfe,
    roughness: 0.32,
    metalness: 0.1
  });

  // Helper: create a phone
  function createPhone(x, y, z) {
    const pGroup = new THREE.Group();
    pGroup.position.set(x, y, z);

    // Chassis (length 6.0 along X, width 3.3 along Z)
    const cShape = createRoundedRectShape(6.0, 3.3, 0.5);
    const cGeo = new THREE.ExtrudeGeometry(cShape, { depth: 0.34, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 });
    cGeo.center();
    const chassis = new THREE.Mesh(cGeo, chassisMat);
    chassis.rotation.x = Math.PI / 2;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    pGroup.add(chassis);

    // Screen (length 5.5 along X, width 2.9 along Z)
    const sShape = createRoundedRectShape(5.5, 2.9, 0.4);
    const sGeo = new THREE.ExtrudeGeometry(sShape, { depth: 0.03, bevelEnabled: false });
    sGeo.center();
    const screen = new THREE.Mesh(sGeo, screenMat);
    screen.rotation.x = Math.PI / 2;
    screen.position.y = 0.22;
    screen.receiveShadow = true;
    pGroup.add(screen);

    // Notch on the top short edge (at -X)
    const nGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.65, 12);
    const nMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const notch = new THREE.Mesh(nGeo, nMat);
    notch.position.set(-2.55, 0.25, 0);
    pGroup.add(notch);

    mainGroup.add(pGroup);
    return pGroup;
  }

  // Create 3 Phones along diagonal workflow (-Z is up-right in isometric)
  const phone1 = createPhone(0.0, -0.9, 4.0);
  const phone2 = createPhone(0.0, 0.35, 0.0);
  const phone3 = createPhone(0.0, 1.6, -4.0);

  // Helper: Rounded square tile
  function createTileMesh(w, h, depth, radius, mat) {
    const s = createRoundedRectShape(w, h, radius);
    const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.03, bevelThickness: 0.03 });
    g.center();
    const m = new THREE.Mesh(g, mat);
    m.rotation.x = Math.PI / 2;
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }

  // PHONE 1 (Foreground: Launchpad, Rocket, "UI" Tile)
  // "MOBILE APP" text on screen via canvas texture
  const headerTexCv = document.createElement('canvas');
  headerTexCv.width = 256;
  headerTexCv.height = 64;
  const hCtx = headerTexCv.getContext('2d');
  hCtx.fillStyle = '#93c5fd';
  hCtx.font = 'bold 22px system-ui, sans-serif';
  hCtx.textAlign = 'center';
  hCtx.textBaseline = 'middle';
  hCtx.fillText('MOBILE APP', 128, 32);
  const hTex = new THREE.CanvasTexture(headerTexCv);
  const hTextMat = new THREE.MeshBasicMaterial({ map: hTex, transparent: true });
  const hTextPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), hTextMat);
  hTextPlane.rotation.x = -Math.PI / 2;
  hTextPlane.position.set(-2.1, 0.26, 0.55);
  phone1.add(hTextPlane);

  // UI Tile (Bottom right on Phone 1)
  const uiCard = createTileMesh(1.3, 1.3, 0.22, 0.3, blueTileMat);
  uiCard.position.set(1.3, 0.36, -0.3);
  phone1.add(uiCard);

  // "UI" text texture on the card
  const uiTexCv = document.createElement('canvas');
  uiTexCv.width = 128;
  uiTexCv.height = 128;
  const uiCtx = uiTexCv.getContext('2d');
  uiCtx.fillStyle = '#1e3a8a';
  uiCtx.font = '800 68px system-ui, sans-serif';
  uiCtx.textAlign = 'center';
  uiCtx.textBaseline = 'middle';
  uiCtx.fillText('UI', 64, 64);
  const uiTex = new THREE.CanvasTexture(uiTexCv);
  const uiTextMat = new THREE.MeshBasicMaterial({ map: uiTex, transparent: true });
  const uiTextPlane = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.85), uiTextMat);
  uiTextPlane.rotation.x = -Math.PI / 2;
  uiTextPlane.position.set(1.3, 0.5, -0.3);
  phone1.add(uiTextPlane);

  // Launchpad Tile under Rocket
  const launchpad = createTileMesh(1.35, 1.35, 0.2, 0.3, blueTileMat);
  launchpad.position.set(-0.9, 0.34, 0.35);
  phone1.add(launchpad);

  // 3D ROCKET MODEL
  const rocketGroup = new THREE.Group();
  rocketGroup.position.set(-0.9, 1.45, 0.35);
  phone1.add(rocketGroup);

  // Fuselage Body
  const bodyGeo = new THREE.CylinderGeometry(0.36, 0.42, 1.25, 20);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.08 });
  const rocketBody = new THREE.Mesh(bodyGeo, bodyMat);
  rocketBody.position.y = 0.55;
  rocketBody.castShadow = true;
  rocketGroup.add(rocketBody);

  // Nose Cone (Red)
  const coneGeo = new THREE.ConeGeometry(0.36, 0.95, 20);
  const redMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 });
  const noseCone = new THREE.Mesh(coneGeo, redMat);
  noseCone.position.y = 1.65;
  noseCone.castShadow = true;
  rocketGroup.add(noseCone);

  // Cyan Visor ring
  const visorGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.14, 20);
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.6 });
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.y = 0.82;
  rocketGroup.add(visor);

  // Rocket Fins (4 Swept Fins)
  for (let i = 0; i < 4; i++) {
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.35, -0.3);
    finShape.lineTo(0.35, 0.35);
    finShape.lineTo(0, 0.55);
    finShape.closePath();
    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: false });
    finGeo.center();
    const fin = new THREE.Mesh(finGeo, redMat);
    fin.rotation.y = (i * Math.PI) / 2;
    fin.position.y = 0.3;
    fin.translateOnAxis(new THREE.Vector3(1, 0, 0), 0.40);
    fin.castShadow = true;
    rocketGroup.add(fin);
  }

  // Rocket Thruster Nozzle
  const nozzleGeo = new THREE.CylinderGeometry(0.22, 0.30, 0.2, 16);
  const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
  nozzle.position.y = -0.12;
  rocketGroup.add(nozzle);

  // Exhaust Flames (Animated)
  const flameOuterGeo = new THREE.ConeGeometry(0.32, 1.1, 14);
  const flameOuterMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0xf97316,
    emissiveIntensity: 1.8,
    transparent: true,
    opacity: 0.92
  });
  const flameOuter = new THREE.Mesh(flameOuterGeo, flameOuterMat);
  flameOuter.rotation.x = Math.PI;
  flameOuter.position.y = -0.7;
  rocketGroup.add(flameOuter);

  const flameInnerGeo = new THREE.ConeGeometry(0.17, 0.75, 14);
  const flameInnerMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 2.2
  });
  const flameInner = new THREE.Mesh(flameInnerGeo, flameInnerMat);
  flameInner.rotation.x = Math.PI;
  flameInner.position.y = -0.55;
  rocketGroup.add(flameInner);

  // Side floating card off phone 1
  const sideCard1 = createTileMesh(1.1, 1.1, 0.16, 0.25, new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.88 }));
  sideCard1.position.set(1.9, -0.4, 2.6);
  sideCard1.rotation.y = -0.15;
  mainGroup.add(sideCard1);

  // PHONE 2 (Center: Lightbulb, Green Switch, Password tile)
  // Search bar
  const searchBar2 = createTileMesh(1.8, 0.48, 0.08, 0.24, whiteTileMat);
  searchBar2.position.set(-1.8, 0.28, 0);
  phone2.add(searchBar2);

  // Green Switch button
  const greenBtn = createTileMesh(0.75, 0.75, 0.2, 0.22, new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.25, emissive: 0x16a34a, emissiveIntensity: 0.2 }));
  greenBtn.position.set(-0.35, 0.35, 0);
  phone2.add(greenBtn);

  // Password / Verification card with 3 asterisks
  const pwdCard = createTileMesh(1.7, 1.25, 0.2, 0.28, blueTileMat);
  pwdCard.position.set(1.3, 0.35, 0);
  phone2.add(pwdCard);

  // 3 Asterisks on pwdCard
  for (let i = 0; i < 3; i++) {
    const astGroup = new THREE.Group();
    astGroup.position.set(1.3 + (i - 1) * 0.42, 0.5, 0);
    for (let a = 0; a < 3; a++) {
      const barGeo = new THREE.BoxGeometry(0.24, 0.06, 0.06);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.rotation.y = (a * Math.PI) / 3;
      astGroup.add(bar);
    }
    phone2.add(astGroup);
  }

  // LIGHTBULB MODEL
  const bulbTile = createTileMesh(1.3, 1.3, 0.18, 0.3, new THREE.MeshStandardMaterial({ color: 0xc7d2fe, roughness: 0.3 }));
  bulbTile.position.set(-0.9, 0.35, 1.25);
  phone2.add(bulbTile);

  const bulbGroup = new THREE.Group();
  bulbGroup.position.set(-0.9, 1.05, 1.25);
  phone2.add(bulbGroup);

  // Bulb Glass
  const bulbGeo = new THREE.SphereGeometry(0.48, 24, 20);
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    emissive: 0xeab308,
    emissiveIntensity: 1.2,
    roughness: 0.2,
    metalness: 0.1
  });
  const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
  bulbMesh.position.y = 0.52;
  bulbMesh.castShadow = true;
  bulbGroup.add(bulbMesh);

  // Bulb base neck
  const neckGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.25, 16);
  const neckMesh = new THREE.Mesh(neckGeo, bulbMat);
  neckMesh.position.y = 0.15;
  bulbGroup.add(neckMesh);

  // Metallic Socket
  const socketGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 16);
  const socketMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
  const socketMesh = new THREE.Mesh(socketGeo, socketMat);
  socketMesh.position.y = -0.06;
  bulbGroup.add(socketMesh);

  // PHONE 3 (Top / Right: Colored Cards, Settings Gear, Profile)
  const pinkCard = createTileMesh(0.8, 0.8, 0.16, 0.22, new THREE.MeshStandardMaterial({ color: 0xf87171, roughness: 0.35 }));
  pinkCard.position.set(-1.6, 0.34, -0.6);
  phone3.add(pinkCard);

  const orangeCard = createTileMesh(0.8, 0.8, 0.16, 0.22, new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35 }));
  orangeCard.position.set(-1.0, 0.34, 0.5);
  phone3.add(orangeCard);

  // Settings Gear Base Tile
  const gearTile = createTileMesh(1.35, 1.35, 0.18, 0.3, blueTileMat);
  gearTile.position.set(-0.15, 0.34, -0.45);
  phone3.add(gearTile);

  // 3D Gear Model
  const gearGroup = new THREE.Group();
  gearGroup.position.set(-0.15, 0.52, -0.45);
  phone3.add(gearGroup);

  const gearMat = new THREE.MeshStandardMaterial({ color: 0xc4b5fd, roughness: 0.4, metalness: 0.2 });
  const gearHubGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.16, 20);
  const gearHub = new THREE.Mesh(gearHubGeo, gearMat);
  gearHub.castShadow = true;
  gearGroup.add(gearHub);

  // Center hole
  const holeGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.18, 16);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5 });
  const holeMesh = new THREE.Mesh(holeGeo, holeMat);
  holeMesh.position.y = 0.01;
  gearGroup.add(holeMesh);

  // 6 Radial Teeth
  for (let i = 0; i < 6; i++) {
    const toothGeo = new THREE.BoxGeometry(0.14, 0.16, 0.22);
    const tooth = new THREE.Mesh(toothGeo, gearMat);
    tooth.rotation.y = (i * Math.PI) / 3;
    tooth.translateOnAxis(new THREE.Vector3(0, 0, 1), 0.4);
    tooth.castShadow = true;
    gearGroup.add(tooth);
  }

  // Profile Avatar Pill
  const userPill = createTileMesh(1.0, 0.55, 0.14, 0.25, new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 }));
  userPill.position.set(1.4, 0.34, 0.3);
  phone3.add(userPill);

  // User icon (head + body)
  const headGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const userIconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const head = new THREE.Mesh(headGeo, userIconMat);
  head.position.set(1.3, 0.48, 0.3);
  phone3.add(head);

  const bodyDomeGeo = new THREE.CylinderGeometry(0.08, 0.18, 0.12, 12);
  const bodyDome = new THREE.Mesh(bodyDomeGeo, userIconMat);
  bodyDome.position.set(1.48, 0.48, 0.3);
  phone3.add(bodyDome);

  // Floating card off top of phone 3
  const topFloatingCard = createTileMesh(1.2, 0.9, 0.16, 0.24, new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.85 }));
  topFloatingCard.position.set(-2.8, 2.3, -5.2);
  mainGroup.add(topFloatingCard);

  // 3D DOTTED CONNECTION PATHS
  function createDottedPath(points, count) {
    const curve = new THREE.CatmullRomCurve3(points);
    const dotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x93c5fd, emissiveIntensity: 0.9 });
    const pGroup = new THREE.Group();
    for (let i = 0; i <= count; i++) {
      const pt = curve.getPoint(i / count);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), dotMat);
      dot.position.copy(pt);
      pGroup.add(dot);
    }
    mainGroup.add(pGroup);
    return pGroup;
  }

  // Path 1: Phone 1 Launchpad to Phone 2 Lightbulb & Green Button
  createDottedPath([
    new THREE.Vector3(-0.9, 0.4, 4.3),
    new THREE.Vector3(-0.6, 1.0, 3.0),
    new THREE.Vector3(-0.8, 1.2, 1.8),
    new THREE.Vector3(-0.9, 1.2, 1.25)
  ], 14);

  // Path 2: Phone 2 Green Button to Phone 3 Cards
  createDottedPath([
    new THREE.Vector3(-0.35, 0.8, 0.0),
    new THREE.Vector3(-0.6, 1.4, -1.6),
    new THREE.Vector3(-1.0, 1.8, -2.8),
    new THREE.Vector3(-1.6, 1.9, -4.6)
  ], 16);

  // Path 3: Phone 3 Cards to Gear
  createDottedPath([
    new THREE.Vector3(-1.6, 2.0, -4.6),
    new THREE.Vector3(-0.9, 2.1, -4.8),
    new THREE.Vector3(-0.15, 2.0, -4.45)
  ], 10);

  // INTERACTIVITY (Mouse parallax & Touch Drag)
  let curRotY = 0, curRotX = 0;
  let targetRotY = 0, targetRotX = 0;
  let hoverX = 0, hoverY = 0;
  let isDrag = false, startX = 0, startY = 0;

  const wrap = cv.closest('.contact-3d-wrapper') || cv.parentElement;
  if (wrap) {
    wrap.addEventListener('pointerdown', e => {
      isDrag = true;
      startX = e.clientX;
      startY = e.clientY;
      try { wrap.setPointerCapture(e.pointerId); } catch (_) {}
    });
    window.addEventListener('pointermove', e => {
      if (isDrag) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        targetRotY += dx * 0.007;
        targetRotX = Math.max(-0.4, Math.min(0.4, targetRotX + dy * 0.007));
      } else {
        const rect = wrap.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const nx = (e.clientX - rect.left) / rect.width * 2 - 1;
          const ny = (e.clientY - rect.top) / rect.height * 2 - 1;
          hoverY = nx * 0.16;
          hoverX = -ny * 0.12;
        }
      }
    });
    const stopDrag = e => {
      if (isDrag) {
        isDrag = false;
        try { wrap.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    wrap.addEventListener('pointerup', stopDrag);
    wrap.addEventListener('pointercancel', stopDrag);
    wrap.addEventListener('pointerleave', () => {
      hoverY = 0;
      hoverX = 0;
    });
  }

  // Responsive Resize
  function resizeContact() {
    const wrapEl = cv.closest('.contact-3d-wrapper') || cv.parentElement;
    if (!wrapEl) return;
    const w = wrapEl.clientWidth;
    const h = wrapEl.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    if (w < 480) {
      cam.fov = 28;
    } else if (w < 650) {
      cam.fov = 25;
    } else {
      cam.fov = 22;
    }
    cam.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeContact);
  resizeContact();

  // Visibility observer
  let contactVis = true;
  new IntersectionObserver(entries => {
    contactVis = entries[0].isIntersecting;
  }).observe(cv);

  // Animation Loop
  function loopContact(t) {
    t *= 0.001;

    // Rocket hovering and thruster flame animation
    rocketGroup.position.y = 1.45 + Math.sin(t * 3.4) * 0.12;
    flameOuter.scale.y = 1 + Math.sin(t * 18) * 0.18;
    flameOuter.scale.x = flameOuter.scale.z = 1 + Math.cos(t * 18) * 0.09;
    flameInner.scale.y = 1 + Math.sin(t * 22) * 0.22;

    // Lightbulb gentle float
    bulbGroup.position.y = 1.05 + Math.sin(t * 2.6 + 1.2) * 0.08;

    // Gear rotation
    gearGroup.rotation.y += 0.015;

    // Interactive damping rotation
    const destY = targetRotY + hoverY + (isDrag ? 0 : Math.sin(t * 0.4) * 0.04);
    const destX = targetRotX + hoverX + (isDrag ? 0 : Math.cos(t * 0.3) * 0.02);
    curRotY += (destY - curRotY) * 0.08;
    curRotX += (destX - curRotX) * 0.08;
    mainGroup.rotation.y = curRotY;
    mainGroup.rotation.x = curRotX;

    if (contactVis) {
      renderer.render(scene, cam);
    }
    requestAnimationFrame(loopContact);
  }
  requestAnimationFrame(loopContact);
})();
