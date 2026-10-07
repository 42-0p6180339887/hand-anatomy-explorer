export const wristExams=[
 {id:'fovea',name:'尺骨窝征',en:'Ulnar fovea sign',region:'尺侧腕 · 窝部触诊',structure:'tfcc',mode:'wrist',purpose:'理解尺侧腕部的定位触诊，以及它与 TFCC 窝部附着、尺三角韧带的关系。',steps:[['区分标志','检查者辨认尺骨茎突、尺骨头掌面、FCU 腱和豌豆骨之间的软组织间隙。'],['支持腕部','前臂与手受到支撑，检查者以指腹定位该间隙。图中触点是解剖概念，不能用于自己精确按压定位。'],['评估压痛','检查者适当触诊，询问是否再现熟悉的局部疼痛，并与对侧比较；不追求按得越痛越准确。'],['综合判断','压痛可增加对局部结构问题的怀疑，再结合稳定性评估及必要影像。单凭阳性不能确诊 TFCC 撕裂。']],observe:'关注局部、可重复且与主诉一致的疼痛，并记录邻近区域是否也痛。',limit:'该征最初研究针对窝部附着或尺三角韧带病变；并不覆盖所有 TFCC 损伤，也不能单独排除其他尺侧腕病因。',source:'https://www.sciencedirect.com/science/article/pii/S0363502307001748',sourceTitle:'Tay 等，2007 · Ulnar fovea sign',kind:'fovea'},
 {id:'ecu',name:'ECU 协同试验',en:'Extensor carpi ulnaris synergy test',region:'腕背尺侧 · ECU 腱',structure:'ecu',mode:'wrist',purpose:'理解拇指对抗动作如何伴随 ECU 等长收缩，帮助检查腕背尺侧肌腱。',steps:[['前臂旋后','受检者屈肘约 90°，前臂获得支撑并旋后，掌心朝上；腕保持中立位。'],['定位肌腱','检查者在尺骨远端背尺侧触及 ECU 腱，另一处接触用于对拇指提供阻力。'],['协同收缩','拇指尝试向桡侧外展，检查者给予适当阻力；腕不主动大幅偏转。图中箭头表示对抗关系，不表示力值。'],['解释疼痛','观察是否再现 ECU 走行区疼痛。结合其他检查，必要时用动态超声观察腱与腱下鞘。']],observe:'阳性线索是腕背尺侧 ECU 区域的疼痛，不是拇指本身用力的感觉。',limit:'协同试验用于辅助评估 ECU 腱病；不能单独确诊脱位、腱下鞘撕裂，也不能排除同时存在的关节内病变。',source:'https://pubmed.ncbi.nlm.nih.gov/19084177/',sourceTitle:'Ruland & Hogan，2008 · 原始试验研究',extra:'https://pubmed.ncbi.nlm.nih.gov/34602128/',extraTitle:'ECU subluxation · 动作图与腱下鞘',kind:'ecu'},
 {id:'lumbrical',name:'蚓状肌应力检查',en:'Lumbrical stress examination',region:'掌心 · 分指牵拉',structure:'lumbrical',mode:'palm',purpose:'结合攀岩洞点，理解相邻手指位置不一致时的肌腱差动与蚓状肌牵拉。',steps:[['询问受伤动作','关注是否在单/双指受力、相邻手指一屈一伸后出现掌部疼痛。图示以无名指与中指为例。'],['分别改变指位','在临床控制下，受检者尝试握拳时，检查者使无名指被动伸展，观察掌部是否出现熟悉疼痛。'],['相邻手指同步','随后同时伸展相邻中指，比较疼痛是否减少；相邻 FDP 腱位置差减少，可改变第三蚓状肌的牵拉。'],['结合影像','检查结果应与压痛位置、超声或必要的 MRI 结合，以区别屈肌腱、滑车等问题。']],observe:'比较分指与相邻指同步两种情况下的掌部疼痛；图中红色束表示受牵拉概念，不表示已经撕裂。',limit:'相关病例系列以阳性检查筛入，不能据此估计对所有攀岩者的诊断准确率。不要用悬挂、指力板或加重反复自测。',source:'https://d-nb.info/1209741490/34',sourceTitle:'Lutter 等，2018 · 60 例病例系列与检查图',kind:'lumbrical'}
];
export function drawWristExam(kind,s,t){const a=(1-Math.cos(t*Math.PI*2))/2;let c='';
 const tx=(x,y,v,col='#a4bcc2',sz=13)=>`<text x="${x}" y="${y}" fill="${col}" font-size="${sz}" font-family="Microsoft YaHei,sans-serif">${v}</text>`;
 const ar=(x,y,xx,yy,col='#8cd4c6')=>`<path d="M${x} ${y} L${xx} ${yy}" stroke="${col}" stroke-width="3" marker-end="url(#${col==='#e7bc7f'?'gold':'arrow'})"/>`;
 if(kind==='lumbrical'){
  c+=tx(25,30,'差动示意 · 展开的腱路，不是手部真实侧面');
  const shift=s===1?25+a*30:0;
  c+=`<path d="M150 280 L150 115 L${s>=2?150:185} 67 M300 280 L300 ${115+shift} L${s>=1?300:335} ${67+shift}" fill="none" stroke="#dfad82" stroke-width="14" stroke-linejoin="round"/><path d="M150 220 Q220 ${150+shift/2} 300 ${220+shift}" fill="none" stroke="${s===1?'#e99076':'#83c3ae'}" stroke-width="12"/>`;
  c+=tx(112,325,'中指 FDP')+tx(268,325,'无名指 FDP')+tx(337,211,'双起点蚓状肌','#ddb78f',12);
  if(s===1)c+=ar(365,180,365,100)+tx(374,139,'被动伸展',undefined,11);
  if(s>=2)c+=ar(112,175,112,100)+ar(350,175,350,100)+tx(195,53,'相邻指同步', '#96ccba');
 }else if(kind==='fovea'){
  c+=tx(25,30,'尺侧掌面局部 · 方位与触点为概括');
  c+=`<rect x="180" y="213" width="78" height="124" rx="28" fill="url(#bone)"/><ellipse cx="220" cy="211" rx="46" ry="28" fill="url(#bone)"/><ellipse cx="178" cy="175" rx="13" ry="27" fill="url(#bone)"/><ellipse cx="324" cy="114" rx="26" ry="32" fill="url(#bone)"/><path d="M346 329 Q342 220 327 143" stroke="#dfad82" stroke-width="15" fill="none"/>`;
  c+=tx(89,165,'尺骨茎突')+tx(295,65,'豌豆骨')+tx(363,256,'FCU 腱')+tx(181,294,'尺骨头','#263c43',12);
  c+=`<circle cx="265" cy="167" r="23" fill="#7bb4a0" fill-opacity=".25" stroke="#7bb4a0" stroke-dasharray="4 4"/>`;
  if(s>=1)c+=`<ellipse cx="${265+(s===2?a*7:0)}" cy="158" rx="15" ry="20" fill="#e3c291" fill-opacity=".6"/>`;
  if(s>=2)c+=ar(398,133,292,162)+tx(360,105,'指腹触诊');
 }else{
  c+=tx(25,30,'掌心向上 · 腕中立；ECU 位于背尺侧');
  c+=`<path d="M244 331 L236 224 Q197 216 178 174 L127 134 Q110 111 130 104 L206 137 L206 73 Q216 56 228 76 L239 121 L244 61 Q256 45 267 68 L272 118 L286 74 Q302 63 307 85 L304 132 L322 102 Q342 92 343 119 L328 187 Q320 214 299 223 L302 331 Z" fill="#243c42" stroke="#9fb4b4" stroke-width="2"/><path d="M306 329 L302 220 L320 188" stroke="#deaf80" stroke-width="9" stroke-dasharray="8 5" fill="none"/>`;
  c+=tx(360,288,'ECU（背侧投影）','#e1bc86',11);
  if(s>=1)c+=`<ellipse cx="305" cy="257" rx="18" ry="26" fill="#83c7b5" fill-opacity=".3" stroke="#83c7b5"/>`;
  if(s>=2)c+=ar(130,97,83-a*7,81,'#e7bc7f')+ar(54,132,110,143)+tx(25,187,'拇指外展 / 检查者阻力',undefined,11);
  c+=tx(35,314,'肘约 90°，前臂支撑（肘未绘）',undefined,11);
 }
 return c;
}
