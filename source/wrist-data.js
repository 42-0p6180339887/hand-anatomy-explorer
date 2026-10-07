export const wristSources={w1:'https://assh.my.site.com/handcare/safety/bones',w2:'https://assh.my.site.com/handcare/condition/carpal-tunnel-syndrome',w3:'https://pmc.ncbi.nlm.nih.gov/articles/PMC10508329/',w4:'https://pubmed.ncbi.nlm.nih.gov/37800447/',w5:'https://d-nb.info/1209741490/34',w6:'https://pubmed.ncbi.nlm.nih.gov/34602128/',w7:'https://pubmed.ncbi.nlm.nih.gov/17398352/',w8:'https://www.assh.org/annualmeeting/servlet/servlet.FileDownload?file=00P0a00000mN3NGEA0'};
const rows={
 radius:['桡骨远端','Distal radius','bone','腕关节在拇指侧主要由桡骨承接。','腕近端的桡侧（拇指侧）。','与舟骨、月骨及尺骨远端相邻。','承接手部载荷，参与腕关节与前臂旋转。','仅示意远端轮廓；不是原始骨网格。','w1'],
 ulna:['尺骨远端','Distal ulna','bone','小指侧可摸到的腕部骨性标志之一。','腕近端尺侧。','与桡骨构成远侧桡尺关节；与近排腕骨间隔着 TFCC。','参与前臂旋转与尺侧稳定。','不模拟远侧桡尺关节运动。','w8'],
 scaphoid:['舟骨','Scaphoid','bone','跨接近、远两排腕骨的桡侧骨。','近排腕骨桡侧；靠近拇指。','邻接桡骨、月骨、大/小多角骨和头状骨。','参与腕骨间的运动协调与传力。','骨网格经缩放重排；不适合判断骨折线。','w1'],
 lunate:['月骨','Lunate','bone','位于近排中部，是尺侧腕痛鉴别中可能涉及的骨。','舟骨与三角骨之间。','近侧接桡骨；远侧邻头状骨。','随近排腕骨协调运动。','不可通过本图推断骨髓水肿或撞击。','w1'],
 triquetrum:['三角骨','Triquetrum','bone','近排腕骨的尺侧组成部分。','月骨尺侧，豌豆骨的背侧。','邻接月骨、钩骨和豌豆骨。','参与尺侧腕部稳定和载荷传递。','关节关系与间隙被简化。','w1'],
 pisiform:['豌豆骨','Pisiform','bone','位于掌根尺侧，是尺侧腕屈肌腱的附着标志。','三角骨掌侧；Guyon 管尺侧边界附近。','嵌于 FCU 腱内，与三角骨形成关节。','提供肌腱力臂及掌根定位标志。','体表按压不能据此确定病因。','w1'],
 trapezium:['大多角骨','Trapezium','bone','拇指掌骨的近端支点。','远排腕骨最桡侧。','邻舟骨、小多角骨与第一掌骨。','其拇指腕掌关节参与对掌。','本版不模拟鞍状关节运动。','w1'],
 trapezoid:['小多角骨','Trapezoid','bone','连接食指掌骨的腕骨。','大多角骨与头状骨之间。','邻第二掌骨基底与舟骨。','构成较稳定的腕掌连接。','骨间间隙为示意。','w1'],
 capitate:['头状骨','Capitate','bone','位于腕骨中央、体积较大的腕骨。','远排中部，第三掌骨近端。','与月骨、舟骨及相邻远排腕骨相接。','作为腕中央传力结构之一。','非精确运动轴或受力模拟。','w1'],
 hamate:['钩骨与钩骨钩','Hamate & hook','bone','掌根尺侧的钩状突起，靠近屈肌腱和尺神经通道。','远排尺侧，第四/第五掌骨近端。','钩骨钩参与腕横韧带附着及 Guyon 管边界。','构成骨性支撑，并影响邻近肌腱通道。','钩状突出为放大示意；不是精确触诊点。','w8'],
 tfcc:['三角纤维软骨复合体','TFCC','ligament','尺侧腕部的一组稳定结构，不是孤立的一片“软骨垫”。','尺骨远端与尺侧腕骨之间。','包含关节盘、桡尺韧带等结构，连于桡骨与尺骨区域。','参与远侧桡尺关节稳定与载荷传递。','本图仅画关节盘及代表性连接；尺侧痛不等于 TFCC 撕裂。','w8'],
 sl:['舟月骨间韧带','Scapholunate ligament','ligament','连接舟骨和月骨，帮助两骨协同运动。','舟骨与月骨之间。','包括背侧、掌侧及近端膜性部分。','稳定舟月关系。','只显示背侧代表束；不模拟不稳定。','w8'],
 retinaculum:['腕横韧带 / 屈肌支持带','Transverse carpal ligament','ligament','构成腕管的掌侧顶盖。','位于屈肌腱和正中神经的掌侧。','桡侧接舟骨/大多角骨区域，尺侧接豌豆骨/钩骨钩区域。','约束腕管内肌腱走行。','半透明网片用于看清下方内容，非真实厚度。','w2'],
 median:['正中神经（腕管段）','Median nerve','neuro','与九条屈肌腱共同通过腕管。','屈肌支持带深面、屈肌腱的掌侧。','远端分支向拇指、食指、中指及无名指桡侧等区域。','传递感觉，并支配部分鱼际肌。','仅画主干与代表分支；不以麻木分布单独定位卡压。','w2'],
 ulnarnerve:['尺神经（Guyon 管段）','Ulnar nerve at Guyon canal','neuro','从豌豆骨与钩骨钩附近入掌，走在腕管外。','掌根尺侧，屈肌支持带表浅区域。','分浅支、深支；深支绕钩骨钩附近进入掌深部。','参与小指/无名指尺侧感觉与多种手内在肌控制。','只画主干与代表性深支；肘部或更近端病变也可有类似症状。','w8'],
 guyon:['Guyon 管（空间示意）','Ulnar tunnel / Guyon canal','ligament','这是尺神经和尺动脉经过的通道，位置与腕管不同。','豌豆骨桡侧至钩骨钩附近的掌根。','由周围骨、韧带与筋膜共同围成。','容纳尺神经血管。','透明包络代表空间，不代表一条独立实体韧带。','w8'],
 fpl:['拇长屈肌腱','Flexor pollicis longus · FPL','tendon','腕管中的第九条屈肌腱，走向拇指。','腕管桡侧，向拇指掌侧延伸。','来自前臂，止于拇指远节指骨。','屈曲拇指指间关节。','路径概括表示；未建拇指完整滑车和腱鞘。','w2'],
 fcr:['桡侧腕屈肌腱','Flexor carpi radialis · FCR','tendon','在腕掌侧偏桡侧走行，经过自己的骨纤维通道。','腕管的桡侧附近。','主要止于第二掌骨基底，并可有第三掌骨附着。','参与屈腕与桡偏。','不属于腕管内九条屈肌腱。','w8'],
 fcu:['尺侧腕屈肌腱','Flexor carpi ulnaris · FCU','tendon','沿腕掌侧尺缘，止于豌豆骨。','掌根尺侧。','经豌豆骨及延续韧带连向钩骨/第五掌骨区域。','参与屈腕与尺偏。','不是 ECU；两者分别位于掌侧和背侧。','w8'],
 ecu:['尺侧腕伸肌腱','Extensor carpi ulnaris · ECU','tendon','尺侧腕背面的肌腱，是运动相关尺侧痛的重要相关结构。','经过尺骨远端背侧的第六伸肌腱间室。','止于第五掌骨基底。','参与伸腕与尺偏，并受腱下鞘稳定。','不能靠疼痛或一次弹响确诊腱病/脱位。','w6'],
 ecusheath:['ECU 腱下鞘','ECU subsheath','ligament','将 ECU 保持在尺骨远端沟内。','第六伸肌腱间室，ECU 腱周围。','与尺骨沟附近组织相连。','限制肌腱不适当移位。','仅画局部约束带；不模拟脱位或撕裂。','w6'],
 ecr:['桡侧腕伸肌腱组','ECRL / ECRB','tendon','位于腕背侧桡侧的两条伸腕肌腱。','第二伸肌腱间室附近。','分别止于第二、第三掌骨基底背侧。','参与伸腕与桡偏，帮助握持时稳定腕位。','两条路径示意，未画全部背侧六间室。','w8'],
 thenar:['鱼际肌群','Thenar muscle group','muscle','拇指根部的肌群，参与捏握与对掌。','掌侧桡缘，第一掌骨周围。','概括表示拇短展、拇短屈与拇对掌肌。','协调拇指外展、屈曲和对掌。','合并为肌群；不显示逐肌纤维和独立运动。','w3'],
 hypothenar:['小鱼际肌群','Hypothenar muscle group','muscle','沿小指侧形成掌部隆起。','第五掌骨掌侧及尺侧。','起于豌豆骨、钩骨钩等区域，连向第五掌骨及小指。','参与小指外展、屈曲与对掌。','合并示意，不作逐肌诊断定位。','w3'],
 adductor:['拇收肌','Adductor pollicis','muscle','位于掌深部，参与拇指向食指方向的夹持。','鱼际深面与第一掌骨间隙附近。','两头来自中央掌骨/腕骨区域，止于拇指近节指骨尺侧。','参与拇指内收和捏握。','两头简化为代表肌束，未表示籽骨细节。','w3'],
 aponeurosis:['掌腱膜','Palmar aponeurosis','ligament','手掌中央浅层的扇形纤维组织。','皮下，屈肌腱与神经血管的掌侧。','近端聚拢，远端分束伸向指根与纤维鞘区域。','保护深部组织并稳定掌部皮肤。','透明薄片示意，不代表病变或厚度。','w3']
};
export const wristInfo=Object.fromEntries(Object.entries(rows).map(([id,r])=>[id,{id,name:r[0],english:r[1],layer:r[2],lead:r[3],location:r[4],attachment:r[5],function:r[6],limit:r[7],source:r[8],region:['thenar','hypothenar','adductor','aponeurosis'].includes(id)?'palm':'wrist'}]));
export const routes={
 climbing:{name:'攀岩 · 抓点与分指',mode:'palm',view:'palmar',ids:['lumbrical','fdp','a2','interossei','tfcc'],text:'单/双指洞点、相邻手指屈伸不同步时，关注蚓状肌与屈肌腱的关系；抓点还涉及滑车、指关节和腕部。此入口展示相关结构，不判断哪一个已经受伤。',source:'w5'},
 bar:{name:'健身 · 握杠与捏握',mode:'palm',view:'palmar',ids:['hamate','hypothenar','ulnarnerve','thenar','adductor','fds'],text:'看掌根接触区、手内在肌和屈肌腱。钩骨钩邻近环小指屈肌腱与尺神经；接触点疼痛、深部痛与麻木需分别描述。',source:'w8'},
 support:{name:'健身 · 撑地与背伸',mode:'wrist',view:'dorsal',ids:['sl','radius','scaphoid','tfcc','ecu'],text:'撑地时腕背伸并承重，相关结构包括腕骨、关节囊和韧带。图中不模拟压力大小；背侧痛还可能涉及囊肿、滑膜或肌腱，不能凭动作定位唯一病因。',source:'w4'},
 ulnar:{name:'位置 · 小指侧腕痛',mode:'wrist',view:'oblique',ids:['tfcc','ecu','ecusheath','hamate','fcu','pisiform'],text:'区分腕背尺侧、尺骨茎突旁与掌根尺侧。TFCC、ECU、豌豆骨/FCU、钩骨，以及尺腕撞击或滑膜问题都可能相关。',source:'w4'},
 radial:{name:'位置 · 拇指侧腕痛',mode:'wrist',view:'palmar',ids:['scaphoid','trapezium','fcr','thenar'],text:'观察舟骨、大多角骨与 FCR 的位置。本版未建第一伸肌腱间室 APL/EPB；桡侧痛还需考虑该处腱鞘、拇指腕掌关节等，目录不是全部鉴别诊断。',source:'w1'},
 palm:{name:'位置 · 掌心 / 掌根',mode:'palm',view:'palmar',ids:['aponeurosis','lumbrical','fdp','median','ulnarnerve','guyon'],text:'区分指根、掌心和掌根；深部牵拉痛与麻木是不同线索。通过芯片切换相关结构，配合“只看所选结构”理解层次。',source:'w3'}
};
