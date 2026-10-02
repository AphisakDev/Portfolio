// Hero 3D Desk & Workspace Scene
(() => {
const cv=document.getElementById('c');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:'high-performance'});
R.setPixelRatio(Math.min(devicePixelRatio,2));
R.shadowMap.enabled=true;
R.shadowMap.type=THREE.PCFSoftShadowMap;
R.toneMapping=THREE.ACESFilmicToneMapping;
R.toneMappingExposure=1.18;

const S=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(26,1,.1,100);
cam.position.set(22,17,22);
cam.lookAt(0,.7,0);

// Ambient & studio lighting matching Image 1
S.add(new THREE.HemisphereLight(0x7a8ca8,0x0b0e18,.85));

const sun=new THREE.DirectionalLight(0xf1f5f9,1.15);
sun.position.set(8,16,10);
sun.castShadow=true;
sun.shadow.mapSize.width=2048;
sun.shadow.mapSize.height=2048;
sun.shadow.camera.near=.5;
sun.shadow.camera.far=40;
sun.shadow.camera.left=-8;
sun.shadow.camera.right=8;
sun.shadow.camera.top=8;
sun.shadow.camera.bottom=-8;
sun.shadow.bias=-0.0006;
S.add(sun);

// Warm amber light on left - illuminates coffee mug & warm desk rim
const pWarm=new THREE.PointLight(0xff9838,3.2,18,1.2);
pWarm.position.set(-4.8,3.4,3.4);
pWarm.castShadow=true;
S.add(pWarm);

// Neon cyan screen glow - vibrant blue glow on keyboard & desk
const pCyan=new THREE.PointLight(0x00f2ff,3.2,16,1.2);
pCyan.position.set(0.8,3.2,-0.4);
pCyan.castShadow=true;
S.add(pCyan);

// Neon magenta/purple accent light for PC case & headphone stand
const pPurple=new THREE.PointLight(0xd946ef,2.4,14,1.3);
pPurple.position.set(-3.2,2.4,-1.2);
S.add(pPurple);

// Right rim light
const pRim=new THREE.PointLight(0x38bdf8,1.2,14);
pRim.position.set(5.2,2.5,1.8);
S.add(pRim);

const M=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.45,metalness:.2},o));
const G=new THREE.Group();S.add(G);

function add(geo,mat,x,y,z,p=G){
  const m=new THREE.Mesh(geo,mat);
  m.position.set(x,y,z);
  m.castShadow=m.receiveShadow=true;
  p.add(m);
  return m;
}

function tex(w,h,fn){
  const c=document.createElement('canvas');
  c.width=w;
  c.height=h;
  fn(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);
  t.anisotropy=4;
  return t;
}

// Rounded box generator using THREE.ExtrudeGeometry
function rBox(w,h,d,r,bevel=0.08){
  const s=new THREE.Shape(),hw=w/2,hd=d/2;
  s.moveTo(-hw+r,-hd);
  s.lineTo(hw-r,-hd);
  s.absarc(hw-r,-hd+r,r,-Math.PI/2,0,false);
  s.lineTo(hw,hd-r);
  s.absarc(hw-r,hd-r,r,0,Math.PI/2,false);
  s.lineTo(-hw+r,hd);
  s.absarc(-hw+r,hd-r,r,Math.PI/2,Math.PI,false);
  s.lineTo(-hw,-hd+r);
  s.absarc(-hw+r,-hd+r,r,Math.PI,Math.PI*1.5,false);
  const g=new THREE.ExtrudeGeometry(s,{
    depth:h,
    bevelEnabled:bevel>0,
    bevelSegments:4,
    steps:1,
    bevelSize:bevel,
    bevelThickness:bevel
  });
  g.center();
  g.rotateX(Math.PI/2);
  return g;
}

// 1. Desk (Floating Rounded Table)
add(rBox(9.8,0.55,9.8,1.3,0.14),M(0x1d2033,{roughness:.42,metalness:.22}),0,0,0);
add(rBox(9.85,0.06,9.85,1.32,0.02),M(0x8a5cff,{emissive:0x4a22cc,roughness:.6}),0,-0.22,0);

