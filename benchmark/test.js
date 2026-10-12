require('../gen.js');const T=[
['A woman in a liquid-gold gown walks on still water under a giant full moon. Her dress melts into the sea like molten gold.','poetic','image','','','comment'],
['Two twin sisters in a Victorian greenhouse. One cuts the last rose; the other watches through fogged glass. "It was mine."','mysterious','reel','The Greenhouse','1','follow'],
['The twin returns to the greenhouse at night, holding the rose. The glass cracks.','mysterious','reel','The Greenhouse','2','follow'],
['A model in a chrome trench coat floats above a desert of mirrors.','bold','image','','','save'],
['Pink cloud dress, giant teacup, model sipping from the sky.','playful','carousel','','','share'],
['Black lace gown made of crows taking flight.','mysterious','image','','','comment'],
['Golden mask and silk veil in a flooded cathedral.','poetic','image','','','shop'],
['Seedance reel: a dancer in red silk turns into smoke.','bold','reel','','','follow'],
['Gold-leaf skin model surrounded by floating oranges.','playful','image','','','comment'],
['Surreal fashion editorial: velvet suit, staircase into clouds.','bold','carousel','Ascend','3','save'],
['A bride whose veil is a waterfall.','poetic','reel','','','share'],
['Twin portraits, one burning, one frozen.','mysterious','carousel','The Greenhouse','3','comment'],
['Model with a moon for a head, haute couture tailoring.','bold','image','','','shop'],
['Een vrouw in een gouden jurk loopt over het water onder de maan.','poetic','image','','','comment'],
['Neon jellyfish dress drifting through a night city.','playful','reel','','','follow'],
['Marble statue comes alive and walks the runway.','bold','reel','','','comment'],
['Desert queen with a gown of sand pouring from her shoulders.','mysterious','image','','','save'],
['Butterfly wings stitched into a corset, macro shot.','poetic','carousel','','','share'],
['Seedance short: greenhouse burns, twin smiles.','mysterious','reel','The Greenhouse','4','follow'],
['Glass high heels filled with ocean waves.','playful','image','','','shop']];
let pass={instagram:0,tiktok:0,facebook:0},hist=[],out=[],first={instagram:0,tiktok:0,facebook:0};
T.forEach((t,k)=>{const i={description:t[0],mood:t[1],type:t[2],series:t[3],episode:t[4],cta:t[5],lang:k==13?'nl':'en'};const r={};
for(const p in pass){const b=ABR.best(i,p,hist,85);r[p]={text:b.text,score:b.sc.score,why:b.sc.why,tries:b.tries};if(b.sc.score>=85)pass[p]++;if(b.tries==1)first[p]++;hist.push(b.text)}out.push({input:i,r})});
require('fs').writeFileSync(__dirname+'/test-results.json',JSON.stringify({pass,firstTry:first,n:T.length,out},null,1));console.log(pass,first);
for(const k of[0,1])for(const p in pass)console.log(`--${k} ${p} ${out[k].r[p].score}\n${out[k].r[p].text}`);
const fails=out.flatMap(o=>Object.entries(o.r).filter(([p,v])=>v.score<100).map(([p,v])=>p+': '+v.why.join('; ')));console.log(fails.slice(0,15));
