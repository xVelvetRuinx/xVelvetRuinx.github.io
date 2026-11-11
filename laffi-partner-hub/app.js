/*
 * Laffi Partner Hub — interactive, dependency-free reference implementation.
 * Copyright (c) 2026 — prototype for evaluation and adaptation.
 * WARNING: This front end uses browser localStorage and fictional seed records.
 * It is NOT a production database, authentication or payout implementation.
 */
(() => {
  'use strict';
  const STORAGE_KEY = 'laffi-partner-hub-demo-v1';
  const STAGES = ['awaiting', 'trial', 'active', 'paused', 'ended'];
  const READER_STAGES = ['registered', 'verified', 'qualified', 'retained', 'excluded'];
  const NAV = ['overview', 'creators', 'readers', 'activity', 'rewards', 'settings'];
  const app = document.getElementById('app-content');
  const dialog = document.getElementById('editor-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2}).format(n || 0);
  const fmt = n => new Intl.NumberFormat('en-US').format(n || 0);
  const age = days => new Date(Date.now() - days*86400000).toISOString();
  const dateLabel = iso => new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  const timeLabel = iso => new Date(iso).toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
  const title = s => s.charAt(0).toUpperCase()+s.slice(1);
  const pill = s => `<span class="pill ${escapeHtml(s)}">${escapeHtml(s === 'awaiting'?'Awaiting start':title(s))}</span>`;
  const initials = s => String(s).split(/[^a-zA-Z0-9]+/).filter(Boolean).map(w => w[0]).join('').slice(0,2).toUpperCase() || 'U';
  const iconFor = type => ({creator:'♙',reader:'◎',reward:'◇',work:'▤',system:'✦'})[type] || '✦';
  const makeCreator = (id,name,stage,works,review,chats,onboardingApproved,retentionApproved,days) => ({id, userId:`person-${id}`, name,stage,works,review,chats,onboardingApproved,retentionApproved,joinedAt:age(days)});
  function demoState() {
    const creators = [
      makeCreator('CR-1001','MoonlitQuill','active',7,1,520,true,true,92),
      makeCreator('CR-1002','VelvetNova','active',5,0,312,true,true,75),
      makeCreator('CR-1003','StoryGrove','active',6,2,203,true,false,36),
      makeCreator('CR-1004','WildInk','active',4,1,142,true,false,28),
      makeCreator('CR-1005','EclipseTales','trial',2,2,26,false,false,8),
      makeCreator('CR-1006','AstralScript','trial',1,1,15,false,false,4),
      makeCreator('CR-1007','RoseCinder','awaiting',0,0,0,false,false,2),
      makeCreator('CR-1008','SilverMoth','awaiting',0,0,0,false,false,1)
    ];
    const readers = Array.from({length:58}, (_,i) => {
      const num=i+1;
      const stage = num<=18?'retained':num<=34?'qualified':num<=43?'verified':'registered';
      return {id:`RD-${String(num).padStart(4,'0')}`, userId:num<=2?`person-CR-100${num}`:`person-reader-${num}`,name:`reader_${String(num).padStart(3,'0')}`,stage,joinedAt:age((num%24)+1),lastActiveAt:age(num<=34?num%3:Math.min(11,num%20)),eligibleCrystals:num<=12?150+num*43:0};
    });
    return {version:1,creators,readers,paidIds:['CR-1001:onboarding'],activity:[
      {id:'EV-1',type:'creator',at:age(.05),text:'SilverMoth entered the onboarding queue.',detail:'Awaiting first publication.'},
      {id:'EV-2',type:'work',at:age(.21),text:'MoonlitQuill submitted a new character.',detail:'One work is currently under review.'},
      {id:'EV-3',type:'reward',at:age(.55),text:'VelvetNova retention was verified.',detail:'Eligible for the proposed retention bonus.'},
      {id:'EV-4',type:'reader',at:age(1),text:'Two referred readers qualified.',detail:'Reader qualification recorded in sample data.'},
      {id:'EV-5',type:'creator',at:age(2),text:'EclipseTales entered trial.',detail:'First works submitted.'},
      {id:'EV-6',type:'system',at:age(3),text:'November reporting period opened.',detail:'Month-to-date metrics are illustrative.'}
    ],settings:{onboardingRate:15,retentionRate:10,milestoneMode:'combined',milestones:[20,60,120],referralLink:'https://laffi.app/?ref=DEMO_TEAM',reportingTimezone:'UTC'},updatedAt:new Date().toISOString()};
  }
  function validState(value) {
    return value && value.version === 1 && Array.isArray(value.creators) && Array.isArray(value.readers) && Array.isArray(value.activity) && Array.isArray(value.paidIds) && value.settings && Array.isArray(value.settings.milestones);
  }
  let state;
  try {state=JSON.parse(localStorage.getItem(STORAGE_KEY));if(!validState(state))throw Error('Invalid backup');}
  catch {state=demoState();}
  let view='overview';
  let listFilter='all';
  let search='';
  let activityFilter='all';
  let toastTimer;
  function persist() {state.updatedAt=new Date().toISOString();try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{/* Some sandboxed file viewers disallow localStorage; session edits still work. */}}
  function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000);}
  function activity(type,text,detail='') {state.activity.unshift({id:`EV-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,type,at:new Date().toISOString(),text,detail});state.activity=state.activity.slice(0,200);}
  const currentCreators = () => state.creators.filter(x=>x.stage!=='ended');
  const qualifiedReaders = () => state.readers.filter(x=>['qualified','retained'].includes(x.stage));
  const qualifiedCreators = () => state.creators.filter(x=>x.onboardingApproved && x.stage!=='ended');
  function milestonePeople() {
    let people=[];
    if(state.settings.milestoneMode!=='readers')people.push(...qualifiedCreators().map(x=>x.userId));
    if(state.settings.milestoneMode!=='creators')people.push(...qualifiedReaders().map(x=>x.userId));
    return new Set(people).size;
  }
  function rewards() {
    let items=[];
    for(const c of state.creators){
      if(c.onboardingApproved){const id=`${c.id}:onboarding`;items.push({id,creator:c.name,type:'Onboarding',amount:Number(state.settings.onboardingRate)||0,status:state.paidIds.includes(id)?'paid':'approved'});}
      if(c.retentionApproved){const id=`${c.id}:retention`;items.push({id,creator:c.name,type:'Retention',amount:Number(state.settings.retentionRate)||0,status:state.paidIds.includes(id)?'paid':'approved'});}
    }
    return items;
  }
  function metric(label,value,description,kind='purple',icon='✦') {
    return `<article class="metric ${kind}"><span class="mini-icon" aria-hidden="true">${icon}</span><div class="mini-label">${escapeHtml(label)}</div><div class="big-number num-mono">${escapeHtml(value)}</div><div class="descriptor">${escapeHtml(description)}</div></article>`;
  }
  function panelTitle(titleText, subtitle='', linkText='', linkView='') {
    return `<div class="panel-title"><div><h2>${escapeHtml(titleText)}</h2>${subtitle?`<p>${escapeHtml(subtitle)}</p>`:''}</div>${linkText?`<button class="text-link" data-action="navigate" data-to="${linkView}">${escapeHtml(linkText)} →</button>`:''}</div>`;
  }
  function getMonthWorks(){return state.creators.reduce((sum,x)=>sum+Number(x.works||0),0);}
  function getMonthReview(){return state.creators.reduce((sum,x)=>sum+Number(x.review||0),0);}
  function recentActivity(max=5,type='all'){
    const events = [...state.activity].filter(x=>type==='all'||x.type===type).sort((a,b)=>new Date(b.at)-new Date(a.at)).slice(0,max);
    return events.length?events.map(ev=>`<div class="timeline-item"><div class="timeline-icon">${iconFor(ev.type)}</div><div class="timeline-text"><strong>${escapeHtml(ev.text)}</strong><p>${escapeHtml(ev.detail)}</p><small>${timeLabel(ev.at)}</small></div></div>`).join(''):'<div class="empty-state">No activity matches this filter.</div>';
  }
  function pageHeader(kicker,heading,subtitle,actions=''){
    return `<div class="hero-line"><div class="hero-copy"><div class="eyebrow">${escapeHtml(kicker)}</div><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(subtitle)}</p></div>${actions?`<div class="button-row">${actions}</div>`:''}</div>`;
  }
  function demoBanner(){return `<div class="demo-banner"><div class="banner-left"><span class="info-icon">i</span><div><b>Interactive prototype</b> · Data stays in this browser. <small>No live accounts, payments, or chats are connected.</small></div></div><span class="pill trial">SAMPLE</span></div>`;}
  function renderOverview(){
    const team=currentCreators();const active=team.filter(x=>x.stage==='active').length;
    const trial=team.filter(x=>x.stage==='trial').length;
    const awaiting=team.filter(x=>x.stage==='awaiting').length;
    const approved=rewards().filter(x=>x.status==='approved');
    const mCount=milestonePeople();const milestones=[...state.settings.milestones].sort((a,b)=>a-b);
    const next=milestones.find(m=>m>mCount); const denominator=next||milestones.at(-1)||1;
    return pageHeader('TEAM LEAD DASHBOARD','Your team, at a glance','Recruitment, creator activity, reader retention, and eligibility in one place.',`<button class="button primary" data-action="add-creator">＋ Add creator</button><button class="button ghost" data-action="export-summary">↓ Export summary</button>`) +demoBanner()+
    `<div class="metric-grid">${metric('Current creators',team.length,`${active} active · ${trial} trial`,'pink','♙')}${metric('Referred readers',state.readers.length,`${qualifiedReaders().length} qualified or retained`,'purple','◎')}${metric('Works this month',getMonthWorks(),`${getMonthReview()} in review`,'mint','▤')}${metric('Approved bonuses',money(approved.reduce((s,x)=>s+x.amount,0)),`${approved.length} awaiting recorded payment`,'gold','◇')}</div>`+
    `<div class="two-columns"><section class="panel">${panelTitle('Creator pipeline','Current team status','All creators','creators')}<div class="stats-3"><div class="stat-tile"><strong>${active}</strong><span>Active creators</span></div><div class="stat-tile"><strong>${trial}</strong><span>In trial</span></div><div class="stat-tile"><strong>${awaiting}</strong><span>Awaiting start</span></div></div>${[ ['Active',active],['Trial',trial],['Awaiting start',awaiting] ].map(([k,v])=>`<div class="progress-line"><div class="progress-heading"><span>${k}</span><strong>${v} of ${team.length}</strong></div><div class="track"><span class="fill ${k==='Active'?'mint':''}" style="width:${team.length?100*v/team.length:0}%"></span></div></div>`).join('')}<div class="hint">A creator may be in the team without yet qualifying for a reward. Status is separate from bonus verification.</div></section>
    <section class="panel">${panelTitle('Recruitment milestones','Illustrative thresholds · configurable','Reward rules','settings')}<div class="eyebrow">QUALIFIED UNIQUE ACCOUNTS</div><div style="display:flex;align-items:baseline;gap:10px"><strong style="font-size:40px;letter-spacing:-.06em">${mCount}</strong><span class="muted">of ${next||denominator} ${next?'toward next milestone':'highest milestone reached'}</span></div><div class="track" style="margin:16px 0"><span class="fill" style="width:${Math.min(100,100*mCount/denominator)}%"></span></div><div class="status-list">${milestones.map(m=>`<div class="status-row"><span>${m} qualified ${state.settings.milestoneMode==='combined'?'accounts':state.settings.milestoneMode}</span>${mCount>=m?pill('active'):pill('pending')}</div>`).join('')}</div><div class="divider"></div><div class="hint">Combined counts deduplicate account IDs across readers and creators. Milestone dollar values are intentionally not configured.</div></section></div>`+
    `<div class="two-columns"><section class="panel">${panelTitle('Creators to check in with','Suggested follow-ups based on current demo stage','Open creator list','creators')}<div class="list-rows">${team.filter(x=>x.stage!=='active').slice(0,5).map(x=>`<div class="creator-mini"><span class="avatar">${initials(x.name)}</span><div class="mini-content"><strong>${escapeHtml(x.name)}</strong><small>${x.stage==='awaiting'?'Waiting for first work':x.stage==='trial'?'Trial work in progress':'Status review'}</small></div>${pill(x.stage)}<button class="text-link" data-action="edit-creator" data-id="${x.id}">View</button></div>`).join('')||'<p class="muted">No follow-ups identified.</p>'}</div></section><section class="panel">${panelTitle('Recent activity','Events are generated by demo interactions','Full activity','activity')}${recentActivity(4)}</section></div>`+
    `<section class="panel">${panelTitle('Shareable team invite','Placeholder link can be changed in Settings')}<div class="referral-box"><code>${escapeHtml(state.settings.referralLink)}</code><button class="button" data-action="copy-link">⧉ Copy</button></div><div class="caption">Replace the placeholder with an authorized Laffi partner referral link before real use.</div></section>`;
  }
  function creatorList(){
    const counts={all:state.creators.length,awaiting:0,trial:0,active:0,paused:0,ended:0};state.creators.forEach(c=>counts[c.stage]=(counts[c.stage]||0)+1);
    const rows=state.creators.filter(c=>(listFilter==='all'||c.stage===listFilter)&&(`${c.name} ${c.id}`.toLowerCase().includes(search.toLowerCase())));
    return pageHeader('CREATOR MANAGEMENT','Your creators','Track onboarding, publishing activity, support needs, and verified reward decisions.',`<button class="button primary" data-action="add-creator">＋ Add creator</button><button class="button ghost" data-action="export-creators">↓ CSV</button>`) +
    `<div class="callout"><span class="alert-icon">♙</span><div><strong>Reward eligibility requires explicit verification.</strong><br>Published works and creator status are visibility metrics; they do not automatically approve bonuses.</div></div>`+
    `<div class="page-tools"><span class="muted">${rows.length} creators shown</span><input id="list-search" class="search" placeholder="Search creator name or ID..." value="${escapeHtml(search)}" aria-label="Search creators"></div>`+
    `<div class="chips">${['all',...STAGES].map(k=>`<button class="chip ${listFilter===k?'selected':''}" data-action="list-filter" data-filter="${k}">${k==='all'?'All':k==='awaiting'?'Awaiting start':title(k)} <span>${counts[k]||0}</span></button>`).join('')}</div>`+
    `<section class="panel" style="padding:0"><div class="table-wrap" style="border:0"><table><thead><tr><th>Creator</th><th>Stage</th><th>Published</th><th>In review</th><th>Engagements</th><th>Bonuses</th></tr></thead><tbody>${rows.map(x=>`<tr data-edit-id="${x.id}" data-entity="creator" title="Open creator"><td><div class="person-cell"><span class="avatar">${initials(x.name)}</span><span><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.id)} · Joined ${dateLabel(x.joinedAt)}</small></span></div></td><td>${pill(x.stage)}</td><td class="num-mono">${fmt(x.works)}</td><td class="num-mono">${fmt(x.review)}</td><td class="num-mono">${fmt(x.chats)}</td><td>${x.onboardingApproved?'✓ Onboarded':'—'}${x.retentionApproved?' · ✓ Retained':''}</td></tr>`).join('')||`<tr><td colspan="6"><div class="empty-state"><strong>No creators found</strong>Try a different search or filter.</div></td></tr>`}</tbody></table></div><div class="table-note">Select a row to update a creator. Changes are stored locally for this demonstration.</div></section>`;
  }
  function readerList(){
    const count={all:state.readers.length,registered:0,verified:0,qualified:0,retained:0,excluded:0};state.readers.forEach(x=>count[x.stage]=(count[x.stage]||0)+1);
    const rows=state.readers.filter(r=>(listFilter==='all'||r.stage===listFilter)&&(`${r.name} ${r.id}`.toLowerCase().includes(search.toLowerCase())));
    return pageHeader('READER ACQUISITION','Reader recruitment','Separate new registrations, qualified activity, and true retention.',`<button class="button primary" data-action="add-reader">＋ Add reader</button><button class="button ghost" data-action="export-readers">↓ CSV</button>`)+
    `<div class="metric-grid">${metric('Total referrals',state.readers.length,'Attributed reader accounts','pink','◎')}${metric('Verified',state.readers.filter(r=>r.stage==='verified').length,'Verification only','purple','✓')}${metric('Qualified',qualifiedReaders().length,'Qualified + retained','mint','↗')}${metric('Retained',state.readers.filter(r=>r.stage==='retained').length,'Confirmed retention','gold','◷')}</div>`+
    `<div class="callout"><span class="alert-icon">◎</span><div><strong>Unique user attribution is central to the design.</strong><br>A person who is both a reader and creator can share the same account ID and is counted only once in combined milestones.</div></div>`+
    `<div class="page-tools"><span class="muted">${rows.length} readers shown</span><input id="list-search" class="search" placeholder="Search reader label or ID..." value="${escapeHtml(search)}" aria-label="Search readers"></div>`+
    `<div class="chips">${['all',...READER_STAGES].map(k=>`<button class="chip ${listFilter===k?'selected':''}" data-action="list-filter" data-filter="${k}">${title(k)} <span>${count[k]||0}</span></button>`).join('')}</div>`+
    `<section class="panel" style="padding:0"><div class="table-wrap" style="border:0"><table><thead><tr><th>Reader</th><th>Stage</th><th>Referred</th><th>Recent activity</th><th>Eligible Crystals*</th></tr></thead><tbody>${rows.map(r=>`<tr data-edit-id="${r.id}" data-entity="reader"><td><div class="person-cell"><span class="avatar">${initials(r.name)}</span><span><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.id)}</small></span></div></td><td>${pill(r.stage)}</td><td>${dateLabel(r.joinedAt)}</td><td>${dateLabel(r.lastActiveAt)}</td><td class="num-mono">${fmt(r.eligibleCrystals)}</td></tr>`).join('')||`<tr><td colspan="5"><div class="empty-state">No readers found.</div></td></tr>`}</tbody></table></div><div class="table-note">*Illustrative attribution only, not a Crystal balance, payable earnings figure, or Laffi verified transaction record.</div></section>`;
  }
  function activityPage(){
    const types=['all','creator','reader','work','reward','system'];
    return pageHeader('EVENT HISTORY','Activity feed','A transparent timeline of onboarding events, publishing updates, and verified changes.',`<button class="button ghost" data-action="export-activity">↓ CSV</button>`)+
    `<div class="chips">${types.map(t=>`<button class="chip ${activityFilter===t?'selected':''}" data-action="activity-filter" data-filter="${t}">${title(t)}</button>`).join('')}</div><section class="panel">${panelTitle('Team activity',`${state.activity.length} recent sample or locally created events`)}${recentActivity(100,activityFilter)}</section>`;
  }
  function rewardPage(){
    const rows=rewards();const approved=rows.filter(x=>x.status==='approved');const paid=rows.filter(x=>x.status==='paid');const payTotal=approved.reduce((s,x)=>s+x.amount,0);
    return pageHeader('PAYMENT TRANSPARENCY','Rewards & eligibility','View verified rewards separately from payments marked as completed.',`<button class="button ghost" data-action="export-rewards">↓ Export rewards CSV</button>`)+
    `<div class="callout"><span class="alert-icon">◇</span><div><strong>Proposed incentive settings, not official Laffi terms.</strong><br>Onboarding and retention amounts are configurable. Payment status changes here are local demonstration actions, not PayPal transfers or Laffi payout approvals.</div></div>`+
    `<div class="reward-grid">${metric('Awaiting payment',money(payTotal),`${approved.length} verified items`,'pink','◇')}${metric('Marked paid',money(paid.reduce((s,x)=>s+x.amount,0)),`${paid.length} demo records`,'mint','✓')}${metric('Total verified',money(rows.reduce((s,x)=>s+x.amount,0)),`${rows.length} bonus entries`,'purple','♙')}</div>`+
    `<div class="two-columns"><section class="panel">${panelTitle('Proposed bonus rules','Set in Settings; amounts update immediately')}<div class="status-list"><div class="status-row"><span>Verified onboarding</span><strong>${money(state.settings.onboardingRate)} per creator</strong></div><div class="status-row"><span>Verified retention</span><strong>${money(state.settings.retentionRate)} per creator</strong></div><div class="status-row"><span>Qualified-user milestones</span><strong>20 / 60 / 120</strong></div><div class="status-row"><span>Milestone payout values</span><strong class="muted">Not agreed</strong></div></div></section><section class="panel">${panelTitle('Creator revenue share','Separate from Team Lead bonuses')}<div class="summary-card"><strong>Separate ledger</strong><span>Creator Coin earnings and Crystal consumption must come from Laffi's verified settlement system.</span></div><div class="caption">The 40% / ≥20% creator campaign should not be automatically mixed into recruitment compensation.</div></section></div>`+
    `<section class="panel" style="padding:0"><div class="panel-title" style="padding:21px 20px 0"> <div><h2>Verified bonus ledger</h2><p>Demo payments are marked manually</p></div></div><div class="table-wrap" style="border:0"><table><thead><tr><th>Creator</th><th>Reward</th><th>Value</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>${escapeHtml(r.creator)}</strong><br><small class="muted">${escapeHtml(r.id)}</small></td><td>${r.type}</td><td>${money(r.amount)}</td><td>${pill(r.status)}</td><td><button class="button ghost" data-action="toggle-paid" data-id="${escapeHtml(r.id)}">${r.status==='paid'?'↶ Revert':'✓ Mark paid'}</button></td></tr>`).join('')||`<tr><td colspan="5"><div class="empty-state"><strong>No verified rewards</strong>Approve onboarding or retention on a creator profile to populate this ledger.</div></td></tr>`}</tbody></table></div></section>`;
  }
  function settingsPage(){
    const st=state.settings;
    return pageHeader('WORKSPACE CONFIGURATION','Settings & handoff','Adjust proposed program rules, export backups, or reset the sample workspace.',`<button class="button ghost" data-action="export-json">↓ Download JSON backup</button>`)+
    `<div class="callout"><span class="alert-icon">⚙</span><div><strong>Configuration only — no live platform connection.</strong><br>These settings model possible rules for discussion with Laffi. Final qualification requirements, program budgets, and data permissions must be approved by Laffi.</div></div>`+
    `<div class="setting-grid"><section class="panel"><h2>Proposed incentive amounts</h2><p class="muted">These are editable sample values.</p><form id="settings-form"><div class="form-columns"><div class="field"><label for="setting-onboarding">Creator onboarding ($)</label><input required id="setting-onboarding" name="onboardingRate" type="number" min="0" max="999999" step="0.01" value="${st.onboardingRate}"></div><div class="field"><label for="setting-retention">Creator retention ($)</label><input required id="setting-retention" name="retentionRate" type="number" min="0" max="999999" step="0.01" value="${st.retentionRate}"></div></div><div class="field"><label for="setting-mode">Milestone population</label><select id="setting-mode" name="milestoneMode"><option value="combined" ${st.milestoneMode==='combined'?'selected':''}>Unique creators + readers (combined)</option><option value="readers" ${st.milestoneMode==='readers'?'selected':''}>Qualified readers only</option><option value="creators" ${st.milestoneMode==='creators'?'selected':''}>Qualified creators only</option></select></div><div class="field"><label for="setting-thresholds">Milestone thresholds</label><input required id="setting-thresholds" name="milestones" placeholder="20,60,120" value="${escapeHtml(st.milestones.join(', '))}"><div class="field-help">Comma-separated positive whole numbers; no payment is assigned until approved.</div></div><div class="field"><label for="setting-url">Team referral link</label><input required id="setting-url" name="referralLink" type="url" value="${escapeHtml(st.referralLink)}"></div><button type="submit" class="button primary">Save settings</button></form></section>
    <section class="panel"><h2>Data and developer handoff</h2><p class="muted">Demo data is saved only on this device, in your browser.</p><div class="status-list"><div class="status-row"><span>Source of truth</span>${pill('pending')}</div><div class="status-row"><span>API integration</span><strong>Not connected</strong></div><div class="status-row"><span>Last local edit</span><strong>${timeLabel(state.updatedAt)}</strong></div><div class="status-row"><span>Payment processor</span><strong>Not connected</strong></div></div><div class="divider"></div><div class="action-panel"><button class="button" data-action="export-json">↓ Export data (JSON)</button><button class="button" data-action="import-json">↑ Import data (JSON)</button><button class="button danger" data-action="reset-data">↶ Reset demo</button></div><div class="setting-note"><strong>Production note:</strong> Replace localStorage with authenticated, server-controlled APIs. Use approved Laffi records for qualification and payout decisions. Never rely on the browser to approve compensation.</div><div class="source-code">GET /v1/partner/me\nGET /v1/partner/teams/:teamId/overview\nGET /v1/partner/teams/:teamId/creators\nGET /v1/partner/teams/:teamId/readers\nGET /v1/partner/teams/:teamId/activity\nGET /v1/partner/teams/:teamId/rewards</div><div class="caption">See README and docs/ in the source ZIP for API proposals, database model, and security requirements.</div></section></div>`;
  }
  function render(){
    view=location.hash.replace(/^#/, '').split('?')[0].toLowerCase(); if(!NAV.includes(view))view='overview';
    const labels={overview:'Overview',creators:'Creators',readers:'Readers',activity:'Activity',rewards:'Rewards',settings:'Settings'};
    document.title=`${labels[view]} — Laffi Partner Hub`;
    document.getElementById('breadcrumb-current').textContent=labels[view];
    document.querySelectorAll('[data-nav]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.nav===view);btn.setAttribute('aria-current',btn.dataset.nav===view?'page':'false');});
    const renderers={overview:renderOverview,creators:creatorList,readers:readerList,activity:activityPage,rewards:rewardPage,settings:settingsPage};
    app.innerHTML=`<div class="content">${renderers[view]()}</div>`;
  }
  function goto(next) {if(!NAV.includes(next))return;search='';listFilter='all';activityFilter='all';closeMenu();if(location.hash==='#'+next)render();else location.hash=next;window.scrollTo({top:0,behavior:'instant'});}
  function openEditor(entity,id){
    const editing=!!id;
    const existing=editing?(entity==='creator'?state.creators:state.readers).find(x=>x.id===id):null;
    if(editing&&!existing){toast('Record not found.');return;}
    const heading=editing?`Edit ${entity}`:`Add ${entity}`;
    const common=`<div class="field"><label for="person-name">Display name / anonymized label</label><input id="person-name" name="name" required maxlength="80" value="${escapeHtml(existing?.name||'')}" placeholder="${entity==='creator'?'Creator name':'reader_059'}"></div><div class="field"><label for="person-user-id">Unique Laffi account ID</label><input id="person-user-id" name="userId" maxlength="80" value="${escapeHtml(existing?.userId||'')}" placeholder="acct-... (demo ID if blank)"><span class="field-help">A shared account ID prevents duplicate combined-user milestone credit.</span></div>`;
    let extra='';
    if(entity==='creator'){
      extra=`<div class="field"><label for="stage">Creator stage</label><select id="stage" name="stage">${STAGES.map(x=>`<option value="${x}" ${(existing?.stage||'awaiting')===x?'selected':''}>${x==='awaiting'?'Awaiting start':title(x)}</option>`).join('')}</select></div><div class="form-columns"><div class="field"><label for="works">Works published this month</label><input id="works" name="works" type="number" min="0" max="100000" required value="${existing?.works||0}"></div><div class="field"><label for="review">Works in review</label><input id="review" name="review" type="number" min="0" max="100000" required value="${existing?.review||0}"></div></div><div class="field"><label for="chats">Reader engagement count (example only)</label><input id="chats" name="chats" type="number" min="0" max="100000000" required value="${existing?.chats||0}"></div><div class="field check"><input id="onboardingApproved" name="onboardingApproved" type="checkbox" ${existing?.onboardingApproved?'checked':''}><label for="onboardingApproved"><strong>Onboarding verification approved</strong><br>Checked only after an authorized reviewer confirms all agreed criteria.</label></div><div class="field check"><input id="retentionApproved" name="retentionApproved" type="checkbox" ${existing?.retentionApproved?'checked':''}><label for="retentionApproved"><strong>Retention verification approved</strong><br>Checked only after an authorized reviewer confirms the agreed retention period and criteria.</label></div>`;
    }else{
      extra=`<div class="field"><label for="stage">Reader qualification stage</label><select id="stage" name="stage">${READER_STAGES.map(x=>`<option value="${x}" ${(existing?.stage||'registered')===x?'selected':''}>${title(x)}</option>`).join('')}</select></div><div class="field"><label for="eligibleCrystals">Eligible Crystal activity (example count)</label><input id="eligibleCrystals" name="eligibleCrystals" type="number" min="0" max="100000000" required value="${existing?.eligibleCrystals||0}"></div><div class="setting-note">Only Laffi's verified referral, moderation, and billing records should establish qualification and eligibility in production.</div>`;
    }
    dialogContent.innerHTML=`<div class="dialog-head"><div><h2 id="dialog-title">${heading}</h2><p>${editing?escapeHtml(existing.id):'New fictional record for the local demo'}</p></div><button type="button" class="close-button" data-dialog-close aria-label="Close">×</button></div><form id="person-form" class="dialog-form" data-entity="${entity}" data-id="${escapeHtml(id||'')}">${common}${extra}<div class="dialog-actions"><button type="button" class="button ghost" data-dialog-close>Cancel</button><button type="submit" class="button primary">${editing?'Save changes':'Add to demo'}</button></div></form>`;
    dialog.showModal();
  }
  function savePerson(form){
    const entity=form.dataset.entity;const id=form.dataset.id;const editing=!!id;
    const data=new FormData(form);const name=String(data.get('name')||'').trim();
    if(!name){toast('Enter a display name.');return;}
    const collection=entity==='creator'?state.creators:state.readers;
    const old=editing?collection.find(x=>x.id===id):null;
    const newId=editing?id:`${entity==='creator'?'CR':'RD'}-${String(Date.now()).slice(-7)}`;
    const uId=String(data.get('userId')||'').trim()||`demo-person-${newId}`;
    const common={id:newId,userId:uId,name,stage:String(data.get('stage')),joinedAt:old?.joinedAt||new Date().toISOString()};
    let update;
    if(entity==='creator')update={...common,works:Number(data.get('works')),review:Number(data.get('review')),chats:Number(data.get('chats')),onboardingApproved:data.has('onboardingApproved'),retentionApproved:data.has('retentionApproved')};
    else update={...common,eligibleCrystals:Number(data.get('eligibleCrystals')),lastActiveAt:old?.lastActiveAt||new Date().toISOString()};
    if(editing)collection.splice(collection.indexOf(old),1,update);else collection.push(update);
    activity(entity,`${name} ${editing?'was updated':'was added to the team'}.`,`Current stage: ${update.stage}.`);
    persist();dialog.close();render();toast(`${title(entity)} ${editing?'updated':'added'}.`);
  }
  function csvValue(value) {let text=String(value??'');return /^[=+@\-\t\r]/.test(text)?`"'${text.replace(/"/g,'""')}"`:`"${text.replace(/"/g,'""')}"`;}
  function csv(rows){if(!rows.length)return '';const keys=Object.keys(rows[0]);return [keys.map(csvValue).join(','),...rows.map(r=>keys.map(k=>csvValue(r[k])).join(','))].join('\r\n');}
  function download(filename,contents,type){const url=URL.createObjectURL(new Blob([contents],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`Prepared ${filename}`);}
  function exportKind(kind){
    if(kind==='json')return download('laffi-partner-demo-backup.json',JSON.stringify(state,null,2),'application/json');
    let rows;
    if(kind==='creators')rows=state.creators;
    else if(kind==='readers')rows=state.readers;
    else if(kind==='activity')rows=state.activity;
    else if(kind==='rewards')rows=rewards();
    else {rows=[{record:'current_creators',value:currentCreators().length},{record:'qualified_readers',value:qualifiedReaders().length},{record:'unique_qualified_users',value:milestonePeople()},{record:'published_works',value:getMonthWorks()},{record:'in_review',value:getMonthReview()},{record:'approved_pending_bonus_usd',value:rewards().filter(r=>r.status==='approved').reduce((s,r)=>s+r.amount,0)}];kind='summary';}
    download(`laffi-${kind}-demo.csv`,csv(rows),'text/csv;charset=utf-8');
  }
  function closeMenu(){document.getElementById('sidebar').classList.remove('open');document.getElementById('menu-backdrop').hidden=true;}
  document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>goto(b.dataset.nav)));
  document.getElementById('menu-toggle').addEventListener('click',()=>{const sidebar=document.getElementById('sidebar');sidebar.classList.toggle('open');document.getElementById('menu-backdrop').hidden=!sidebar.classList.contains('open');});
  document.getElementById('menu-backdrop').addEventListener('click',closeMenu);
  document.getElementById('refresh-view').addEventListener('click',()=>{render();toast('Refreshed from local demo data.');});
  document.querySelectorAll('[data-dialog-close]').forEach(b=>b.addEventListener('click',()=>dialog.close()));
  dialogContent.addEventListener('click',e=>{if(e.target.closest('[data-dialog-close]'))dialog.close();});
  dialogContent.addEventListener('submit',e=>{if(e.target.id==='person-form'){e.preventDefault();savePerson(e.target);}});
  app.addEventListener('input',e=>{
    if(e.target.id==='list-search'){
      search=e.target.value;
      const start=e.target.selectionStart;
      render();const el=document.getElementById('list-search');if(el){el.focus();el.setSelectionRange(start,start);}
    }
  });
  app.addEventListener('submit',e=>{
    if(e.target.id!=='settings-form')return;
    e.preventDefault();const f=new FormData(e.target);
    const thresholds=String(f.get('milestones')).split(',').map(x=>Number(x.trim()));
    if(!thresholds.length||thresholds.some(x=>!Number.isSafeInteger(x)||x<=0)||new Set(thresholds).size!==thresholds.length){toast('Use unique positive milestone numbers, e.g. 20,60,120.');return;}
    state.settings={...state.settings,onboardingRate:Number(f.get('onboardingRate')),retentionRate:Number(f.get('retentionRate')),milestoneMode:String(f.get('milestoneMode')),milestones:thresholds.sort((a,b)=>a-b),referralLink:String(f.get('referralLink')).trim()};
    activity('system','Draft program settings updated.','Changes affect this browser only.');persist();render();toast('Draft settings saved.');
  });
  app.addEventListener('click',async e=>{
    const target=e.target.closest('[data-action]');
    if(!target){const row=e.target.closest('[data-edit-id]');if(row)openEditor(row.dataset.entity,row.dataset.editId);return;}
    const action=target.dataset.action;
    if(action==='navigate')return goto(target.dataset.to);
    if(action==='add-creator')return openEditor('creator');
    if(action==='add-reader')return openEditor('reader');
    if(action==='edit-creator')return openEditor('creator',target.dataset.id);
    if(action==='list-filter'){listFilter=target.dataset.filter;render();return;}
    if(action==='activity-filter'){activityFilter=target.dataset.filter;render();return;}
    if(action.startsWith('export-'))return exportKind(action.replace('export-',''));
    if(action==='copy-link'){
      try{await navigator.clipboard.writeText(state.settings.referralLink);toast('Referral link copied.');}
      catch{toast('Clipboard unavailable; select the link to copy it.');}
      return;
    }
    if(action==='toggle-paid'){
      const id=target.dataset.id; const idx=state.paidIds.indexOf(id);
      if(idx===-1)state.paidIds.push(id);else state.paidIds.splice(idx,1);
      activity('reward',idx===-1?'Demo reward marked as paid.':'Demo reward payment status reverted.',id);
      persist();render();toast('Demo ledger updated — no transfer was made.');return;
    }
    if(action==='import-json')return document.getElementById('import-file').click();
    if(action==='reset-data'){
      if(!confirm('Reset all local demo edits and restore fictional sample records?'))return;
      state=demoState();persist();listFilter='all';search='';activityFilter='all';render();toast('Sample data restored.');return;
    }
  });
  document.getElementById('import-file').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{const imported=JSON.parse(await file.text());if(!validState(imported))throw Error('Incompatible backup format');
      if(!confirm('Replace the current browser demo with this JSON backup?'))return;
      state=imported;activity('system','Local backup imported.','Demonstration records restored from JSON file.');persist();listFilter='all';search='';render();toast('Backup imported.');
    }catch(err){toast(`Import failed: ${err.message}`);}finally{e.target.value='';}
  });
  window.addEventListener('hashchange',render);
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  if(!location.hash)location.hash='overview';render();
})();