// 2. High-res Monitor & Laptop Screen Textures
const screenTex=tex(1024,640,(g,w,h)=>{
  g.fillStyle='#090d18';g.fillRect(0,0,w,h);
  // Neon cyan square widget
  g.shadowColor='#00f0ff';g.shadowBlur=28;g.strokeStyle='#00f0ff';g.lineWidth=10;
  g.strokeRect(60,60,220,220);
  g.fillStyle='rgba(0,240,255,0.08)';g.fillRect(65,65,210,210);
  g.shadowBlur=0;
  // Mint status pill
  g.fillStyle='#10b981';g.fillRect(60,340,260,42);
  g.fillRect(360,60,280,38);
  // Code lines
  const colors=['#38bdf8','#818cf8','#64748b','#94a3b8','#a855f7','#38bdf8','#64748b'];
  for(let i=0;i<11;i++){
    g.fillStyle=colors[i%colors.length];
    g.fillRect(360,120+i*16,160+((i*47)%220),6);
  }
  // Analytics dots
  const dots=['#f43f5e','#fbbf24','#10b981','#38bdf8'];
  for(let i=0;i<4;i++){
    g.fillStyle=dots[i];g.beginPath();g.arc(760,130+i*36,7,0,Math.PI*2);g.fill();
    g.fillStyle='#64748b';g.fillRect(780,127+i*36,120,6);
  }
  // Bottom terminal bar
  g.fillStyle='#00f0ff';g.fillRect(360,330,340,20);
  for(let r=0;r<5;r++){
    for(let c=0;c<16;c++){
      g.fillStyle=((r+c)%3===0)?'#38bdf8':'#334155';
      g.fillRect(360+c*20,380+r*16,8,4);
    }
  }
});

// Realistic keyboard texture
const keyTex=tex(512,300,(g,w,h)=>{
  g.fillStyle='#23273c';g.fillRect(0,0,w,h);
  g.fillStyle='#141724';
  for(let r=0;r<5;r++){
    for(let c=0;c<14;c++){
      g.fillRect(14+c*34,14+r*34,28,28);
    }
  }
  // Spacebar
  g.fillStyle='#1b1f32';g.fillRect(116,184,240,28);
  // Trackpad boundary
  g.strokeStyle='#3b4260';g.lineWidth=2;
  g.strokeRect(170,226,132,60);
});

// 3. Large Desktop Monitor (Behind laptop)
const mon=new THREE.Group();
mon.position.set(1.1,0,-1.9);
mon.rotation.y=-0.14;
G.add(mon);
add(rBox(5.6,3.6,0.14,0.28,0.04),M(0x151827,{metalness:.7,roughness:.35}),0,2.6,0,mon);
add(new THREE.PlaneGeometry(5.2,3.2),new THREE.MeshBasicMaterial({map:screenTex}),0,2.6,0.1,mon);
// Monitor dual stand
add(new THREE.CylinderGeometry(0.08,0.08,1.6,16),M(0x282c42,{metalness:.8,roughness:.3}),-0.6,1.2,-0.2,mon).rotation.x=-0.25;
add(new THREE.CylinderGeometry(0.08,0.08,1.6,16),M(0x282c42,{metalness:.8,roughness:.3}),0.6,1.2,-0.2,mon).rotation.x=-0.25;

// 4. Laptop
const lap=new THREE.Group();
lap.position.set(0.4,0.32,0.8);
lap.rotation.y=-0.14;
G.add(lap);
add(rBox(3.7,0.12,2.5,0.18,0.03),M(0x8f9dc9,{metalness:.6,roughness:.32}),0,0,0,lap);
add(new THREE.PlaneGeometry(3.1,1.8),new THREE.MeshStandardMaterial({map:keyTex,roughness:.6}),0,0.07,-0.12,lap).rotation.x=-Math.PI/2;
add(new THREE.PlaneGeometry(1.2,0.7),M(0x7a87b5,{metalness:.65,roughness:.28}),0,0.07,0.75,lap).rotation.x=-Math.PI/2;
const hinge=new THREE.Group();
hinge.position.set(0,0.06,-1.25);
hinge.rotation.x=-0.28;
lap.add(hinge);
add(rBox(3.7,2.3,0.08,0.16,0.03),M(0x7886b5,{metalness:.6,roughness:.32}),0,1.15,0,hinge);
add(new THREE.PlaneGeometry(3.45,2.05),new THREE.MeshBasicMaterial({map:screenTex}),0,1.15,0.05,hinge);

