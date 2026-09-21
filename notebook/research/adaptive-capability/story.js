/* Source-linked narrative. No external libraries, requests, or tracking. */
(() => {
  'use strict';
  const {graph, analysis, fixture} = window.ADAPTATION_DATA;
  const $ = id => document.getElementById(id);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const colors = {ink:'#203730', green:'#236b55', orange:'#ad502c', pale:'#d4e1ce', line:'#aebdad', muted:'#52625b', white:'#fffef9'};
  const nodeMap = new Map(graph.nodes.map(n => [n.id,n]));
  const state = {scene:'constraints', cost:1, beta:.25, heredity:true, ensemble:'structured', width:8};
  const text = (x,y,label,size=15,extra='') => `<text x="${x}" y="${y}" font-size="${innerWidth<=680?Math.max(size,17):size}" fill="${colors.ink}" font-family="system-ui,sans-serif" ${extra}>${escape(label)}</text>`;
  const line = (x1,y1,x2,y2,color=colors.line,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${extra}/>`;
  const rect = (x,y,w,h,fill=colors.white,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const circle = (x,y,r,fill,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
  const svg = (title,body,height=340) => `<svg viewBox="0 0 500 ${height}" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title>${body}</svg>`;
  const labelLines = (x,y,label,max=24,size=14) => {
    const words=String(label).split(' ');const rows=[];let row='';
    for(const word of words){if((row+' '+word).trim().length>max&&row){rows.push(row);row=word;}else row=(row+' '+word).trim();}if(row)rows.push(row);
    return rows.map((r,i)=>text(x,y+i*(size+5),r,size)).join('');
  };
  function model(cost,beta,heredity){
    const ua=40-cost*18, ub=40-cost*24, wa=1+beta*ua, wb=1+beta*ub;
    const selected=heredity ? wa/(wa+wb) : .5;
    return {ua,ub,wa,wb,selected,neutral:.5,gain:(selected-.5)*(ua-ub)};
  }
  window.AdaptationModel = {model};
  function boxes(items, start=35, step=69){
    return items.map((item,i)=>rect(65,start+i*step,370,49,i===0?colors.pale:colors.white)+text(250,start+i*step+29,item,15,'text-anchor="middle"')+(i<items.length-1?line(250,start+i*step+49,250,start+(i+1)*step-3,colors.green,'marker-end="url(#arrow)"'):'')).join('');
  }
  const arrow = `<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="${colors.green}"/></marker></defs>`;
  function paintScene(){
    const scene=state.scene;let body='',note='',controls='',status='';
    const index=graph.story.findIndex(s=>s.id===scene);
    $('scene-number').textContent=String(index+1).padStart(2,'0')+' / 10';
    $('scene-label').textContent={constraints:'Resource budgets',selection:'Inheritance and reproduction',foraging:'A physical-cost model',landscapes:'A generated payoff map',nfl:'An explicit ensemble comparison',coevolution:'Protocol and performance',oracles:'Calls versus elementary tests',s4s:'Two probability measures',results:'Three results, three scopes',limits:'Premises still to establish'}[scene];
    if(scene==='constraints'){
      body=rect(155,30,190,60,colors.pale)+text(250,65,'Resources acquired',18,'text-anchor="middle"');
      ['Maintenance','Movement','Growth','Reproduction'].forEach((s,i)=>{const x=15+i*123;body+=line(250,90,x+53,175)+rect(x,175,112,65)+text(x+56,213,s,13,'text-anchor="middle"');});
      body+=text(250,289,'More for one use can leave less for another.',15,'text-anchor="middle"');
      note='Allocation relationships, not a measured energy budget. Fitness concerns reproductive consequences.';
    }else if(scene==='selection'){
      body=arrow+boxes(['Variation among policies or traits','Different reproductive contributions','Transmission to descendants','Changed population representation'],20,76);
      note='A conceptual mechanism. Drift and other causes also affect population frequencies.';
    }else if(scene==='foraging'){
      const r=model(state.cost,state.beta,state.heredity);const xy=p=>[130+p.x*40,190-p.y*40];
      fixture.routes.forEach((route,i)=>{const points=route.nodes.map(id=>xy(fixture.points.find(p=>p.id===id)).join(',')).join(' ');body+=`<polyline points="${points}" fill="none" stroke="${i?colors.orange:colors.green}" stroke-width="${i?3:5}" ${i?'stroke-dasharray="7 5"':''}/>`;});
      fixture.points.forEach(p=>{const [x,y]=xy(p);body+=(p.role==='home'?rect(x-7,y-7,14,14,colors.ink):circle(x,y,7,colors.white,`stroke="${colors.ink}" stroke-width="2"`))+text(x+(p.id==='D'?14:0),y+(p.role==='home'?26:-17),p.role==='home'?'H · home':p.id,14,p.id==='D'?'':'text-anchor="middle"');});
      body+=line(28,244,70,244,colors.green,'stroke-width="4"')+text(82,249,'A · 18 distance units',14)+line(275,244,315,244,colors.orange,'stroke-dasharray="7 5"')+text(326,249,'B · 24 units',14);
      body+=text(28,286,`Net energy A: ${r.ua.toFixed(1)}`,16)+text(275,286,`B: ${r.ub.toFixed(1)}`,16);
      body+=rect(28,314,440,16,'#d7ddd1')+rect(28,314,440*r.selected,16,colors.green);
      body+=line(248,307,248,337,colors.orange)+text(28,358,`Expected A offspring: ${(100*r.selected).toFixed(1)}%`,16)+text(465,358,'Neutral: 50%',14,'text-anchor="end"');
      note='Two candidate tours, arbitrary units; neither is asserted globally optimal. β is an assumed reproductive response, not measured bee biology.';
      controls=`<div class="control-grid"><label for="cost">Energy cost / distance: <output id="cost-value">${state.cost.toFixed(2)}</output><input id="cost" type="range" min="0" max="1.5" step="0.05" value="${state.cost}"></label><label for="beta">Reproductive sensitivity β: <output id="beta-value">${state.beta.toFixed(3)}</output><input id="beta" type="range" min="0" max="0.5" step="0.025" value="${state.beta}"></label><label class="check" for="heredity"><input id="heredity" type="checkbox" ${state.heredity?'checked':''}>Policy differences transmitted</label></div>`;
      status=`Expected net-energy gain over neutrality: ${r.gain.toFixed(3)}. ${state.heredity?'Finite births can still produce variable outcomes.':'Transmission erased: no inherited response.'}`;
    }else if(scene==='landscapes'){
      body=arrow+boxes(['Resource geometry + movement mechanics','Net return from a realized behavior','Life-history relation to reproduction','Comparative reproductive contributions'],20,76);
      note='Each arrow needs a mechanism or a stated model assumption. No search over possible evaluators is included in this construction.';
    }else if(scene==='nfl'){
      const all=[];function perm(xs,p=[]){if(!xs.length){const key=p.join();if(!all.some(x=>x.join()===key))all.push(p);return;}xs.forEach((v,i)=>perm(xs.filter((_,j)=>j!==i),p.concat(v)));}perm([0,1,1,2]);
      const oriented=[[2,1,1,0],[1,2,0,1],[1,0,2,1],[0,1,1,2]];
      const fs=state.ensemble==='structured'?oriented:all;
      body=text(250,25,`${fs.length} equally weighted functions`,17,'text-anchor="middle"');
      fs.forEach((f,i)=>{const col=i%3,row=Math.floor(i/3);const x=60+col*140,y=55+row*38;f.forEach((v,j)=>body+=rect(x+j*26,y,24,26,[colors.white,colors.pale,colors.green][v])+text(x+j*26+12,y+18,String(v),12,`text-anchor="middle" ${v===2?'style="fill:white"':''}`));});
      const q=state.ensemble==='structured'?.75:.5;
      body+=text(35,248,'Adaptive policy',14)+rect(190,232,240*q,25,colors.green)+text(440,250,q===.75?'¾':'½',18);
      body+=text(35,290,'Fixed policy',14)+rect(190,274,120,25,colors.orange)+text(440,292,'½',18);
      body+=text(250,329,'Cell order: 00, 01, 10, 11 · values: 0, 1, 2',12,'text-anchor="middle"');
      controls=`<div class="segmented" aria-label="Function ensemble"><button type="button" data-ensemble="structured" aria-pressed="${state.ensemble==='structured'}">Structured family</button><button type="button" data-ensemble="orbit" aria-pressed="${state.ensemble==='orbit'}">Complete orbit</button></div>`;
      note='Each policy makes two distinct queries. Adaptive: first 00; next 11 if the first value is 0, otherwise 01. Fixed: 00 then 01. Success means observing 2.';
      status=`Success: adaptive ${q===.75?'3/4':'1/2'}, fixed 1/2. ${q===.75?'Restricted ensemble permits a difference.':'Complete uniform orbit restores equality.'}`;
    }else if(scene==='coevolution'){
      body=text(250,35,'Organisms do not determine the endpoint.',18,'text-anchor="middle"');
      body+=rect(20,70,220,195)+rect(260,70,220,195);
      body+=labelLines(40,98,'Population trace evaluation',22,17)+labelLines(40,153,'Specified cost and averaging assumptions',22,14)+labelLines(40,225,'Qualified NFL result',23,14);
      body+=labelLines(280,98,'Self-play / later evaluation',20,17)+labelLines(280,153,'Outcome can depend on the problem beyond the trace',22,14)+labelLines(280,225,'Free lunches can arise',23,14);
      body+=text(250,307,'WM2005: the evaluation rule matters.',15,'text-anchor="middle"');
      note='The paper’s organism-survival design exception is biologically framed; it is not a demonstrated evolutionary solution.';
    }else if(scene==='oracles'){
      const k=state.width,p=Math.pow(.5,k),early=(1-p)/(.5*p),full=k/p,ratio=full/early;
      body=text(250,30,`${k} required tests per candidate`,18,'text-anchor="middle"');
      for(let i=0;i<Math.min(k,16);i++){const x=32+(i%8)*55,y=60+Math.floor(i/8)*38;body+=rect(x,y,43,26,i===1?'#efd5c5':colors.pale)+text(x+22,y+19,i===1?'fail':i===0?'pass':'?',11,'text-anchor="middle"');}
      body+=text(28,175,'Early rejection: stop at first failure',14)+text(28,214,`Expected elementary tests: ${early.toLocaleString()}`,14);
      body+=rect(28,231,430/ratio,20,colors.green)+text(28,282,`Complete rows: ${full.toLocaleString()} tests`,14)+rect(28,297,430,20,colors.orange);
      controls=`<div class="segmented" aria-label="Required tests">${[4,8,16].map(k=>`<button type="button" data-width="${k}" aria-pressed="${state.width===k}">k = ${k}</button>`).join('')}</div>`;
      note='IID pass probability ½; confirmed success and unlimited fresh candidates. Bars compare elementary work, not oracle calls.';
      status=`Full-row cost / early-rejection cost = ${ratio.toFixed(3)}. Both still grow exponentially with k.`;
    }else if(scene==='s4s'){
      const end=440,scale=390/1200,x=v=>50+v*scale;
      body=text(250,28,'Same mean. Different tail probabilities.',18,'text-anchor="middle"');
      body+=text(30,75,'Mechanism-induced law',15)+line(50,109,x(8),109,colors.green,'stroke-width="14"')+circle(x(8),109,5,colors.green)+text(90,115,'1/256  →  8 bits',15);
      body+=text(30,165,'Uniform-simplex volume',15)+rect(50,184,1102.091664*scale,16,colors.orange)+text(50,227,'0.05²⁵⁵  →  about 1,102 bits',15);
      body+=line(50,264,end,264,colors.ink);
      [0,400,800,1200].forEach(v=>body+=line(x(v),264,x(v),270)+text(x(v),290,String(v),12,'text-anchor="middle"'));
      body+=text(250,323,'−log₂(tail probability), in bits',14,'text-anchor="middle"');
      note='N = 256 categories; fixed external singleton target; threshold 0.95. Mechanism success exceeds the threshold after 37 evaluations. These are tail surprisals, not active-information gains.';
    }else if(scene==='results'){
      body=rect(20,20,460,83)+text(40,48,'Structured local search',18)+text(40,77,'64 loci · 415 evaluations · success ≈ 0.954',14);
      body+=rect(20,124,460,83)+text(40,153,'Finite-population tracking',18)+text(40,182,'Persistent environment + heritable variation',14);
      body+=rect(20,228,460,83)+text(40,257,'Resource-sensitive comparison',18)+text(40,286,'Equal calls can conceal unequal elementary work',14);
      note='Different models establish different endpoints. None is a theorem of universal adaptation or increasing organismal complexity.';
    }else{
      body=arrow+boxes(['Measure physical constraints and feedback','Connect traits to reproductive outcomes','Establish heredity and relevant variation','Specify the stronger endpoint and its costs'],20,76);
      note='Open tasks include empirical measurement, model construction, formal extensions and causal identification.';
    }
    $('figure').innerHTML=svg($('scene-label').textContent,body,scene==='foraging'?375:340);
    $('figure-note').textContent=note;
    const oldControls=$('controls').dataset.scene;
    // Keep range elements alive while dragging so pointer/keyboard focus is preserved.
    if(oldControls!==scene || scene!=='foraging'){$('controls').innerHTML=controls;$('controls').dataset.scene=scene;}
    if(scene==='foraging'){$('cost-value').textContent=state.cost.toFixed(2);$('beta-value').textContent=state.beta.toFixed(3);}
    $('graphic-status').textContent=status;
  }
  $('controls').addEventListener('input',event=>{
    if(event.target.id==='cost')state.cost=Number(event.target.value);
    if(event.target.id==='beta')state.beta=Number(event.target.value);
    if(event.target.id==='heredity')state.heredity=event.target.checked;
    paintScene();
  });
  $('controls').addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.ensemble)state.ensemble=button.dataset.ensemble;
    if(button.dataset.width)state.width=Number(button.dataset.width);
    paintScene();
    const selector=button.dataset.ensemble?`[data-ensemble="${state.ensemble}"]`:`[data-width="${state.width}"]`;
    $('controls').querySelector(selector)?.focus({preventScroll:true});
  });
  const steps=[...document.querySelectorAll('.step')];
  let scheduled=false;
  function updateScroll(){scheduled=false;const line=innerWidth<=680?Math.min(innerHeight*.63,480):innerHeight*.38;let chosen=steps[0];for(const step of steps){if(step.getBoundingClientRect().top<=line)chosen=step;}
    if(chosen.dataset.scene!==state.scene){state.scene=chosen.dataset.scene;paintScene();}}
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
  addEventListener('resize',updateScroll);

  const sourceList=$('source-list');
  sourceList.innerHTML=graph.sources.map(s=>{
    const authors=Array.isArray(s.authors)?s.authors.join('; '):(s.author||s.authors||'');
    const relevant=graph.nodes.filter(n=>n.source_ids?.includes(s.id));
    const anchors=[...new Set(relevant.flatMap(n=>(n.source_anchors||[]).filter(a=>a.source_id===s.id).map(a=>a.reference||a.locator)).filter(Boolean))];
    return `<article class="source-record" id="ref-${escape(s.id)}"><p class="type">${escape(s.kind||s.publication_type||s.venue||'Source record')}</p><h3>${s.url?`<a href="${escape(s.url)}" rel="noreferrer">${escape(s.title)}</a>`:escape(s.title)}</h3><p>${escape(authors)} · ${escape(s.year)}${s.edition?' · '+escape(s.edition):''}</p>${s.inspected||s.access?`<p><strong>Inspection:</strong> ${escape(s.access||s.inspected)}</p>`:''}${s.measured_endpoint?`<p><strong>Measured:</strong> ${escape(s.measured_endpoint)}</p>`:''}${s.does_not_establish?`<p><strong>Limit:</strong> ${escape(s.does_not_establish)}</p>`:''}<details><summary>Claim anchors (${relevant.length} linked records)</summary>${anchors.map(a=>`<p>${escape(a)}</p>`).join('')||`<p>${escape(s.locator||'See the source-specific claim and its stated access limit.')}</p>`}</details></article>`;
  }).join('');
  const selectable=graph.nodes.filter(n=>n.node_type!=='source');
  $('claim-select').innerHTML=selectable.map(n=>`<option value="${escape(n.id)}">${escape(n.id)} · ${escape(n.title)}</option>`).join('');
  function selectClaim(id){
    const n=nodeMap.get(id);if(!n)return;$('claim-select').value=id;
    const links=graph.edges.filter(e=>(e.source===id||e.target===id)&&!e.source.startsWith('source:'));
    const upstream=links.filter(e=>e.target===id),downstream=links.filter(e=>e.source===id);
    let body='';const centralY=35;
    body+=rect(15,centralY,470,64,colors.pale)+labelLines(32,centralY+25,n.title,49,15);
    const peers=[...upstream.map(e=>({id:e.source,relation:e.relation,direction:'Into this claim',note:e.note})),...downstream.map(e=>({id:e.target,relation:e.relation,direction:'From this claim',note:e.note}))];
    const shown=innerWidth<=680?3:7, pitch=innerWidth<=680?105:90;
    peers.slice(0,shown).forEach((e,i)=>{const y=132+i*pitch;body+=line(30,centralY+64,30,y+20,colors.line)+line(30,y+20,56,y+20,colors.line)+rect(56,y,428,pitch-12)+text(70,y+20,e.direction+' · '+e.relation.replaceAll('_',' '),11)+labelLines(70,y+43,nodeMap.get(e.id).title,innerWidth<=680?37:47,innerWidth<=680?17:12);});
    $('graph-visual').innerHTML=svg('Immediate relationships for '+n.title,body,Math.max(230,145+Math.min(peers.length,shown)*pitch));
    $('claim-detail').innerHTML=`<p class="claim-type">${escape(n.category.replaceAll('_',' '))} · ${escape((n.evidence_status||'').replaceAll('_',' '))}</p><h3>${escape(n.title)}</h3><p>${escape(n.statement)}</p><div class="boundary">${escape(n.qualification||'')}</div>${n.assumptions?.length?'<p><strong>Assumptions:</strong> '+escape(n.assumptions.join('; '))+'</p>':''}<p>${(n.source_ids||[]).map(s=>`<a href="#ref-${escape(s)}">${escape(graph.sources.find(x=>x.id===s)?.title||s)}</a>`).join(' · ')}</p><ul class="claim-links">${peers.map(e=>`<li><button type="button" data-claim="${escape(e.id)}">${escape(nodeMap.get(e.id).title)}</button><span class="relationship">${escape(e.direction)} · ${escape(e.relation.replaceAll('_',' '))}${e.note?' — '+escape(e.note):''}</span></li>`).join('')}</ul>${peers.length>shown?`<p>The graphic shows ${shown} relationships; the list retains all of them.</p>`:''}`;
  }
  $('claim-select').addEventListener('change',e=>selectClaim(e.target.value));
  $('claim-detail').addEventListener('click',e=>{const button=e.target.closest('[data-claim]');if(button)selectClaim(button.dataset.claim);});
  $('analysis-summary').innerHTML=`<p>${analysis.claim_count} claims, ${analysis.source_count} source records, ${analysis.edge_count} typed relationships. The conceptual-prerequisite subgraph is acyclic; the ecological influence loop is retained separately.</p><p><strong>Missing inference bridges:</strong></p><ul>${analysis.missing_inference_bridges.map(b=>`<li>${escape(b.missing)}</li>`).join('')}</ul><p>${escape(analysis.interpretation)}</p><p>${analysis.inherited_claims.length} earlier Notebook claims retain inherited review status. New source passages and model checks are identified separately.</p>`;
  paintScene();selectClaim('C08');updateScroll();
})();
