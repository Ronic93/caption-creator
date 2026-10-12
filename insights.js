// Performance feedback loop: stored locally, learns what works for Ronic
(function(G){
function csvParse(t){const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
 if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}
 else if(c=='"')q=true;else if(c==','||c=='\t'||c==';'){r.push(f);f=''}else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;r.push(f);rows.push(r);r=[];f=''}else f+=c}
 if(f||r.length){r.push(f);rows.push(r)}return rows.filter(x=>x.some(v=>v.trim()))}
const COL={caption:/^(caption|description|title|post description|video title|beschrijving|bijschrift)/i,views:/(views|plays|impressions|reach|weergaven|bereik)/i,likes:/(likes|reactions|vind-ik-leuks|reacties op)/i,comments:/(comments|opmerkingen)/i,shares:/(shares|gedeeld)/i,saves:/(saves|opgeslagen)/i,platform:/^platform/i};
function num(v){v=String(v||'').replace(/[^\d.,kKmM]/g,'');let m=1;if(/k$/i.test(v))m=1e3;if(/m$/i.test(v))m=1e6;return (parseFloat(v.replace(/,/g,''))||0)*m}
function importCSV(text,plat){const rows=csvParse(text);if(rows.length<2)return[];let hi=rows.findIndex(r=>r.some(c=>COL.caption.test(c.trim())));if(hi<0)hi=0;
 const h=rows[hi].map(s=>s.trim()),idx={};for(const k in COL)idx[k]=h.findIndex(c=>COL[k].test(c));
 return rows.slice(hi+1).map(r=>({platform:(idx.platform>=0&&r[idx.platform]?r[idx.platform].toLowerCase():plat)||'instagram',caption:r[idx.caption]||'',views:num(r[idx.views]),likes:num(r[idx.likes]),comments:num(r[idx.comments]),shares:num(r[idx.shares]),saves:num(r[idx.saves])})).filter(p=>p.caption.trim())}
function hookStyle(c){const f=(c.split('\n')[0]||'').trim();if(/^pov/i.test(f))return'POV';if(/\?/.test(f))return'question';if(/^["“']/.test(f))return'quote';if(/(part|deel|ep\.?|episode|chapter)\s*\d|—|·/i.test(f))return'series title';if([...f].length<=40)return'short poetic';return'statement'}
function ctaType(c){c=c.toLowerCase();if(/link in bio|shop|prints/.test(c))return'shop';if(/save|bewaar/.test(c))return'save';if(/send|share|stuur|tag/.test(c))return'share';if(/follow|volg/.test(c))return'follow';if(/\?/.test(c))return'question';return'none'}
function lenB(c){const l=[...c].length;return l<100?'<100':l<200?'100–200':l<400?'200–400':'400+'}
function er(p){return (p.likes+2*p.comments+3*p.shares+3*p.saves)/Math.max(p.views,p.likes*10,1)}
function analyze(posts){const out={n:posts.length,feat:{}};if(!posts.length)return out;const avg=posts.reduce((s,p)=>s+er(p),0)/posts.length;out.avg=avg;
 const add=(k,v,p)=>{const o=out.feat[k]=out.feat[k]||{};(o[v]=o[v]||[]).push(er(p))};
 for(const p of posts){add('hook',hookStyle(p.caption),p);add('cta',ctaType(p.caption),p);add('length',p.platform+' '+lenB(p.caption),p);
  for(const t of new Set((p.caption.match(/#[\p{L}\p{N}_]+/gu)||[]).map(x=>x.toLowerCase())))add('tag',t,p)}
 for(const k in out.feat)for(const v in out.feat[k]){const a=out.feat[k][v];out.feat[k][v]={n:a.length,lift:(a.reduce((s,x)=>s+x,0)/a.length)/(avg||1)}}
 out.top=posts.slice().sort((a,b)=>er(b)-er(a)).slice(0,6);return out}
function bias(text,plat,A){if(!A||A.n<5)return{d:0,why:[]};let d=0;const why=[];const f=(k,v,label)=>{const o=A.feat[k]&&A.feat[k][v];if(o&&o.n>=3){const x=Math.max(-8,Math.min(8,Math.round((o.lift-1)*10)));if(x){d+=x;why.push(`${label} "${v}" ${x>0?'+':''}${x} (your data)`)}}};
 f('hook',hookStyle(text),'Hook');f('cta',ctaType(text),'CTA');f('length',plat+' '+lenB(text),'Length');
 let td=0;for(const t of new Set((text.match(/#[\p{L}\p{N}_]+/gu)||[]).map(x=>x.toLowerCase()))){const o=A.feat.tag&&A.feat.tag[t];if(o&&o.n>=3)td+=(o.lift-1)*3}
 td=Math.max(-5,Math.min(5,Math.round(td)));if(td){d+=td;why.push(`Hashtags ${td>0?'+':''}${td} (your data)`)}return{d,why}}
function summary(A){if(!A||!A.n)return[];const best=k=>Object.entries(A.feat[k]||{}).filter(([,o])=>o.n>=3).sort((a,b)=>b[1].lift-a[1].lift);
 const L=[];for(const [k,lab] of[['hook','Hook style'],['cta','CTA'],['length','Length'],['tag','Hashtag']]){const b=best(k);if(b.length)L.push(`${lab}: best "${b[0][0]}" (${b[0][1].lift.toFixed(2)}×, n=${b[0][1].n})${b.length>1?` · weakest "${b.at(-1)[0]}" (${b.at(-1)[1].lift.toFixed(2)}×)`:''}`)}return L}
G.INS={csvParse,importCSV,analyze,bias,summary,hookStyle,ctaType,er}})(typeof window!=='undefined'?window:globalThis);