// 5. PC Case / Subwoofer Box (Rear Left)
const pc=new THREE.Group();
pc.position.set(-3.2,0,-1.5);
G.add(pc);
add(rBox(1.9,2.9,1.3,0.18,0.05),M(0x202438,{roughness:.5,metalness:.2}),0,1.75,0,pc);
const ring=add(new THREE.TorusGeometry(0.22,0.05,16,32),new THREE.MeshBasicMaterial({color:0xf472b6}),0,1.75,0.68,pc);
ring.scale.y=1.5;
add(new THREE.SphereGeometry(0.08,16,16),new THREE.MeshBasicMaterial({color:0xffffff}),0,1.75,0.68,pc);
add(rBox(0.4,0.45,0.5,0.08,0.02),M(0xd8b4fe,{roughness:.35}),0,3.35,0,pc);

// 6. Left Headphones (resting on PC tower)
const hpL=new THREE.Group();
hpL.position.set(-3.2,3.6,-1.5);
G.add(hpL);
add(new THREE.TorusGeometry(0.72,0.09,16,40,Math.PI),M(0x2d3a5a,{roughness:.4,metalness:.3}),0,0.2,0,hpL);
add(new THREE.TorusGeometry(0.73,0.11,16,30,Math.PI*0.6),M(0x38bdf8,{roughness:.3}),0,0.2,0,hpL).rotation.z=Math.PI*0.2;
[-0.72,0.72].forEach(x=>{
  const cup=add(new THREE.CylinderGeometry(0.42,0.42,0.34,28),M(0x192033,{roughness:.4}),x,0.2,0,hpL);
  cup.rotation.z=Math.PI/2;
});

// 7. Right Headphone on Curved Stand (Right Side)
const hsR=new THREE.Group();
hsR.position.set(3.8,0,0.5);
hsR.rotation.y=-0.45;
G.add(hsR);
add(rBox(1.1,0.12,1.3,0.2,0.03),M(0xd8b4fe,{roughness:.3}),0,0.3,0,hsR);
const neck=add(new THREE.TorusGeometry(0.65,0.11,16,32,Math.PI*0.95),M(0xc084fc,{roughness:.3}),0,1.05,-0.2,hsR);
neck.rotation.y=Math.PI/2;
neck.rotation.x=-0.2;
const hpR=new THREE.Group();
hpR.position.set(0,1.15,0);
hsR.add(hpR);
add(new THREE.TorusGeometry(0.8,0.1,16,40,Math.PI),M(0x2d3a5a,{roughness:.4}),0,0.9,0,hpR);
add(new THREE.TorusGeometry(0.81,0.12,16,30,Math.PI*0.6),M(0x38bdf8,{roughness:.3}),0,0.9,0,hpR).rotation.z=Math.PI*0.2;
[-0.8,0.8].forEach(x=>{
  const cup=add(new THREE.CylinderGeometry(0.44,0.44,0.36,28),M(0x16233a,{roughness:.38}),x,0.9,0,hpR);
  cup.rotation.z=Math.PI/2;
  const ringAcc=add(new THREE.TorusGeometry(0.44,0.03,16,28),new THREE.MeshBasicMaterial({color:0x38bdf8}),x+((x>0)?0.18:-0.18),0.9,0,hpR);
  ringAcc.rotation.y=Math.PI/2;
});

// 8. Coffee Mug (Front Left)
const mug=new THREE.Group();
mug.position.set(-3.4,0.3,1.9);
G.add(mug);
add(new THREE.CylinderGeometry(0.58,0.50,1.3,32),M(0xedeaf7,{roughness:.2,metalness:.08}),0,0.65,0,mug);
add(new THREE.CylinderGeometry(0.51,0.51,0.06,32),M(0xd97706,{roughness:.15,metalness:.25,emissive:0x78350f,emissiveIntensity:0.7}),0,1.22,0,mug);
add(new THREE.TorusGeometry(0.34,0.08,16,32,Math.PI*1.3),M(0xedeaf7,{roughness:.2,metalness:.08}),0.66,0.65,0,mug).rotation.z=-1.9;

