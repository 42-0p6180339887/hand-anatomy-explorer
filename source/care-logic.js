export const SCHEMA=2;
export const regions={finger:'手指',wrist:'手腕',palm:'手掌',shoulder:'肩',elbow:'肘',back:'腰背',hip:'髋 / 大腿',knee:'膝',ankle:'踝 / 足',head:'头 / 颈',other:'其他'};
export const flags={deform:'明显变形 / 开放伤口可见骨',vascular:'受伤后发蓝、发冷或新发麻木',neuro:'撞头后意识、平衡异常 / 抽搐 / 新发无力',spine:'腰背痛伴会阴麻木或大小便异常',highfall:'高处坠落（超过约 1 米）并撞头 / 严重事故',headsym:'撞头后头晕、呕吐或其他不适',loss:'无法正常活动 / 手指不能主动屈伸 / 不能走几步',pop:'受伤时响声并伴疼痛或无力',swelling:'明显或加重的肿胀、淤青',fever:'局部红热伴发热或全身不适'};
export const sources={assh:['ASSH · 攀岩损伤','https://assh.my.site.com/handcare/condition/rock-climbing-injuries'],sprain:['NHS · 扭伤与拉伤','https://www.nhs.uk/conditions/sprains-and-strains/'],head:['NHS · 头部损伤','https://www.nhs.uk/conditions/head-injury-and-concussion/'],back:['NHS · 腰背痛','https://www.nhs.uk/conditions/back-pain/'],youth:['BMC · 青少年骨骺应力损伤','https://www.thebmc.co.uk/en/growth-plate-stress-fractures-in-teenage-climbers'],wrist:['Schöffl 等，2023 · 攀岩者腕部损伤病例系列','https://pubmed.ncbi.nlm.nih.gov/37800447/'],risk:['Quarmby 等，2023 · 过度使用伤系统综述','https://pubmed.ncbi.nlm.nih.gov/38162697/']};
export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function dayDiff(a,b){return Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);}
export function emptyData(){return {schema:SCHEMA,episodes:[],sessions:[]};}
export function latest(e){return [...e.checks].sort((a,b)=>b.date.localeCompare(a.date)||b.at-a.at)[0];}
export function assess(e,now=today()){
 const reference=['finger','palm','shoulder','elbow'].includes(e.region)?'assh':e.region==='wrist'?'wrist':e.region==='back'?'back':e.region==='head'?'head':'sprain';
 const c=latest(e), f=c?.flags||[], emergency=['deform','vascular','neuro','spine','highfall'].filter(k=>f.includes(k));
 if(emergency.length)return {level:3,title:'立即寻求急诊帮助',reasons:emergency.map(k=>flags[k]),action:'停止攀爬，寻求现场协助；严重时联系当地急救（中国大陆 120）。不要继续用负荷测试伤处。',refs:['sprain','head','back']};
 const urgent=['headsym','loss','pop','swelling','fever'].filter(k=>f.includes(k));
 if(urgent.length)return {level:2,title:'停止受累活动，尽快就医',reasons:urgent.map(k=>flags[k]),action:'建议当天联系急诊、骨科或运动医学评估；无法正常使用或活动时不要等到下次训练。',refs:['assh','sprain','head']};
 if(e.age==='under18'&&e.region==='finger')return {level:2,title:'青少年手指痛需专业评估',reasons:['未满 18 岁且记录了手指症状，需排查生长板问题'],action:'暂停给疼痛手指加载，及时告知监护人 / 教练并就医；不要按成人滑车伤自行处理。',refs:['youth']};
 if(c&&(c.rest>=7||c.during>=7))return {level:2,title:'较强疼痛需要及时评估',reasons:['自报疼痛达到 7/10 或以上'],action:'停止诱发疼痛的活动，尽快寻求医疗评估。7/10 是本工具的保守提醒阈值，不代表损伤分级。',refs:['sprain']};
 if(c&&(c.trend==='worse'||c.function==='limited'))return {level:1,title:'先减少刺激，安排评估',reasons:[c.trend==='worse'?'比上次更痛或更不舒服':'日常功能受到影响'],action:'不增加刺激伤处的负荷。症状持续、反复或功能下降时，联系运动医学 / 康复专业人员。',refs:['sprain','assh']};
 return {level:0,title:'继续观察，不代表已恢复',reasons:[c?`最近记录：${c.date}${dayDiff(now,c.date)>2?'（需要更新）':''}`:'尚无复查'],action:'记录症状和日常功能变化；疼痛持续、反复或自己担心时就医。没有触发提醒也不能排除损伤。',refs:[reference]};
}
export function weekly(sessions,now=today()){
 return Array.from({length:4},(_,i)=>{const min=(3-i)*7,max=min+6;const rows=sessions.filter(s=>{const n=dayDiff(now,s.date);return n>=min&&n<=max});return {label:i===3?'近 7 天':`${min+1}–${max+1} 天前`,count:rows.length,load:rows.reduce((n,s)=>n+s.minutes*s.rpe,0),minutes:rows.reduce((n,s)=>n+s.minutes,0)};});
}
export function due(s,now=today()){return s.review===null&&dayDiff(now,s.date)>=1;}
const str=(v,max=2000)=>typeof v==='string'&&v.length<=max;
const num=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
export function validDate(v){return str(v,10)&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v+'T12:00:00Z'))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v&&v<=today();}
export function validateData(d){
 if(!d||d.schema!==SCHEMA||!Array.isArray(d.episodes)||!Array.isArray(d.sessions)||d.episodes.length>1000||d.sessions.length>5000)throw Error('不是兼容的指间备份，或记录数量超出限制。');
 const ids=new Set();const checkId=o=>{if(!str(o.id,100)||!/^[-a-zA-Z0-9_]+$/.test(o.id)||ids.has(o.id))throw Error('记录编号缺失或重复。');ids.add(o.id);};
 for(const e of d.episodes){checkId(e);if(!Object.hasOwn(regions,e.region)||!['left','right','both','middle'].includes(e.side)||!['adult','under18','unknown'].includes(e.age)||!validDate(e.date)||typeof e.closed!=='boolean'||!str(e.detail,100)||!str(e.trigger,100)||!str(e.notes)||!str(e.plan,4000)||!Array.isArray(e.checks)||!e.checks.length||e.checks.length>2000)throw Error('伤情记录格式不正确。');for(const c of e.checks)if(!validDate(c.date)||c.date<e.date||!num(c.at,0,1e16)||!num(c.rest,0,10)||!num(c.during,0,10)||!['normal','limited'].includes(c.function)||!['same','better','worse'].includes(c.trend)||!str(c.note)||!Array.isArray(c.flags)||c.flags.some(f=>!Object.hasOwn(flags,f)))throw Error('复查记录格式不正确。');}
 const eids=new Set(d.episodes.map(e=>e.id));
 for(const s of d.sessions){checkId(s);if(!validDate(s.date)||!num(s.minutes,1,1440)||!num(s.rpe,0,10)||!str(s.type,100)||!str(s.grade,100)||!str(s.terrain,100)||!str(s.notes)||!str(s.hang,200)||!num(s.attempts,0,1000)||!Array.isArray(s.grips)||s.grips.some(x=>!str(x,100))||!Array.isArray(s.episodes)||s.episodes.some(id=>!eids.has(id))||!(s.review===null||(s.review&&validDate(s.review.date)&&s.review.date>s.date&&['better','same','worse'].includes(s.review.trend)&&str(s.review.note))))throw Error('训练记录格式不正确。');}
 return d;
}
