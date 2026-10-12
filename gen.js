// ArtByRonic Captions – rule-based generator + scorer (no backend)
(function(G){
const R={ // platform rules (official guidance + benchmark)
 instagram:{limit:2200,preview:125,sweet:[90,600],tags:[3,5],maxTags:5,emoji:[1,4]},
 tiktok:{limit:4000,preview:90,sweet:[50,300],tags:[3,5],maxTags:5,emoji:[0,3]},
 facebook:{limit:63206,preview:125,sweet:[40,320],tags:[0,2],maxTags:2,emoji:[0,3]}};
const BANNED=['fyp','foryou','foryoupage','viral','explore','instagood','like4like','follow4follow','f4f','l4l','followforfollow','likeforlike','tagsforlikes','photooftheday','trending','xyzbca','explorepage','reels','instadaily'];
const HOOKS={
 mysterious:['She was never supposed to be seen.','Nobody remembers who built this place.','Look closer. Something is wrong here.','Some doors only open at midnight.','The quiet before she disappears.','It was never a dream.','What is she waiting for?','You were not meant to find this.'],
 poetic:['Silence, poured in gold.','Where the light learns to walk.','A slow bloom under a borrowed moon.','Some places only exist between breaths.','Soft as memory, sharp as glass.','The sea held its breath for her.','Woven from dusk and quiet.'],
 bold:['This is not a photograph.','Fashion was never meant to obey gravity.','Built in my head. Rendered in gold.','Rules? Never heard of them.','Couture for a world that doesn\'t exist yet.','Stop scrolling. Look at the details.','Zero cameras. Full editorial.'],
 playful:['POV: your outfit has its own weather.','Gravity called. She let it go to voicemail.','Me, pretending this is a normal Tuesday.','When the dress code says "surreal".','Tell me this isn\'t your new wallpaper.','Main character energy, but make it surreal.']};
const NL_HOOKS={
 mysterious:['Zij had nooit gezien mogen worden.','Kijk beter. Hier klopt iets niet.','Sommige deuren openen pas om middernacht.','Het was nooit een droom.','Waar wacht ze op?'],
 poetic:['Stilte, gegoten in goud.','Waar het licht leert lopen.','Een trage bloei onder een geleende maan.','Zacht als herinnering, scherp als glas.'],
 bold:['Dit is geen foto.','Mode hoeft zich niet aan zwaartekracht te houden.','Gebouwd in mijn hoofd. Gerenderd in goud.','Stop met scrollen. Kijk naar de details.'],
 playful:['POV: je outfit heeft zijn eigen weer.','De zwaartekracht belde. Ze nam niet op.','Als de dresscode "surreal" is.']};
const CTA={en:{
 follow:['Follow @artbyronic for the next chapter.','Follow for more surreal editorials.','Follow so you don\'t miss part {next}.'],
 comment:['Which detail caught you first?','Tell me in one word: what do you feel?','Would you step into this world? Yes or no?','What should happen next?'],
 save:['Save this for your moodboard.','Save it for later, it hits different at night.'],
 share:['Send this to someone who dreams in gold.','Share with the friend who would wear this.'],
 shop:['Prints & custom pieces: link in bio.','Want this on your wall? Link in bio.']},
 nl:{follow:['Volg @artbyronic voor het volgende hoofdstuk.','Volg voor meer surreal editorials.','Volg zodat je deel {next} niet mist.'],
 comment:['Welk detail zag jij als eerste?','In één woord: wat voel je?','Zou jij deze wereld instappen? Ja of nee?','Wat moet er nu gebeuren?'],
 save:['Bewaar dit voor je moodboard.'],share:['Stuur dit naar iemand die in goud droomt.'],shop:['Prints & custom werk: link in bio.']}};
const FB_Q={en:['What would you name this piece?','Would you hang this on your wall?','What story do you see here?','Which one is your favourite, and why?'],nl:['Hoe zou jij dit werk noemen?','Zou jij dit aan je muur hangen?','Welk verhaal zie jij hierin?']};
const TAGS={brand:['artbyronic'],
 broad:{image:['aiart','digitalart','surrealart'],reel:['aivideo','aiart','surrealart'],carousel:['aiart','digitalart','surrealart']},
 niche:['surrealfashion','fashioneditorial','aifashion','editorialart','dreamcore','conceptart','aiartcommunity','surrealism','aicinema','aifilm','seedance','goldaesthetic','fantasyart','darkfantasy']};
const KW={moon:['moonlit','surrealism'],gold:['goldaesthetic'],water:['surrealism'],greenhouse:['darkfantasy','aifilm'],twin:['aifilm','darkfantasy'],dress:['surrealfashion','fashioneditorial'],gown:['surrealfashion','fashioneditorial'],fashion:['aifashion','fashioneditorial'],cinematic:['aicinema'],seedance:['seedance','aivideo'],dark:['darkfantasy'],dream:['dreamcore']};
const EMO={mysterious:['🌙','🕯️','🖤','✨'],poetic:['🌙','✨','🤍','🌊'],bold:['🔥','⚡','👁️','✨'],playful:['😌','✨','💫','🫧']};
function rnd(a,r){return a[Math.floor(r()*a.length)]}
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%1e6)/1e6}}
function sentences(d){return d.replace(/\s+/g,' ').trim().split(/(?<=[.!?])\s+/).filter(Boolean)}
function keywords(d){d=d.toLowerCase();const k=[];for(const w in KW)if(d.includes(w))k.push(...KW[w]);return k}
function seriesLine(i,lang){if(!i.series)return'';const ep=i.episode?(lang==='nl'?` · Deel ${i.episode}`:` · Part ${i.episode}`):'';return `${i.series}${ep}`}
function topic(i){ // plain searchable keyword phrase
 const d=i.description.toLowerCase();const t=[];
 if(/seedance|reel|video|film/.test(d)||i.type==='reel')t.push('AI short film');else t.push('AI art');
 if(/fashion|dress|gown|couture|editorial/.test(d))t.push('surreal fashion editorial');else t.push('surreal digital art');
 return t.join(' · ')}
