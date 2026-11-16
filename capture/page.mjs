import {recognize,setProgress} from './recognizer.mjs?v=1.0.2';
import {validateFiles,mergeResults,formatReport} from './model.mjs';
import {initMarkedItems,updateMarkedResult,markedResultText} from './marks.mjs';
const page=document.querySelector('[data-section-panel=capture]'),$=id=>document.getElementById('capture-'+id);
let entries=[],busy=false,loading=false,result=null,report='',library;
setProgress(text=>{$('progress').textContent=text;});
function ensureLibrary(){if(!library)library=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('./vendor/tesseract.min.js',import.meta.url).href;script.onload=resolve;script.onerror=()=>{script.remove();library=null;reject(Error('识别资源加载失败，请重试'));};document.head.append(script);});return library;}
function error(text){$('error').textContent=text;$('error').hidden=!text;}
function reset(){result=null;report='';updateMarkedResult(null);$('copy').disabled=true;$('apply').disabled=true;$('apply').textContent='套用到本局';$('apply-state').textContent='核对文字结果后，套用将替换本局 BAN 位，并更新敌方资料的本局筛选。';$('next').hidden=true;$('raw-panel').hidden=true;$('result').textContent='上传截图后，这里显示识别到的文字信息。';$('status').textContent='等待识别';}
function render(){
  $('count').textContent=entries.length+' / 2';$('files').disabled=busy||loading;$('run').disabled=busy||loading||!entries.length;$('clear').disabled=busy||loading||!entries.length;
  $('previews').replaceChildren(...entries.map((e,i)=>{const box=document.createElement('div');box.className='capture-preview';const img=document.createElement('img');img.src=e.url;img.alt='本局截图 '+(i+1);const bar=document.createElement('div'),label=document.createElement('span'),remove=document.createElement('button');label.textContent='截图 '+(i+1);remove.textContent='移除';remove.type='button';remove.disabled=busy||loading;remove.onclick=()=>{URL.revokeObjectURL(e.url);entries.splice(i,1);reset();error('');render();};bar.append(label,remove);box.append(img,bar);return box;}));
}
async function add(files){
  if(busy||loading)return;const issue=validateFiles(files,entries.length);if(issue){error(issue);return;}loading=true;render();const added=[];
  try{for(const file of files){const url=URL.createObjectURL(file),image=new Image();image.src=url;try{await image.decode();if(image.naturalWidth<400||image.naturalHeight<240)throw Error('小图');}catch{URL.revokeObjectURL(url);throw Error('图片无法读取或尺寸过小，请使用清晰的游戏截图。');}added.push({file,url});}entries.push(...added);reset();error('');}catch(e){added.forEach(e=>URL.revokeObjectURL(e.url));error(e.message);}finally{loading=false;render();}
}
export function presentCaptureResult(value,count=entries.length){
  result=value;report=formatReport(value,count);$('result').textContent=report;$('copy').disabled=false;$('apply').disabled=!value.complete||Boolean(value.conflicts?.length);$('apply').textContent='套用到本局';$('next').hidden=true;
  updateMarkedResult(value);
  $('status').textContent=value.conflicts?.length?'截图信息冲突，请核对是否同一局':value.complete?'识别字段已齐全，请核对后套用':count<2?'识别尚未完整，可以补第 2 张截图':'已达两张上限，请替换不完整的截图';
  $('apply-state').textContent=value.complete?'套用将替换现有本局 BAN 位；阵容和左右检索条件保留。':'请先补齐缺失或待确认的信息，完整后才能套用。';
}
async function run(){
  if(busy||loading||!entries.length)return;busy=true;error('');reset();render();$('status').textContent='正在浏览器本地识别… 已用 0 秒';$('progress').textContent='正在加载识别程序，首次使用可能需要等待数十秒，请保持页面打开。';
  const started=performance.now(),timer=setInterval(()=>{$('status').textContent='正在浏览器本地识别… 已用 '+Math.floor((performance.now()-started)/1000)+' 秒';},1000);
  try{await ensureLibrary();for(let i=0;i<entries.length;i++){if(!entries[i].result){$('progress').textContent='正在处理第 '+(i+1)+' / '+entries.length+' 张截图…';entries[i].result=await recognize(entries[i].file);}}presentCaptureResult(mergeResults(entries.map(e=>e.result)),entries.length);$('raw').textContent=entries.map((e,i)=>'截图 '+(i+1)+'\n'+e.result.raw).join('\n\n');$('raw-panel').hidden=false;$('progress').textContent='识别完成，图片只在当前浏览器中处理。';}
  catch(e){error('识别未完成：'+e.message);$('status').textContent='识别未完成，可以重试';}finally{clearInterval(timer);busy=false;render();}
}
$('files').onchange=e=>{add([...e.target.files]);e.target.value='';};$('run').onclick=run;
$('clear').onclick=()=>{entries.forEach(e=>URL.revokeObjectURL(e.url));entries=[];reset();error('');render();};
for(const name of ['dragover','dragenter'])$('drop').addEventListener(name,e=>{e.preventDefault();$('drop').classList.add('dragover');});$('drop').ondragleave=()=>$('drop').classList.remove('dragover');$('drop').ondrop=e=>{e.preventDefault();$('drop').classList.remove('dragover');add([...e.dataTransfer.files]);};$('drop').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!busy&&!loading)$('files').click();}};
document.addEventListener('paste',e=>{if(page.hidden)return;const files=[...e.clipboardData.items].filter(i=>i.kind==='file').map(i=>i.getAsFile()).filter(Boolean);if(files.length){e.preventDefault();add(files);}});
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText([report,markedResultText()].filter(Boolean).join('\n\n'));$('copy').textContent='已复制';setTimeout(()=>$('copy').textContent='复制文字',1500);}catch{const range=document.createRange();range.selectNodeContents($('result'));getSelection().removeAllRanges();getSelection().addRange(range);$('result').focus();error('请按 Ctrl+C 复制选中的文字。');}};
$('apply').onclick=()=>{if(result?.complete&&!result.conflicts?.length)document.dispatchEvent(new CustomEvent('garrison:apply-recognition',{detail:result}));};
document.addEventListener('garrison:recognition-applied',e=>{$('apply-state').textContent=e.detail.message;if(e.detail.ok){$('apply').textContent='已套用 ✓';$('apply').disabled=true;$('next').hidden=false;}});
const viewer=$('viewer');for(const b of page.querySelectorAll('[data-capture-example]'))b.onclick=()=>{const image=b.querySelector('img');$('viewer-image').src=image.src;$('viewer-image').alt=image.alt;$('viewer-title').textContent=image.alt;viewer.classList.remove('original-size');$('viewer-size').textContent='查看原尺寸';viewer.showModal();};
function zoom(){const full=viewer.classList.toggle('original-size');$('viewer-size').textContent=full?'适应窗口':'查看原尺寸';}
$('viewer-image').onclick=zoom;$('viewer-size').onclick=zoom;$('viewer-close').onclick=()=>viewer.close();viewer.onclick=e=>{if(e.target===viewer)viewer.close();};
initMarkedItems();reset();render();
