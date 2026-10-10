import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import bones from './bones.json';
import { info, sources, layerDefs } from './data.js';
import './exams.js';
import {createWrist} from './wrist-model.js';
import {wristInfo,routes} from './wrist-data.js';

if(new URLSearchParams(location.search).get('embed')==='1'){document.body.dataset.embed='true';document.querySelector('.view-hint').innerHTML='拖动旋转<span>滚轮 / 双指缩放</span>'; }

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={labels:true,finger:2,hand:'right',mode:'whole',view:'palmar',angle:0,playing:false,exploded:false,selected:'a1',isolate:false,capsule:false,sheath:false,layers:{skin:false,bone:true,ligament:true,muscle:true,tendon:true,neuro:true}};
const host=$('#canvasHost'), scene=new THREE.Scene(), root=new THREE.Group();scene.add(root);
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});}catch(e){$('#error').hidden=false;$('#error').textContent='此浏览器未能启用 WebGL。请用支持硬件加速的 Chrome 或 Edge 打开。';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;host.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(34,1,.1,200);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=5;controls.maxDistance=65;controls.enablePan=true;
scene.add(new THREE.HemisphereLight(0xeaf5ff,0x25332f,2.2));
const key=new THREE.DirectionalLight(0xffead0,3.4);key.position.set(-6,10,12);scene.add(key);
const fill=new THREE.DirectionalLight(0xb1d9ef,2);fill.position.set(7,1,-6);scene.add(fill);
const rim=new THREE.DirectionalLight(0xb9cfc2,1.6);rim.position.set(-8,-5,-3);scene.add(rim);
const palette={mc:0xe8dfc9,pp:0xeee5d0,mp:0xe8dfcb,dp:0xeee3ca,cartilage:0xb3d8dd,plate:0x6ba69a,collateral:0x88b9aa,accessory:0x78a792,capsule:0x9ec6b6,fds:0xe6ad82,fdp:0xd98070,a1:0xc5c0a0,a2:0xbcbca5,sheath:0xa3c8c6,extensor:0xd7b594,sagittal:0xd0c3a2,interossei:0x9c5750,lumbrical:0xb8665b,nerve:0xefcd62,artery:0xd95e59,vein:0x558eb6,skin:0xd8aa8c};
const all=[], fingers=[], thumb=new THREE.Group(), landmarks=[], glideMarkers=[];
for(const d of Object.values(wristInfo))palette[d.id]={bone:0xe8dfc9,ligament:0x78b2a2,tendon:0xe6ad82,muscle:0xb66658,neuro:0xefcd62}[d.layer];
const layerZ={skin:5,bone:0,ligament:1.25,muscle:2,tendon:3.1,neuro:4.2};
const v=a=>new THREE.Vector3(...a);
function material(id){const opacity=id==='skin'?.11:id==='capsule'?.18:id==='sheath'?.16:id==='guyon'?.22:id==='retinaculum'||id==='aponeurosis'?.28:1;return new THREE.MeshStandardMaterial({color:palette[id],roughness:id==='cartilage'?.24:id==='mc'||id==='pp'?.7:.49,metalness:0,transparent:opacity<1,opacity,side:THREE.DoubleSide,depthWrite:opacity===1,emissive:0x000000});}
function add(g,id,group,rig='soft'){
 const m=new THREE.Mesh(g,material(id));m.userData={id,layer:info[id].layer,rig,rest:new Float32Array(g.attributes.position.array),baseOpacity:m.material.opacity};group.add(m);all.push(m);return m;
}
function smoothGeometry(g){g.deleteAttribute('normal');g.deleteAttribute('uv');g=mergeVertices(g,.00008);g.computeVertexNormals();return g;}
function subdivide(g){
 const p=g.attributes.position,old=Array.from({length:p.count},(_,i)=>new THREE.Vector3().fromBufferAttribute(p,i)),neighbors=old.map(()=>new Set()),edges=new Map(),ix=g.index.array;
 function edge(a,b,c){neighbors[a].add(b);neighbors[b].add(a);const key=a<b?`${a},${b}`:`${b},${a}`;if(!edges.has(key))edges.set(key,{a,b,op:[]});edges.get(key).op.push(c)}
 for(let i=0;i<ix.length;i+=3){const[a,b,c]=[ix[i],ix[i+1],ix[i+2]];edge(a,b,c);edge(b,c,a);edge(c,a,b)}
 const out=old.map((q,i)=>{const ns=[...neighbors[i]],n=ns.length;if(n<3)return q.clone();const beta=n===3?3/16:3/(8*n);const s=q.clone().multiplyScalar(1-n*beta);for(const j of ns)s.addScaledVector(old[j],beta);return s});
 for(const e of edges.values()){const q=old[e.a].clone().add(old[e.b]);if(e.op.length===2){q.multiplyScalar(3/8).addScaledVector(old[e.op[0]],1/8).addScaledVector(old[e.op[1]],1/8)}else q.multiplyScalar(.5);e.i=out.length;out.push(q)}
 const ei=(a,b)=>edges.get(a<b?`${a},${b}`:`${b},${a}`).i,faces=[];for(let i=0;i<ix.length;i+=3){const[a,b,c]=[ix[i],ix[i+1],ix[i+2]],ab=ei(a,b),bc=ei(b,c),ca=ei(c,a);faces.push(a,ab,ca,b,bc,ab,c,ca,bc,ab,bc,ca)}
 const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(out.flatMap(q=>q.toArray()),3));result.setIndex(faces);result.computeVertexNormals();return result;
}
function boneMesh(digit,part,id,start,length,group){
 const b=bones[`${digit}_${part}`];let g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setIndex(b.i);g.scale(length,length,length);g.translate(0,start,0);g=subdivide(smoothGeometry(g));const m=add(g,id,group,part==='mc'?'fixed':'rigid');
 if(part==='mc'||part==='proximal'){
  const p=g.attributes.position,ind=g.index.array,sel=[];for(let i=0;i<ind.length;i+=3){let av=(p.getY(ind[i])+p.getY(ind[i+1])+p.getY(ind[i+2]))/3;if(part==='mc'?av>start+length*.93:av<start+length*.075)sel.push(ind[i],ind[i+1],ind[i+2]);}
  const c=g.clone();c.setIndex(sel);const cp=c.attributes.position;for(let i=0;i<cp.count;i++){cp.setXYZ(i,cp.getX(i)*1.015,cp.getY(i)+(part==='mc'?.025:-.025),cp.getZ(i)*1.02)}c.computeVertexNormals();add(c,'cartilage',group,part==='mc'?'fixed':'rigid');
 }return m;
}
// Swept elliptical profiles follow a curve. The changing profile supplies flattened tendons and tapered muscle bellies.
function sweep(points,rx,rz,profile=()=>1,segments=48,sides=10){
 const curve=new THREE.CatmullRomCurve3(points.map(v));const verts=[],idx=[];
 for(let i=0;i<=segments;i++){const t=i/segments,p=curve.getPointAt(t),tangent=curve.getTangentAt(t);let x=new THREE.Vector3(1,0,0).addScaledVector(tangent,-tangent.x).normalize();if(x.lengthSq()<.1)x=new THREE.Vector3(0,1,0);const z=new THREE.Vector3().crossVectors(x,tangent).normalize();const factor=profile(t);
  for(let j=0;j<=sides;j++){let a=j/sides*Math.PI*2;let q=p.clone().addScaledVector(x,Math.cos(a)*rx*factor).addScaledVector(z,Math.sin(a)*rz*factor);verts.push(...q.toArray());}
 }
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){let a=i*(sides+1)+j,b=a+sides+1;idx.push(a,b,a+1,b,b+1,a+1)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function tendon(points,id,group,rx=.19,rz=.095,fibers=3){
 const m=add(sweep(points,rx,rz,t=>.87+.13*Math.sin(t*Math.PI)),id,group);
 if(fibers)for(let i=0;i<fibers;i++){const off=(i-(fibers-1)/2)*rx*.42;const ps=points.map(p=>[p[0]+off,p[1],p[2]+rz*.92]);const f=add(sweep(ps,.009,.009,()=>1,40,5),id,group);f.material.color.lerp(new THREE.Color(0xffedcc),.18);}
 return m;
}
function sheet(fn,nu=24,nv=16){const p=[],idx=[];for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++)p.push(...fn(i/nu,j/nv));for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){let a=i*(nv+1)+j,b=a+nv+1;idx.push(a,b,a+1,b,b+1,a+1)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function pulley(y0,y1,rx,rz,id,group){
 const fn=(u,t)=>{let a=.04+u*(Math.PI-.08);return [rx*Math.cos(a),y0+(y1-y0)*t,.24+rz*Math.sin(a)]};add(sheet(fn),id,group,'rigid');
 for(let i=0;i<6;i++){const yy=y0+(y1-y0)*(i+.15)/6;const pts=[];for(let j=0;j<=14;j++){let a=.04+j/14*(Math.PI-.08);pts.push([rx*Math.cos(a),yy,.25+rz*Math.sin(a)])}const m=add(sweep(pts,.012,.012,()=>1,24,5),id,group,'rigid');m.material.color.multiplyScalar(.87);}
}
function ellipsoid(pos,scale,id,group,rig='soft'){let g=new THREE.SphereGeometry(1,32,24);g.scale(...scale);g.translate(...pos);return add(g,id,group,rig);}
function intrinsic(points,id,group,width=.22){add(sweep(points,width,.15,t=>.15+Math.pow(Math.sin(Math.PI*t),.8),40,12),id,group);for(let i=-1;i<=1;i++){const ps=points.map(p=>[p[0]+i*.07,p[1],p[2]+.14]);const m=add(sweep(ps,.008,.008,t=>Math.sin(Math.PI*t),35,5),id,group);m.material.color.multiplyScalar(1.2);}}

function makeFinger(index){
 const digit=index+2,g=new THREE.Group();g.userData.index=index;root.add(g);fingers.push(g);
 const xs=[-2.8,-.95,.95,2.6],ys=[0,.4,.15,-.8],sc=[.94,1.04,1,.8];g.position.set(xs[index],ys[index],0);g.scale.setScalar(sc[index]);g.rotation.z=[-.055,-.015,.015,.055][index];
 boneMesh(digit,'mc','mc',-6.1,6.45,g);boneMesh(digit,'proximal','pp',.46,4.03,g);boneMesh(digit,'middle','mp',4.72,2.24,g);boneMesh(digit,'distal','dp',7.16,1.7,g);
 add(sheet((u,t)=>{const yy=-.33+t*1.18,w=.59-.11*t;return[(u*2-1)*w,yy,.77-.09*Math.pow(u*2-1,2)+.03*Math.sin(t*Math.PI)]}),'plate',g);
 for(let side of [-1,1]){
  tendon([[side*.67,-.35,-.08],[side*.78,0,.1],[side*.55,.67,.3],[side*.45,.92,.32]],'collateral',g,.10,.075,3);
  add(sheet((u,t)=>[side*(.65*(1-t)+(.4+u*.23)*t),-.4*(1-t)+(.05+u*.52)*t,.04*(1-t)+.74*t],12,8),'accessory',g);
 }
 ellipsoid([0,.15,0],[.82,1.05,.84],'capsule',g);
 tendon([[0,-6.2,.67],[0,-2,.81],[0,-.5,.98],[0,.5,1.03],[0,2.3,.87],[0,4.1,.67],[0,5.2,.65],[0,6.6,.51],[0,7.4,.37]],'fdp',g,.20,.12,4);
 tendon([[0,-6.2,.99],[0,-2,1.12],[0,-.35,1.29],[0,.65,1.28],[0,1.4,1.15]],'fds',g,.24,.105,4);
 const glidePath=new THREE.CatmullRomCurve3([[0,-6.2,1.115],[0,-2,1.245],[0,-.35,1.415],[0,.65,1.405],[0,1.4,1.275]].map(v));
 for(const t of [.49,.7,.87]){const dot=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),new THREE.MeshStandardMaterial({color:0xffefc6,roughness:.4,emissive:0x504222,emissiveIntensity:.25}));dot.scale.set(.10,.12,.022);g.add(dot);glideMarkers.push({mesh:dot,path:glidePath,t});}
 for(let s of [-1,1])tendon([[0,1.25,1.17],[s*.25,2.0,1.05],[s*.36,2.75,.72],[s*.28,3.6,.53],[s*.29,4.4,.48],[s*.31,5.28,.31]],'fds',g,.10,.065,2);
 // Camper chiasm: thin deep connecting fibers, intentionally schematic.
 for(let s of [-1,1])tendon([[s*.32,2.8,.59],[0,3.35,.42],[-s*.28,3.75,.48]],'fds',g,.055,.035,0);
 pulley(-.47,.35,.71,1.22,'a1',g);pulley(1.18,2.60,.53,1.09,'a2',g);
 add(sweep([[0,-.68,1.1],[0,1,1.07],[0,3,.73],[0,5.2,.53],[0,7.3,.39]],.40,.32,()=>1,64,20),'sheath',g);
 tendon([[0,-6.15,-.65],[0,-2,-.73],[0,-.2,-.86],[0,.65,-.71],[0,2.5,-.56],[0,4.3,-.44],[0,4.9,-.29]],'extensor',g,.22,.075,4);
 for(let s of [-1,1])tendon([[0,1.55,-.63],[s*.35,2.8,-.43],[s*.4,4.35,-.26],[s*.3,5.85,-.27],[0,7.36,-.21]],'extensor',g,.095,.045,2);
 add(sheet((u,t)=>{const w=.63*(1-t)+.27*t;return [(u*2-1)*w,.55+t*1.6,-.69+.16*Math.pow(u*2-1,2)+t*.13]}),'extensor',g);
 add(sheet((u,t)=>{const a=u*Math.PI*1.48-Math.PI*.24;return [.82*Math.cos(a),-.38+t*.7,-.02-.87*Math.sin(a)]}),'sagittal',g);
 if(index===0||index===3)tendon([[.20,-5.8,-.68],[.28,-1.7,-.73],[.23,.25,-.85],[.23,1,-.65]],'extensor',g,.10,.055,1);
 const muscleSides=index===1?[-1,1]:index===3?[-1]:[-1,1];
 for(let s of muscleSides){const dorsal=(index===0&&s===-1)||(index===1)||(index===2&&s===1);const zz=dorsal?-.33:.33;
  intrinsic([[s*.45,-5.4,zz],[s*.76,-4,zz],[s*.92,-2.4,zz],[s*.75,-.7,.0]],'interossei',g,.25);
  tendon([[s*.75,-1.0,zz],[s*.67,-.2,.04],[s*.57,.78,.1],[s*.42,1.65,-.49]],'interossei',g,.08,.045,0);
 }
 intrinsic([[0,-4.65,.74],[-.57,-3.9,.8],[-.77,-2.8,.83],[-.77,-1.4,.75]],'lumbrical',g,.19);
 if(index>1)intrinsic([[-1.45,-4.45,.68],[-1.17,-3.4,.79],[-.78,-2.6,.82]],'lumbrical',g,.12);
 tendon([[-.77,-1.7,.76],[-.86,-.4,.63],[-.79,.55,.28],[-.55,1.25,-.41],[-.37,2.1,-.51]],'lumbrical',g,.073,.049,0);
 for(let s of [-1,1]){
  tendon([[s*.86,-5.8,.85],[s*.96,-2,.94],[s*.93,0,.84],[s*.8,2,.54],[s*.7,4.5,.4],[s*.56,6.8,.3],[s*.35,8.2,.21]],'nerve',g,.057,.055,0);
  tendon([[s*.76,-5.8,.65],[s*.85,-2,.69],[s*.82,0,.58],[s*.70,2,.36],[s*.6,4.5,.26],[s*.46,6.8,.22],[s*.3,8.1,.18]],'artery',g,.043,.042,0);
  tendon([[s*.83,-5.6,-.36],[s*.95,-2,-.33],[s*.91,0,-.29],[s*.72,2,-.24],[s*.60,4.5,-.18],[s*.45,6.8,-.12],[s*.29,8,-.04]],'vein',g,.035,.034,0);
 }
 add(sweep([[0,-.6,0],[0,1,0],[0,3,0],[0,5.5,0],[0,7.7,0],[0,8.9,0]],.92,1.45,t=>.95-.35*t-.57*Math.pow(Math.max(0,(t-.91)/.09),2),72,24),'skin',g);
 const labs=[['a1',[-.67,-.1,1.5],'A1 滑车'],['a2',[.6,1.9,1.3],'A2 滑车'],['fds',[-.35,3.1,.9],'浅屈肌腱分叉'],['mc',[-.7,-2.7,0],'掌骨'],['sagittal',[.7,.1,-.9],'矢状带']];
 for(let [id,pos,name]of labs){const el=document.createElement('button');el.className='model-label';el.textContent=name;el.onclick=()=>select(id);$('#labels').append(el);landmarks.push({id,pos:v(pos),el,group:g,index});}
 return g;
}
for(let i=0;i<4;i++)makeFinger(i);
// A modest proximal convergence restores the fan of metacarpals toward the wrist.
for(const m of all){const pos=m.geometry.attributes.position;for(let i=0;i<pos.count;i++){const y=pos.getY(i);pos.setX(i,pos.getX(i)-m.parent.position.x*.25*THREE.MathUtils.smoothstep(-y,0,6));}m.userData.rest=new Float32Array(pos.array);pos.needsUpdate=true;m.geometry.computeVertexNormals();}
// Thumb is included only as skeletal orientation context, not a soft-tissue atlas.
root.add(thumb);thumb.position.set(-4.4,-4.5,.25);thumb.rotation.z=.62;boneMesh(1,'mc','mc',-1.9,3.9,thumb);boneMesh(1,'proximal','pp',2.15,2.7,thumb);boneMesh(1,'distal','dp',5.05,1.85,thumb);
const palm=new THREE.Group();root.add(palm);ellipsoid([-.1,-3.55,0],[4.1,3.3,1.22],'skin',palm,'fixed');
const wrist=createWrist({root,add,smoothGeometry,subdivide,ellipsoid,sweep,sheet});
for(const [id,pos,name]of [['tfcc',[1.8,-9.3,.3],'TFCC'],['hamate',[1.5,-7,1.5],'钩骨钩'],['median',[-.65,-8,1.5],'正中神经'],['ecu',[2.2,-9,-1],'ECU'],['thenar',[-3.8,-4.5,1.2],'鱼际肌'],['aponeurosis',[0,-3,1.7],'掌腱膜']]){const el=document.createElement('button');el.className='model-label';el.textContent=name;el.onclick=()=>select(id);$('#labels').append(el);landmarks.push({id,pos:v(pos),el,group:wrist,index:-1});}
// Surface landmarks are purposefully absent: this envelope is not a scanned skin model.
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const visible=all.filter(m=>m.visible&&m.parent.visible&&m.material.opacity>.2);const hit=raycaster.intersectObjects(visible,false)[0];if(hit)select(hit.object.userData.id);});
const fingerNames=['食指','中指','无名指','小指'];
function notice(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(notice.timer);notice.timer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
function updateVisibility(){
 for(let i=0;i<fingers.length;i++)fingers[i].visible=state.mode!=='focus'||i===state.finger;
 thumb.visible=palm.visible=wrist.visible=state.mode!=='focus';
 $$('#scope button').forEach(b=>{b.classList.toggle('active',b.dataset.mode===state.mode);b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode));});document.body.dataset.scope=state.mode;$('#finger').disabled=state.mode!=='focus';
 for(const m of all){const d=m.userData;let vis=state.layers[d.layer];if(d.id==='capsule')vis&&=state.capsule;if(d.id==='sheath')vis&&=state.sheath;if(state.isolate)vis&&=d.id===state.selected;m.visible=!!vis;
 const selected=d.id===state.selected;m.material.color.set(palette[d.id]);if(selected)m.material.color.lerp(new THREE.Color(0xf5d98c),.24);m.material.emissive.set(selected?0x49391d:0x000000);m.material.emissiveIntensity=selected?.55:0;
 }
 for(const {mesh}of glideMarkers)mesh.visible=state.layers.tendon&&(!state.isolate||state.selected==='fds');
 $$('[data-layer]').forEach(i=>i.checked=state.layers[i.dataset.layer]);$('#capsule').checked=state.capsule;$('#sheath').checked=state.sheath;
 $('#explode').classList.toggle('active',state.exploded);$('#explode').textContent=state.exploded?'合拢组织':'分层拆解';$('#explode').setAttribute('aria-pressed',String(state.exploded));$('#isolate').setAttribute('aria-pressed',String(state.isolate));$('#isolate').textContent=state.isolate?'显示全部已开启层':'只看所选结构';
 $('#viewTitle').textContent=(state.hand==='right'?'右手':'左手')+' · '+({whole:'全手与腕',palm:'手掌',wrist:'腕部',focus:fingerNames[state.finger]}[state.mode]);$('#viewSub').textContent=state.exploded?'分层拆解 / 位置已人为分离':({focus:'指根近景',whole:'手指、手掌与腕部',palm:'掌心与掌根',wrist:'腕骨与通道'}[state.mode]);
}
function select(id,show=true){
 const d=info[id];if(!d)return;state.selected=id;state.layers[d.layer]=true;if(id==='capsule')state.capsule=true;if(id==='sheath')state.sheath=true;
 const moveFocus=matchMedia('(max-width:980px)').matches&&$('.controls').contains(document.activeElement);
 if(d.region&&state.mode!=='whole'&&state.mode!==d.region){state.mode=d.region;resetCamera('palmar');}
 if(![...$('#structure').options].some(o=>o.value===id)){$('#structureSearch').value='';filterStructures('');}
 showPanel('structure');$('#structure').value=id;$('#details').innerHTML=`<span class="tag">${layerDefs.find(l=>l[0]===d.layer)[1]}</span><h2 tabindex="-1">${d.name}</h2><div class="english">${d.english}</div><p class="lead">${d.lead}</p><dl><dt>在哪里</dt><dd>${d.location}</dd><dt>连接哪里</dt><dd>${d.attachment}</dd><dt>做什么</dt><dd>${d.function}</dd></dl><details class="model-limit"><summary>模型简化说明</summary><p class="precision">${d.limit}</p></details><p><a href="${sources[d.source]}" target="_blank" rel="noopener">查看解剖依据</a></p>`;updateVisibility();if(moveFocus)$('#details h2').focus();
}
function resetCamera(view=state.view){
 state.view=view;const group=fingers[state.finger];const sign=state.hand==='left'?-1:1;const target=state.mode==='focus'?new THREE.Vector3(group.position.x*sign,group.position.y+.6,state.exploded?1.1:0):new THREE.Vector3(-.6*sign,{whole:-2,palm:-3.5,wrist:-8.4}[state.mode],0);
 const aspect=host.clientWidth/host.clientHeight;const distance=state.mode==='whole'?Math.max(49,24/aspect):state.mode==='focus'?Math.max(20,10.4/aspect):Math.max(25,16/aspect);const offsets={palmar:[0,0,1],dorsal:[0,0,-1],side:[1,0,.07],oblique:[.6,.16,.85]};let off=v(offsets[view]).normalize().multiplyScalar(distance*(document.body.dataset.embed==='true'&&state.mode==='focus'?1.65:1));if(view==='side')off.x*=sign;camera.position.copy(target).add(off);camera.up.set(0,1,0);controls.target.copy(target);controls.update();
 const txt={palmar:'掌面朝向你',dorsal:'手背朝向你',side:'侧面观察',oblique:'立体观察'};$('#direction').textContent=txt[view];$$('#views button').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',String(b.dataset.view===view));});
}
function bendPoint(x,y,z,rig,angle){if(rig==='fixed')return[x,y,z];let a=angle;if(rig==='soft')a*=THREE.MathUtils.smoothstep(y,-1.35,.7);let c=Math.cos(a),s=Math.sin(a);return[x,y*c-z*s,y*s+z*c];}
let lastAngle=-1,lastExplode=null;
function deform(){
 if(lastAngle===state.angle&&lastExplode===state.exploded)return;lastAngle=state.angle;lastExplode=state.exploded;
 const angle=THREE.MathUtils.degToRad(state.angle);
 for(const m of all){if(m.parent===thumb||m.parent===palm)continue;const {rest,rig,layer,id}=m.userData,p=m.geometry.attributes.position;
  const dz=state.exploded?layerZ[layer]*(['extensor','sagittal','ecu','ecusheath','ecr','sl'].includes(id)?-1:1):0;
  for(let i=0;i<p.count;i++){const q=bendPoint(rest[i*3],rest[i*3+1],rest[i*3+2],rig,angle);p.setXYZ(i,q[0],q[1],q[2]+dz);}p.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingSphere();
 }
 for(const dot of glideMarkers){const p=dot.path.getPointAt(dot.t-state.angle/65*.075);p.x-=dot.mesh.parent.position.x*.25*THREE.MathUtils.smoothstep(-p.y,0,6);const q=bendPoint(p.x,p.y,p.z,'soft',angle);if(state.exploded)q[2]+=layerZ.tendon;dot.mesh.position.set(...q);dot.mesh.rotation.x=angle*THREE.MathUtils.smoothstep(p.y,-1.35,.7);}
}
function labelPositions(){
 const used=[];
 for(const l of [...landmarks].sort((a,b)=>(b.id===state.selected)-(a.id===state.selected))){
  const isWrist=l.index===-1,visible=state.labels&&state.layers[info[l.id].layer]&&(!state.isolate||l.id===state.selected)&&(isWrist?state.mode!=='focus'&&(state.view==='dorsal'?['ecu','tfcc'].includes(l.id):l.id!=='ecu'):l.index===state.finger&&state.mode==='focus'&&((state.view==='dorsal')===(l.id==='sagittal')));
  l.el.hidden=!visible;if(!visible)continue;
  const rig=l.id==='mc'?'fixed':['a1','a2'].includes(l.id)?'rigid':'soft';
  const q=isWrist?l.pos.toArray():bendPoint(l.pos.x,l.pos.y,l.pos.z,rig,THREE.MathUtils.degToRad(state.angle));
  if(state.exploded)q[2]+=layerZ[info[l.id].layer]*(['ecu','sagittal'].includes(l.id)?-1:1);
  const p=v(q);l.group.localToWorld(p);p.project(camera);const px=(p.x*.5+.5)*host.clientWidth,py=(-p.y*.5+.5)*host.clientHeight;
  if(p.z>1||px<0||px>host.clientWidth||py<12||py>host.clientHeight-35){l.el.hidden=true;continue;}
  const w=l.el.offsetWidth,h=l.el.offsetHeight;let x=Math.max(8,Math.min(host.clientWidth-w-8,px+(px<host.clientWidth*.45?-w-16:16))),y=py-h/2;
  for(let j=0;j<used.length+1;j++){const hit=used.find(r=>x<r.x+r.w+6&&x+w+6>r.x&&y<r.y+r.h+5&&y+h+5>r.y);if(!hit)break;y=hit.y+hit.h+5;}
  if(y>host.clientHeight-h-8){l.el.hidden=true;continue;}
  l.el.style.left=`${x}px`;l.el.style.top=`${y}px`;l.el.classList.toggle('selected',l.id===state.selected);used.push({x,y,w,h});
 }
}
for(const [id,name,color]of layerDefs){const label=document.createElement('label');label.className='layer';label.innerHTML=`<span class="swatch" style="background:${color}"></span><span class="layer-name">${name}</span><input type="checkbox" data-layer="${id}" aria-label="显示${name}">`;$('#layers').append(label);label.querySelector('input').onchange=e=>{state.layers[id]=e.target.checked;state.isolate=false;updateVisibility();};}
function filterStructures(query){
 const q=query.trim().toLowerCase();$('#structure').replaceChildren();let count=0;
 for(const [layer,name]of layerDefs){const group=document.createElement('optgroup');group.label=name;for(const d of Object.values(info).filter(d=>d.layer===layer&&`${d.name} ${d.english} ${d.id}`.toLowerCase().includes(q))){const o=document.createElement('option');o.value=d.id;o.textContent=d.name;group.append(o);count++;}if(group.children.length)$('#structure').append(group);}
 if([...$('#structure').options].some(o=>o.value===state.selected))$('#structure').value=state.selected;
 else $('#structure').selectedIndex=-1;
 $('#structure').disabled=count===0;$('#searchStatus').hidden=!q;$('#searchStatus').textContent=count?`找到 ${count} 个结构`:'没有匹配的结构，试试中文名或英文缩写。';
 $('#structureCount').textContent=`${Object.keys(info).length} 个结构`;
}
filterStructures('');$('#structureSearch').oninput=e=>filterStructures(e.target.value);
function showPanel(name){document.body.dataset.panel=name;$$('[data-panel]').filter(b=>b.tagName==='BUTTON').forEach(b=>{const active=b.dataset.panel===name;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
$$('button[data-panel]').forEach(b=>b.onclick=()=>showPanel(b.dataset.panel));
$('#toggleLabels').onclick=()=>{state.labels=!state.labels;$('#toggleLabels').setAttribute('aria-pressed',String(state.labels));};
$('#structure').onchange=e=>select(e.target.value);$('#isolate').onclick=()=>{state.isolate=!state.isolate;updateVisibility()};
$('#finger').onchange=e=>{state.finger=+e.target.value;state.mode='focus';state.isolate=false;updateVisibility();resetCamera();};
$$('#scope button').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;$$('#scope button').forEach(x=>x.classList.toggle('active',x===b));updateVisibility();resetCamera();});
$$('#hand button').forEach(b=>b.onclick=()=>{state.hand=b.dataset.hand;root.scale.x=state.hand==='left'?-1:1;$$('#hand button').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});updateVisibility();resetCamera();});
$$('#views button').forEach(b=>b.onclick=()=>resetCamera(b.dataset.view));$('#resetView').onclick=()=>resetCamera();
$('#angle').oninput=e=>{state.angle=+e.target.value;state.playing=false;$('#play').textContent='▶';$('#play').setAttribute('aria-label','播放屈伸动画');$('#angleValue').textContent=Math.round(state.angle)+'°';};
$('#play').onclick=()=>{state.playing=!state.playing;$('#play').textContent=state.playing?'Ⅱ':'▶';$('#play').setAttribute('aria-label',state.playing?'暂停屈伸动画':'播放屈伸动画');};
$('#explode').onclick=()=>{state.exploded=!state.exploded;state.playing=false;state.angle=0;$('#angle').value=0;$('#angleValue').textContent='0°';$('#play').textContent='▶';$('#play').setAttribute('aria-label','播放屈伸动画');updateVisibility();resetCamera('oblique');if(state.exploded)notice('拆解模式人为拉开各层，位置不代表真实解剖。');};
$('#capsule').onchange=e=>{state.capsule=e.target.checked;state.layers.ligament=true;updateVisibility()};$('#sheath').onchange=e=>{state.sheath=e.target.checked;state.layers.tendon=true;updateVisibility()};
function resetLayers(){Object.assign(state.layers,{skin:false,bone:true,ligament:true,muscle:true,tendon:true,neuro:true});state.capsule=state.sheath=state.isolate=false;updateVisibility();}$('#resetLayers').onclick=resetLayers;
$$('[data-preset]').forEach(b=>b.onclick=()=>{resetLayers();state.exploded=false;state.mode='focus';state.layers.skin=state.layers.neuro=state.layers.muscle=false;let p=b.dataset.preset;if(p==='joint'){state.layers.tendon=false;select('plate');resetCamera('oblique');}else if(p==='extensor'){state.layers.ligament=false;select('sagittal');resetCamera('dorsal');}else{state.layers.ligament=false;select('fds');resetCamera('palmar');}$$('#scope button').forEach(x=>x.classList.toggle('active',x.dataset.mode==='focus'));updateVisibility();});
$('#about').onclick=()=>$('#aboutDialog').showModal();$('#closeAbout').onclick=()=>$('#aboutDialog').close();$('#aboutDialog').addEventListener('click',e=>{if(e.target===$('#aboutDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
let width=0,height=0;function resize(){const w=host.clientWidth,h=host.clientHeight;if(w===width&&h===height)return;width=w;height=h;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();resetCamera();}new ResizeObserver(resize).observe(host);
function useRoute(key){const r=routes[key];state.mode=r.mode;state.angle=0;state.playing=false;state.exploded=false;$('#angle').value=0;$('#angleValue').textContent='0°';$('#play').textContent='▶';$('#play').setAttribute('aria-label','播放屈伸动画');resetLayers();select(r.ids[0]);resetCamera(r.view);$('#routeContext').hidden=false;$('#routeContext').open=true;$('#routeContext summary').textContent=r.name;$('#routeInfo').innerHTML=`<p>${r.text}</p><div class="route-chips">${r.ids.map(id=>`<button data-related="${id}">${info[id].name}</button>`).join('')}</div><a href="${sources[r.source]}" target="_blank" rel="noopener">阅读依据</a>`;$$('[data-related]').forEach(b=>b.onclick=()=>{select(b.dataset.related);resetCamera(r.view)});$$('[data-route]').forEach(b=>{const active=b.dataset.route===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
$$('[data-route]').forEach(b=>{b.setAttribute('aria-pressed','false');b.onclick=()=>useRoute(b.dataset.route);});
select('tfcc');resize();
let clock=0,prev=performance.now();function frame(now){requestAnimationFrame(frame);const delta=Math.min(.1,(now-prev)/1000);prev=now;if(state.playing){clock+=delta;state.angle=(1-Math.cos(clock*1.05))*32.5;$('#angle').value=state.angle;$('#angleValue').textContent=Math.round(state.angle)+'°';}deform();controls.update();root.updateMatrixWorld(true);labelPositions();renderer.render(scene,camera);}requestAnimationFrame(frame);
// Exposed only for deterministic local acceptance and linking educational exam diagrams.
window.handAtlas={state,select,resetCamera,updateVisibility,resetLayers,scene,renderer,camera,all,fingers,root,notice};

const careRegion=new URLSearchParams(location.search).get('region');if(careRegion==='finger'){state.mode='focus';select('a2');resetCamera('palmar');updateVisibility();}else if(careRegion==='palm'){useRoute('palm');}else if(careRegion==='wrist'){useRoute('ulnar');}