function hashtags(i,p,r){const n={instagram:5,tiktok:4,facebook:2}[p];
 const kw=keywords(i.description);let pool=[...new Set([...kw,...TAGS.niche])].sort(()=>r()-.5);
 if(kw.length)pool=[...new Set([...kw.sort(()=>r()-.5),...pool])];
 const s=[...TAGS.brand];if(n>=2)s.push(rnd(TAGS.broad[i.type]||TAGS.broad.image,r));
 if(i.series&&n>=4)s.push(i.series.replace(/[^a-z0-9]/gi,'').toLowerCase());
 for(const t of pool){if(s.length>=n)break;if(!s.includes(t))s.push(t)}
 return s.slice(0,n).map(t=>'#'+t)}
function body(i,r){const s=sentences(i.description);return s.slice(0,3).join(' ')}
function generate(i,p,seed){const r=rng(seed),lang=i.lang||'en',H=lang==='nl'?NL_HOOKS:HOOKS;
 const hook=rnd(H[i.mood]||H.mysterious,r),emo=rnd(EMO[i.mood]||EMO.mysterious,r);
 const ctaT=i.cta||'comment',next=i.episode?+i.episode+1:'2';
 const cta=rnd(CTA[lang][ctaT]||CTA[lang].comment,r).replace('{next}',next);
 const ser=seriesLine(i,lang),tg=hashtags(i,p,r),b=body(i,r),top=topic(i);let L=[];
 if(p==='instagram'){L=[`${hook} ${emo}`,'',b, ser?`\n${ser}`:'' ,`${top}.`,'',cta,'',tg.join(' ')]}
 else if(p==='tiktok'){const short=b.length>120?b.slice(0,b.lastIndexOf(' ',120))+'…':b;
  L=[`${hook}${ser?' '+ser+'.':''} ${short} ${top}. ${cta} ${tg.join(' ')}`]}
 else{const q=ctaT==='comment'?rnd(FB_Q[lang],r):cta;
  L=[`${hook} ${emo}`,'',b+(ser?` (${ser})`:''),'',q, tg.length?'\n'+tg.join(' '):'']}
 let text=L.filter(x=>x!==null).join('\n').replace(/\n{3,}/g,'\n\n').replace(/[ \t]+/g,' ').trim();
 return {text,hook,tags:tg}}
