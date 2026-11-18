import { CORE, ADDON, clean, parseOcrLines } from './model.mjs?v=1.1.0';
import { signature,matchSignature } from './glyphs.mjs';
let workerPromise;
let log=()=>{};
export function setProgress(fn){log=fn;}
async function worker(){
  if(!workerPromise)workerPromise=Tesseract.createWorker('chi_sim',1,{
    workerPath:new URL('./vendor/worker.min.js',import.meta.url).href,
    corePath:new URL('./vendor/core',import.meta.url).href,
    langPath:new URL('./vendor/lang',import.meta.url).href,
    logger:m=>{
      const percent=Math.round((m.progress||0)*100)+'%';
      log(m.status==='recognizing text'?'正在识别文字… '+percent
        :m.status==='loading language traineddata'?'正在加载中文识别模型… '+percent+'（首次使用可能较慢）'
        :m.status==='loading tesseract core'?'正在加载本地识别引擎…（首次使用可能较慢）'
        :m.status.startsWith('initializing')?'正在初始化识别引擎…'
        :'正在准备本地识别资源…');
    },
  }).then(async w=>{await w.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1'});return w;}).catch(e=>{workerPromise=null;throw e;});
  return workerPromise;
}
export async function imageCanvas(source){
  const image=new Image();image.src=typeof source==='string'?source:URL.createObjectURL(source);
  try{await image.decode();if(image.naturalWidth<400||image.naturalHeight<240)throw Error('图片尺寸过小，请选择清晰的游戏截图。');const factor=Math.min(1920/image.naturalWidth,2160/image.naturalHeight,2);const sourceCanvas=document.createElement('canvas');sourceCanvas.width=Math.round(image.naturalWidth*factor);sourceCanvas.height=Math.round(image.naturalHeight*factor);sourceCanvas.getContext('2d').drawImage(image,0,0,sourceCanvas.width,sourceCanvas.height);
    const layout=locatePanel(sourceCanvas);const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=Math.round(sourceCanvas.height/layout.scale);const ctx=canvas.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(sourceCanvas,-layout.offset/layout.scale,0,sourceCanvas.width/layout.scale,canvas.height);
    // Top-left difficulty is screen-anchored; the alliance panel is centered on
    // ultrawide devices. Read its source crop independently of that translation.
    const top=document.createElement('canvas');top.width=400;top.height=90;top.getContext('2d').drawImage(sourceCanvas,sourceCanvas.width*.045,sourceCanvas.height*.02,sourceCanvas.width*.20,sourceCanvas.height*.10,0,0,400,90);canvas.difficultyCrop=top;canvas.layout=layout;return canvas;
  }finally{if(typeof source!=='string')URL.revokeObjectURL(image.src);}
}
function locatePanel(canvas){
  const {width,height}=canvas;
  if(Math.abs(width/height-16/9)<.06)return{scale:width/1920,offset:0,anchored:true};
  const data=canvas.getContext('2d').getImageData(0,0,width,height).data;const bars=[];const gap=0;
  for(let y=Math.round(height*.13);y<height*.88;y+=2){let start=-1,last=0,goodCount=0;
    for(let x=Math.round(width*.04);x<width*.74;x++){const i=(y*width+x)*4,r=data[i],g=data[i+1],b=data[i+2];const good=r>=45&&r<=85&&Math.max(r,g,b)-Math.min(r,g,b)<14;
      if(good){if(start<0){start=x;goodCount=0;}last=x;goodCount++;}
      if(start>=0&&(!good&&x-last>gap||x>=width*.74-1)){const w=last-start+1;if(w>width*.43&&start<width*.17&&goodCount/w>.82)bars.push({x:start,y,w,coverage:goodCount/w});start=-1;}
    }
  }
  bars.sort((a,b)=>b.w-a.w);const best=bars[0];if(!best)return{scale:width/1920,offset:0,anchored:false};
  let end=best.x+best.w,miss=0;
  for(let x=end-6;x<Math.min(width*.76,end+width*.07);x++){let good=0,total=0;for(let y=Math.max(0,best.y-36);y<=best.y+3&&y<height;y++){const i=(y*width+x)*4,r=data[i],g=data[i+1],b=data[i+2];total++;if(r>=45&&r<=85&&Math.max(r,g,b)-Math.min(r,g,b)<14)good++;}if(good/total>.38){end=x+1;miss=0;}else if(++miss>5)break;}
  const scale=(end-best.x)/1188;return{scale,offset:best.x-108*scale,anchored:true,bar:best,end};
}
function getLines(tsv){
  const rows=tsv.trim().split('\n').slice(1).map(row=>{const p=row.split('\t');return{level:+p[0],group:p.slice(1,5).join(':'),x:+p[6],y:+p[7],w:+p[8],h:+p[9],confidence:+p[10],text:p.slice(11).join('\t')};}).filter(w=>w.level===5&&w.text.trim());
  const groups=new Map();for(const w of rows){const a=groups.get(w.group)||[];a.push(w);groups.set(w.group,a);}
  return [...groups.values()].map(words=>({text:words.map(w=>w.text).join(' '),confidence:words.reduce((a,w)=>a+w.confidence,0)/words.length,words,bbox:{x0:Math.min(...words.map(w=>w.x)),y0:Math.min(...words.map(w=>w.y)),x1:Math.max(...words.map(w=>w.x+w.w)),y1:Math.max(...words.map(w=>w.y+w.h))}}));
}
function stateAt(canvas,bbox){
  const x=(bbox.x0+bbox.x1)/2,y=bbox.y0,scale=canvas.width/1920;
  const left=Math.max(0,Math.round(x-48*scale)),top=Math.max(0,Math.round(y-110*scale));
  const width=Math.min(Math.round(96*scale),canvas.width-left),height=Math.min(Math.round(96*scale),canvas.height-top);
  if(top===0||width<10||height<10)return 'uncertain';
  const data=canvas.getContext('2d').getImageData(left,top,width,height).data;let cyan=0,bright=0;
  for(let i=0;i<data.length;i+=4){const[r,g,b]=[data[i],data[i+1],data[i+2]];if(g>95&&b>55&&g>r*1.45&&b>r*1.2)cyan++;if(r>110&&g>110&&b>110)bright++;}
  if(cyan/(data.length/4)>0.07)return 'active';
  return bright/(data.length/4)>0.008?'inactive':'uncertain';
}
export function portraitSignature(canvas){const c=document.createElement('canvas');c.width=16;c.height=16;const ctx=c.getContext('2d');ctx.drawImage(canvas,1360,465,125,120,0,0,16,16);const d=ctx.getImageData(0,0,16,16).data;const values=[];for(let i=0;i<d.length;i+=4)values.push(d[i],d[i+1],d[i+2]);return values;}
export async function recognize(source){
  const canvas=await imageCanvas(source),w=await worker();
  // Separate text from bright artwork and cyan circles before OCR. Preserve
  // source coordinates so state detection always samples the original image.
  const regions=[{name:'难度',x:0,y:0,width:400,height:90,psm:7,color:true,source:canvas.difficultyCrop}, {name:'Boss',x:1490,y:490,width:335,height:110,psm:6}, {name:'特训类型',x:1490,y:605,width:320,height:210,psm:6}, {name:'盟约名称',x:125,y:145,width:1150,height:canvas.height-155,psm:11}];
  const lines=[],raw=[];const ratio=canvas.width/1920;
  async function readRegion(region){
    log('正在识别'+region.name+'…');
    const source=region.source||canvas;const x=Math.round(region.x*ratio),y=Math.round(region.y*ratio),rw=Math.min(Math.round(region.width*ratio),source.width-x),rh=Math.min(Math.round(region.height*ratio),source.height-y);if(rw<=0||rh<=0)return [];
    const prepared=document.createElement('canvas');const zoom=region.zoom||2;prepared.width=rw*zoom;prepared.height=rh*zoom;const ctx=prepared.getContext('2d');ctx.drawImage(source,x,y,rw,rh,0,0,prepared.width,prepared.height);const pixels=ctx.getImageData(0,0,prepared.width,prepared.height);
    for(let i=0;i<pixels.data.length;i+=4){const r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2];const max=Math.max(r,g,b),min=Math.min(r,g,b);const ink=region.color?max>125:((r+g+b)/3>(region.name==='单格盟约'?65:region.name==='Boss'?100:85)&&max-min<55);const v=ink?0:255;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;}
    ctx.putImageData(pixels,0,0);await w.setParameters({tessedit_pageseg_mode:String(region.psm)});const {data}=await w.recognize(prepared.toDataURL('image/png'),{}, {text:true,tsv:true});
    raw.push(region.name+'：\n'+data.text);const found=getLines(data.tsv||'');
    for(const line of found){if(region.name==='特训类型')line.kind='type';line.bbox={x0:line.bbox.x0/zoom+x,y0:line.bbox.y0/zoom+y,x1:line.bbox.x1/zoom+x,y1:line.bbox.y1/zoom+y};for(const word of line.words){word.x=word.x/zoom+x;word.y=word.y/zoom+y;word.w/=zoom;word.h/=zoom;}}
    // Long leader names wrap in the game. Match their complete text only
    // within the dedicated Boss region, leaving unrelated text separate.
    if(region.name==='Boss'&&found.length>1)found.push({text:found.map(line=>line.text).join(''),kind:'boss',words:[],bbox:{x0:x,y0:y,x1:x+rw,y1:y+rh}});
    return found;
  }
  for(const region of regions)lines.push(...await readRegion(region));
  // Retry only unread training labels, excluding their common prefix and
  // nearby cursor artwork. Accepted values still come from the known types.
  const firstPass=parseOcrLines(lines),typeCount=firstPass.mode==='同盟模拟'?3:firstPass.mode==='独立模拟'?2:0;
  for(let row=0;row<typeCount;row++){
    const y=605+row*70;
    const alreadyRead=lines.some(line=>line.kind==='type'&&(line.bbox.y0+line.bbox.y1)/2>=y&&(line.bbox.y0+line.bbox.y1)/2<y+70&&parseOcrLines([line]).types.length);
    if(!alreadyRead)lines.push(...await readRegion({name:'特训类型',x:1635,y,width:95,height:70,psm:7,zoom:4}));
  }
  const preliminary=parseOcrLines(lines);const clusters=names=>{
    const ys=lines.filter(l=>names.some(n=>clean(l.text).includes(n))&&l.bbox.y0>150&&l.bbox.x0<1280).map(l=>l.bbox.y0).sort((a,b)=>a-b);const rows=[];for(const y of ys){if(!rows.length||y-rows.at(-1).at(-1)>35)rows.push([y]);else rows.at(-1).push(y);}return rows.map(a=>a[Math.floor(a.length/2)]);
  };
  const coreRows=clusters(CORE),addonRows=clusters(ADDON);const slots=[];
  if(preliminary.mode==='同盟模拟'&&coreRows.length)for(let i=0;i<10;i++)slots.push({x:175+i*116.4,y:coreRows[0],names:CORE});
  if(preliminary.mode==='独立模拟'&&coreRows.length){
    for(const x of [275,410,546,859,994,1127])slots.push({x,y:coreRows[0],names:CORE});
    const bottom=coreRows[1]||coreRows[0]+178;if(bottom+24<canvas.height)for(const x of [343,477,924,1059])slots.push({x,y:bottom,names:CORE});
  }
  if(!addonRows.length){const header=lines.find(l=>clean(l.text).includes('附加盟约'));if(header){const words=header.words.filter(w=>/[附加盟约]/.test(w.text));const ys=words.map(w=>w.y).sort((a,b)=>a-b);addonRows.push((ys.length?ys[Math.floor(ys.length/2)]:header.bbox.y0)+198);}}
  if(addonRows.length){const y=addonRows[0];for(let i=0;i<10;i++)slots.push({x:175+i*116.4,y,names:ADDON});const bottom=addonRows.find(v=>v>y+150)||y+196;if(bottom+24<canvas.height)for(let i=0;i<6;i++)slots.push({x:175+i*116.4,y:bottom,names:ADDON});}
  const bank=await fetch(new URL('./assets/glyphs.json',import.meta.url)).then(r=>r.ok?r.json():{}).catch(()=>({}));
  const matchDiagnostics=[],slotLines=[];
  for(const slot of slots){
    const candidates=[-4,0,4].map(offset=>({...matchSignature(signature(canvas,slot.x,slot.y+offset),bank,slot.names),y:slot.y+offset}));
    const match=candidates.sort((a,b)=>b.score-a.score)[0];
    matchDiagnostics.push({x:slot.x,y:slot.y,...match});
    const stable=candidates.every(c=>c.name===match.name)&&match.score>.72&&match.margin>.025;
    if(match.score>.65&&match.margin>.035||stable){const bbox={x0:slot.x-35,y0:match.y,x1:slot.x+35,y1:match.y+25};const line={text:match.name,bbox,state:stateAt(canvas,bbox),confidence:Math.round(match.score*100),words:[]};lines.push(line);slotLines.push(line);continue;}
    const found=await readRegion({name:'单格盟约',x:slot.x-55,y:slot.y-4,width:110,height:44,psm:7,zoom:3});
    const text=clean(found.map(l=>l.text).join(''));const exact=slot.names.find(n=>text===n);if(exact){const bbox={x0:slot.x-35,y0:slot.y,x1:slot.x+35,y1:slot.y+25};const line={text:exact,bbox,state:stateAt(canvas,bbox),confidence:Math.min(...found.map(l=>l.confidence)),words:[]};lines.push(line);slotLines.push(line);}
  }
  const expanded=[...lines];
  for(const line of lines){
    if(line.bbox.x0>canvas.width*.7)continue;
    const letters=[];
    for(const word of line.words)for(const [i,c]of [...clean(word.text)].entries())letters.push({c,x0:word.x+word.w*i/clean(word.text).length,x1:word.x+word.w*(i+1)/clean(word.text).length,y0:word.y,y1:word.y+word.h});
    const text=letters.map(c=>c.c).join('');
    for(const name of [...CORE,...ADDON]){
      const index=text.indexOf(name);if(index<0)continue;const chars=letters.slice(index,index+name.length);const bbox={x0:Math.min(...chars.map(c=>c.x0)),y0:Math.min(...chars.map(c=>c.y0)),x1:Math.max(...chars.map(c=>c.x1)),y1:Math.max(...chars.map(c=>c.y1))};
      // Only accept names in the alliance panel, not incidental explanatory text.
      if(bbox.y0<140||bbox.x0<canvas.width*.04||bbox.x1>canvas.width*.69)continue;
      expanded.push({text:name,bbox,state:stateAt(canvas,bbox),confidence:line.confidence});
    }
  }
  const result=parseOcrLines(expanded);const unique=new Map();for(const a of result.alliances){if(a.bbox?.y0<140)continue;const old=unique.get(a.name);if(!old||a.state!=='uncertain')unique.set(a.name,a);}
  const orderedTypes=parseOcrLines(lines.filter(line=>line.kind==='type').sort((a,b)=>a.bbox.y0-b.bbox.y0)).types;
  result.types=[...new Set([...orderedTypes,...result.types])];
  // A broad OCR pass can read an icon as an alliance name. Prefer labels
  // verified in their actual grid cells; conflicting cell reads stay unknown.
  const verified=new Map();for(const a of parseOcrLines(slotLines).alliances){const old=verified.get(a.name);verified.set(a.name,old&&old.state!==a.state?{...a,state:'uncertain'}:a);}for(const [name,a]of verified)unique.set(name,a);
  result.alliances=[...unique.values()];
  if(!result.boss){const portraits=await fetch(new URL('./assets/portraits.json',import.meta.url)).then(r=>r.ok?r.json():{}).catch(()=>({}));const signature=portraitSignature(canvas);const scores=Object.entries(portraits).map(([name,template])=>({name,score:1-template.reduce((sum,v,i)=>sum+Math.abs(v-signature[i]),0)/(255*signature.length)})).sort((a,b)=>b.score-a.score);if(scores[0]?.score>.88&&scores[0].score-(scores[1]?.score||0)>.035){result.boss=scores[0].name;raw.push('领袖头像模板匹配：'+result.boss+'（'+Math.round(scores[0].score*100)+'）');}}
  result.raw=raw.join('\n');result.width=canvas.width;result.height=canvas.height;result.layout=canvas.layout;result.diagnostics={coreRows,addonRows,matches:matchDiagnostics};
  return result;
}