// 9. Smartphone (Front Center-Left)
const phone=new THREE.Group();
phone.position.set(-1.3,0.32,2.9);
phone.rotation.y=0.38;
G.add(phone);
add(rBox(1.3,0.08,2.2,0.18,0.03),M(0x13141f,{metalness:.85,roughness:.18}),0,0,0,phone);
add(new THREE.PlaneGeometry(1.2,2.05),M(0x0c0d16,{roughness:.1,metalness:.9}),0,0.045,0,phone).rotation.x=-Math.PI/2;

// 10. Smart Rotary Dial / Knob (Front Center-Right)
const knob=new THREE.Group();
knob.position.set(0.6,0.3,2.8);
G.add(knob);
add(new THREE.CylinderGeometry(0.56,0.60,0.44,32),M(0x1e2130,{roughness:.45,metalness:.3}),0,0.22,0,knob);
add(new THREE.CylinderGeometry(0.48,0.48,0.12,32),M(0x2d3248,{roughness:.3,metalness:.6}),0,0.46,0,knob);
const btn=add(new THREE.SphereGeometry(0.32,32,16,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:0x00f2ff}),0,0.52,0,knob);

// layout + loop
let tx=0,ty=0;
let isInteracting=false,idleTimer=null;
function setPointer(x,y){
  tx=(x/innerWidth-.5);
  ty=(y/innerHeight-.5);
  isInteracting=true;
  clearTimeout(idleTimer);
  idleTimer=setTimeout(()=>{isInteracting=false},3000);
}
addEventListener('pointermove',e=>setPointer(e.clientX,e.clientY));
addEventListener('touchmove',e=>{
  if(e.touches&&e.touches[0]){setPointer(e.touches[0].clientX,e.touches[0].clientY)}
},{passive:true});

function size(){
  const hero=cv.parentElement,w=hero.clientWidth,h=hero.clientHeight;
  R.setSize(w,h,false);
  cam.aspect=w/h;
  if(w>=1400){
    cam.setViewOffset(w,h,-w*.21,0,w,h);
    cam.zoom=1.30;
  }else if(w>=1100){
    cam.setViewOffset(w,h,-w*.18,0,w,h);
    cam.zoom=1.20;
  }else if(w>900){
    cam.setViewOffset(w,h,-w*.15,0,w,h);
    cam.zoom=1.10;
  }else if(w>=600){
    cam.setViewOffset(w,h,0,-h*.13,w,h);
    cam.zoom=Math.min(1.05,Math.max(.85,(w/750)*1.0));
  }else{
    cam.setViewOffset(w,h,0,-h*.14,w,h);
    cam.zoom=Math.min(.90,Math.max(.72,(w/400)*.80));
  }
  cam.updateProjectionMatrix();
}
addEventListener('resize',size);size();

const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function loop(t){
  t*=.001;
  const targetX=isInteracting?tx*.75:(tx*.75+Math.sin(t*.8)*.12);
  const targetY=isInteracting?ty*.2:(ty*.2+Math.cos(t*.6)*.04);
  G.rotation.y+=(targetX-G.rotation.y)*.05;
  G.rotation.x+=(targetY-G.rotation.x)*.05;
  if(!still){
    G.position.y=Math.sin(t*1.1)*.14;
    ring.material.color.setHSL(.8+Math.sin(t*2)*.03,1,.62);
    btn.scale.setScalar(1+Math.sin(t*3)*.06);
  }
  if(vis)R.render(S,cam);
  requestAnimationFrame(loop);
}

const hintEl=document.querySelector('.hint');
if(hintEl&&(('ontouchstart' in window)||navigator.maxTouchPoints>0)){
  hintEl.textContent='Touch or drag to rotate the desk';
}

let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(cv);
requestAnimationFrame(loop);
})();
