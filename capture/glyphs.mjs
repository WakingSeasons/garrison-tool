// Compare the fixed in-game typeface against a small local vocabulary. This is
// a second, independent image comparison, not an OCR spelling substitution.
export function signature(canvas,cx,y){
  const c=document.createElement('canvas');c.width=55;c.height=16;const ctx=c.getContext('2d');ctx.drawImage(canvas,cx-55,y-4,110,32,0,0,55,16);const data=ctx.getImageData(0,0,55,16).data;const values=[];
  for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];values.push(Math.max(r,g,b)-Math.min(r,g,b)>65?0:(r+g+b)/3);}
  const sorted=[...values].sort((a,b)=>a-b);const threshold=Math.max(45,Math.min(100,sorted[Math.floor(sorted.length*.9)]*.55+sorted[Math.floor(sorted.length*.2)]*.45));
  return values.map(v=>v>threshold?1:0);
}
export function matchSignature(input,bank,names){
  const ranks=names.map(name=>{const template=bank[name];if(!template)return{name,score:0};let best=0;
    for(let dy=-2;dy<=2;dy++)for(let dx=-3;dx<=3;dx++){let a=0,b=0,common=0;for(let y=0;y<16;y++)for(let x=0;x<55;x++){const v=input[y*55+x],xx=x+dx,yy=y+dy,t=xx>=0&&xx<55&&yy>=0&&yy<16?+(template[yy*55+xx]||0):0;a+=v;b+=t;common+=v*t;}best=Math.max(best,a+b?2*common/(a+b):0);}
    return{name,score:best};}).sort((a,b)=>b.score-a.score);
  return{...ranks[0],margin:(ranks[0]?.score||0)-(ranks[1]?.score||0)};
}
