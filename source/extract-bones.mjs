import fs from 'node:fs';
import * as T from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
globalThis.window={URL,innerWidth:1200,innerHeight:800};
T.TextureLoader.prototype.load=function(){return new T.Texture()};
const b=fs.readFileSync(process.argv[2] || new URL('./skeleton.fbx',import.meta.url));
const root=new FBXLoader().parse(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');root.updateMatrixWorld(true);
const out={}; const ord=['first','second','third','fourth','fifth'];
root.traverse(o=>{
 if(!o.isMesh || !(/^(First|Second|Third|Fourth|Fifth)_metacarpal_boner$/.test(o.name)||/^(Proximal|Middle|Distal)_phalanx_of_\w+_finger_of_handr$/.test(o.name)))return;
 let g=o.geometry.clone().applyMatrix4(o.matrixWorld);g.deleteAttribute('normal');g.deleteAttribute('uv');g=mergeVertices(g,0.0001);g.computeBoundingBox();
 const pos=g.attributes.position;const lo=g.boundingBox.min.y,hi=g.boundingBox.max.y;const near=new T.Vector3(),far=new T.Vector3();let n=0,m=0;
 for(let i=0;i<pos.count;i++){let p=new T.Vector3().fromBufferAttribute(pos,i);if(p.y>hi-(hi-lo)*.14){near.add(p);n++}if(p.y<lo+(hi-lo)*.14){far.add(p);m++}}
 near.divideScalar(n);far.divideScalar(m);const ey=far.clone().sub(near).normalize(),ex=new T.Vector3().crossVectors(ey,new T.Vector3(0,0,1)).normalize(),ez=new T.Vector3().crossVectors(ex,ey).normalize();
 const arr=[];for(let i=0;i<pos.count;i++){const p=new T.Vector3().fromBufferAttribute(pos,i).sub(near);arr.push(p.dot(ex),p.dot(ey),p.dot(ez))}
 const ys=arr.filter((_,i)=>i%3===1),ymin=Math.min(...ys),ymax=Math.max(...ys),len=ymax-ymin;
 const xs=arr.filter((_,i)=>i%3===0),zs=arr.filter((_,i)=>i%3===2),cx=(Math.max(...xs)+Math.min(...xs))/2,cz=(Math.max(...zs)+Math.min(...zs))/2;
 for(let i=0;i<arr.length;i+=3){arr[i]=(arr[i]-cx)/len;arr[i+1]=(arr[i+1]-ymin)/len;arr[i+2]=(arr[i+2]-cz)/len;}
 const name=o.name.toLowerCase();const digit=ord.findIndex(v=>name.includes(v))+1;const part=name.includes('metacarpal')?'mc':name.split('_')[0];
 out[`${digit}_${part}`]={p:arr.map(v=>+v.toFixed(5)),i:Array.from(g.index.array),source:o.name};
});
fs.writeFileSync(new URL('./bones.json',import.meta.url),JSON.stringify(out));console.log(Object.keys(out));
