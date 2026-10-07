import * as T from 'three';
import bones from './wrist-bones.json';
export function createWrist({root,add,smoothGeometry,subdivide,ellipsoid,sweep,sheet}){
 const g=new T.Group();root.add(g);g.name='Wrist and palm';
 const rows=[['Scaphoid','scaphoid',[-1.95,-8.25,0],[2.1,1.7,1.3]],['Lunate','lunate',[-.25,-8.7,-.15],[1.5,1.3,1.25]],['Triquetrum','triquetrum',[1.27,-8.35,0],[1.25,1.45,1.25]],['Pisiform','pisiform',[1.55,-8.35,1.15],[.8,1.1,.8]],['Trapezium','trapezium',[-2.85,-6.6,.1],[1.45,1.7,1.25]],['Trapezoid','trapezoid',[-1.55,-6.55,-.05],[1.05,1.3,1.2]],['Capitate','capitate',[-.15,-6.85,-.1],[1.55,2,1.45]],['Hamate','hamate',[1.43,-6.8,.05],[1.6,1.8,1.7]]];
 for(const [name,id,pos,size]of rows){const b=bones[name+'_boner'];let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(b.p,3));geo.setIndex(b.i);geo.scale(...size);geo.translate(...pos);add(subdivide(smoothGeometry(geo)),id,g,'fixed');}
 const path=(id,pts,rx=.15,rz=.11)=>add(sweep(pts,rx,rz,()=>1,40,12),id,g,'fixed');
 const oval=(id,p,s)=>ellipsoid(p,s,id,g,'fixed');
 path('hamate',[[1.7,-7.25,.45],[1.55,-7.25,1],[1.2,-7.05,1.6],[.95,-6.95,1.55]],.19,.19);
 add(sweep([[-1.8,-14.2,-.15],[-1.7,-12.1,-.15],[-1.1,-10.2,-.15]],1.15,.66,t=>.63+.37*t,40,24),'radius',g,'fixed');oval('radius',[-1.08,-9.75,-.1],[1.6,.48,.85]);
 add(sweep([[1.53,-14.2,-.3],[1.52,-12.2,-.3],[1.6,-10.35,-.3]],.62,.55,t=>.6+.4*t,40,24),'ulna',g,'fixed');oval('ulna',[1.65,-10.05,-.27],[.7,.62,.62]);oval('ulna',[1.92,-9.62,-.22],[.17,.48,.2]);
 add(sheet((u,t)=>[.25+u*2,-9.32+.16*Math.sin(u*Math.PI),-.65+t*1.5]),'tfcc',g,'fixed');
 for(const z of [-.65,.8])path('tfcc',[[.2,-9.48,z],[1.1,-9.52,z],[1.8,-9.7,z*.5]],.09,.08);
 path('sl',[[-1.22,-8.25,-.62],[-.92,-8.32,-.8],[-.55,-8.45,-.65]],.16,.09);
 add(sheet((u,t)=>[-2.9+u*4.55,-8.6+t*2.3,1.1+.8*Math.sin(Math.PI*u)]),'retinaculum',g,'fixed');
 const xs=[-2.8,-.95,.95,2.6],ys=[0,.4,.15,-.8],sc=[.94,1.04,1,.8],rot=[-.055,-.015,.015,.055];
 for(let i=0;i<4;i++)for(const [id,z]of [['fds',.97],['fdp',.59]]){const y=-5.8,x=-xs[i]*.25*T.MathUtils.smoothstep(-y,0,6),c=Math.cos(rot[i]),s=Math.sin(rot[i]);const end=[xs[i]+sc[i]*(x*c-y*s),ys[i]+sc[i]*(x*s+y*c),z*sc[i]],w=(i-1.5)*.51;path(id,[[w,-13.5,z],[w,-9.5,z],[w,-7.5,z],end],.16,.10);}
 const paths={
 fpl:[[-1.2,-13.5,.63],[-1.2,-8.7,.65],[-2.3,-6.2,.82],[-4.4,-3.8,1],[-7.3,.3,.7]],
 fcr:[[-2.65,-13.4,1],[-2.7,-8.7,1.03],[-2.5,-6.7,.87],[-2.16,-5.6,.48]],
 fcu:[[2.5,-13.4,.85],[2.1,-10.6,.98],[1.58,-8.42,1.55]],
 ecu:[[2.37,-13.4,-.75],[2.3,-10.1,-.88],[2.14,-8.15,-.9],[2.05,-5.56,-.55]],
 median:[[-.6,-13.5,1.27],[-.65,-9.1,1.45],[-.62,-7,1.5],[-.85,-4.9,1.35]],
 ulnarnerve:[[2.55,-13.5,1.34],[2.45,-9.2,1.52],[2.05,-7.6,1.72],[1.6,-6.7,1.7],[2.35,-4.5,1.2]]};
 for(const [id,p]of Object.entries(paths))path(id,p,['median','ulnarnerve'].includes(id)?.085:.19,['median','ulnarnerve'].includes(id)?.08:.12);
 add(sheet((u,t)=>[2.28+.39*Math.cos(u*Math.PI),-10.6+t*1.35,-.56-.57*Math.sin(u*Math.PI)]),'ecusheath',g,'fixed');
 for(let i=0;i<2;i++)path('ecr',[[-2.4+i*.55,-13.4,-.85],[-2.25+i*.6,-9.2,-.93],[-2.12+i*1.35,-5.6,-.65]],.16,.1);
 for(const x of [-2,-.7,.65])path('median',[[-.85,-4.9,1.35],[x,-3.3,1.2],[x,-1.9,1.05]],.047,.045);
 path('ulnarnerve',[[1.6,-6.7,1.7],[1.32,-6.3,.7],[.7,-5.1,.4],[-1.6,-3.5,.5]],.06,.05);
 oval('guyon',[2.02,-7.9,1.48],[.64,1.32,.45]);
 const muscle=(id,p,w,d)=>add(sweep(p,w,d,t=>.12+.88*Math.pow(Math.sin(Math.PI*t),.7),40,16),id,g,'fixed');
 muscle('thenar',[[-2.65,-7,1.05],[-3.5,-5,1.25],[-4.3,-3,1.18],[-5.65,-2.5,.8]],.65,.35);
 muscle('thenar',[[-2.6,-6.5,.72],[-3.7,-4.7,.87],[-4.1,-2.9,.65]],.38,.25);
 muscle('hypothenar',[[1.7,-8.1,1.28],[2.8,-5.8,1.16],[3.18,-3.2,.92],[2.6,-.8,.5]],.53,.34);
 muscle('adductor',[[-.2,-5.9,.35],[-2.5,-4,.6],[-5.8,-2.2,.5]],.44,.24);
 muscle('adductor',[[.2,-2.7,.35],[-2.6,-2.5,.55],[-5.8,-2.2,.5]],.45,.24);
 add(sheet((u,t)=>[(u*2-1)*(.45+t*2.5),-6.7+t*5.5,1.78-.15*t]),'aponeurosis',g,'fixed');
 oval('skin',[-.5,-9.7,.3],[3.3,4.7,1.7]);return g;
}