function score(text,p,hist){const R0=R[p],why=[];let s=100;const len=[...text].length;
 const first=p==='tiktok'?(sentences(text.split('\n')[0])[0]||''):text.split('\n')[0];const tags=(text.match(/#[\p{L}\p{N}_]+/gu)||[]).map(t=>t.slice(1).toLowerCase());
 const fl=[...first].length;
 if(fl>R0.preview){s-=15;why.push(`Hook ${fl} chars > ${R0.preview} preview`)}else if(fl<12){s-=10;why.push('Hook too short')}
 if(!/[?!.…]|\p{Extended_Pictographic}/u.test(first)){s-=5;why.push('Hook lacks punch/punctuation')}
 if(len>R0.limit){s-=50;why.push('Over platform limit')}
 if(len<R0.sweet[0]){s-=10;why.push(`Short (${len}<${R0.sweet[0]})`)}else if(len>R0.sweet[1]){s-=10;why.push(`Long (${len}>${R0.sweet[1]})`)}
 if(tags.length>R0.maxTags){s-=20;why.push(`${tags.length} hashtags > max ${R0.maxTags}`)}
 if(tags.length<R0.tags[0]){s-=10;why.push('Too few hashtags')}
 const bad=tags.filter(t=>BANNED.includes(t));if(bad.length){s-=15*bad.length;why.push('Spammy tags: '+bad.join(', '))}
 if(new Set(tags).size<tags.length){s-=10;why.push('Duplicate hashtags')}
 if(!tags.includes('artbyronic')&&!/@artbyronic/i.test(text)){s-=10;why.push('Brand tag missing')}
 if(!/\?|follow|volg|save|bewaar|share|send|stuur|link in bio|tell me|comment/i.test(text)){s-=15;why.push('No CTA')}
 const emo=(text.match(/\p{Extended_Pictographic}/gu)||[]).length;if(emo>R0.emoji[1]+2){s-=5;why.push('Emoji-heavy')}
 const words=text.replace(/#\S+/g,'').split(/\s+/).filter(Boolean);const sl=sentences(text.replace(/#\S+/g,''));
 const avg=words.length/Math.max(1,sl.length);if(avg>24){s-=10;why.push('Long sentences')}
 if(p==='instagram'&&len>200&&!text.includes('\n')){s-=5;why.push('No line breaks')}
 if(hist&&hist.some(h=>h.split('\n')[0]===first)){s-=20;why.push('Hook repeats a recent caption')}
 if(!why.length)why.push('All checks passed');return {score:Math.max(0,s),why,len,tags:tags.length}}
function best(i,p,hist,th=80,tries=25){let b=null;const base=(Date.now()+Math.random()*1e9)|0;
 for(let k=0;k<tries;k++){const g=generate(i,p,base+k*7919);const sc=score(g.text,p,hist);g.sc=sc;g.tries=k+1;
  if(!b||sc.score>b.sc.score)b=g;if(sc.score>=th)break}return b}
function alt(i){const d=sentences(i.description)[0]||'';return `${i.type==='reel'?'Video still':'AI-generated artwork'} by ArtByRonic: ${d}`.slice(0,250)}
G.ABR={R,BANNED,generate,score,best,alt}})(typeof window!=='undefined'?window:globalThis);
