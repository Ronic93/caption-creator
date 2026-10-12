require('../insights.js');require('../gen.js');
const ig=`Post ID,Account username,Description,Duration (sec),Publish time,Permalink,Post type,Views,Reach,Likes,Shares,Follows,Comments,Saves
1,artbyronic,"Silence, poured in gold. 🌙
#artbyronic #aiart",0,2026-09-01,x,IG reel,"1,200",900,140,4,2,12,30
2,artbyronic,"What would you name her?",0,2026-09-02,x,IG image,800,700,60,1,0,25,5`;
const tt=`Video title,Video link,Post time,Total likes,Total comments,Total shares,Total views
"Some doors only open at midnight. #artbyronic",x,2026-09-03,300,10,20,5000`;
const p=[...INS.importCSV(ig,'instagram'),...INS.importCSV(tt,'tiktok')];console.log(p);
const many=[];for(let k=0;k<24;k++){const q=k%2;many.push({platform:'instagram',caption:(q?'What would you name her?':'Silence, poured in gold.')+' #artbyronic',views:1000,likes:q?200:50,comments:q?30:2,shares:1,saves:3})}
const A=INS.analyze(many);console.log(INS.summary(A));console.log(ABR.score('What is she waiting for? 🌙\n\nA gold gown.\n\nAI art.\n\n#artbyronic #aiart #surrealart',  'instagram',[],A));
