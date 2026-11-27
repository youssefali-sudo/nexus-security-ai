(()=>{
"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const STORE="nexus_v2_defensive_workspace";
const controls=[
 ["mfa","تفعيل المصادقة متعددة العوامل","للحسابات الإدارية والحسابات المهمة."],
 ["patch","إدارة التحديثات","تطبيق تحديثات الأمان وفق جدول واضح."],
 ["backup","نسخ احتياطي قابل للاستعادة","اختبار الاستعادة بشكل دوري."],
 ["least","أقل قدر من الصلاحيات","مراجعة صلاحيات المستخدمين والخدمات."],
 ["logs","مراجعة السجلات","تحديد مسؤول ومدة للاحتفاظ بالسجلات."],
 ["response","خطة استجابة للحوادث","تحديد جهات الاتصال وخطوات الإبلاغ."]
];
const initial={assets:[],incidents:[],checks:[],audit:[],logCount:0};
let state=load(),incidentFilter="all";
function load(){try{return {...initial,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch{return {...initial}}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state))}catch{notify("تعذر الحفظ المحلي؛ قد تكون مساحة المتصفح ممتلئة.")}renderAll()}
function log(action,detail){state.audit.unshift({id:Date.now()+Math.random(),action,detail,time:new Date().toISOString()});state.audit=state.audit.slice(0,150)}
function notify(s){const t=$("#toast");t.textContent=s;t.classList.add("show");clearTimeout(notify.timer);notify.timer=setTimeout(()=>t.classList.remove("show"),2400)}
function go(id){$$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+id));$$(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===id));$("#pageTitle").textContent=({overview:"نظرة عامة",assets:"الأصول والأجهزة",logs:"تحليل السجلات",incidents:"إدارة الحوادث",risk:"تقييم الضوابط",assistant:"المساعد الأمني",source:"مراجعة الكود · 24 لغة",reports:"التقارير",audit:"سجل التدقيق"})[id]||"NEXUS";if(id==="reports")renderReport();if(id==="audit")renderAudit()}
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
$$("[data-jump]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.jump)));
function modal(title,fields,onSave){const root=$("#modalRoot"),back=document.createElement("div");back.className="modal-backdrop";const box=document.createElement("div");box.className="modal";const h=document.createElement("h3");h.textContent=title;box.append(h);const form=document.createElement("form");fields.forEach(f=>{const wrap=document.createElement("div");wrap.className="field";const label=document.createElement("label");label.textContent=f.label;wrap.append(label);let input;if(f.options){input=document.createElement("select");f.options.forEach(o=>{const op=document.createElement("option");op.value=o[0];op.textContent=o[1];input.append(op)})}else{input=document.createElement("input");input.type=f.type||"text";input.placeholder=f.placeholder||""}input.name=f.name;input.required=!!f.required;wrap.append(input);form.append(wrap)});const actions=document.createElement("div");actions.className="modal-actions";const cancel=document.createElement("button");cancel.type="button";cancel.className="secondary";cancel.textContent="إلغاء";cancel.onclick=()=>root.replaceChildren();const submit=document.createElement("button");submit.type="submit";submit.className="primary";submit.textContent="حفظ";actions.append(cancel,submit);form.append(actions);form.onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));onSave(data);root.replaceChildren()};box.append(form);back.append(box);back.addEventListener("click",e=>{if(e.target===back)root.replaceChildren()});root.replaceChildren(back);form.querySelector("input,select")?.focus()}
function renderAssets(){const body=$("#assetRows");body.replaceChildren();const q=($("#assetSearch").value||"").toLowerCase();const rows=state.assets.filter(a=>(a.name+" "+a.type+" "+a.environment).toLowerCase().includes(q));rows.forEach(a=>{const tr=document.createElement("tr");[a.name,a.type,a.environment,a.criticality,a.status].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td)});const td=document.createElement("td"),del=document.createElement("button");del.className="table-action";del.textContent="حذف";del.onclick=()=>{if(confirm("حذف هذا الأصل من السجل المحلي؟")){state.assets=state.assets.filter(x=>x.id!==a.id);log("حذف أصل",a.name);save()}};td.append(del);tr.append(td);body.append(tr)});$("#assetEmpty").hidden=rows.length>0;$("#assetCount").textContent=state.assets.length+" أصل"}
$("#addAssetBtn").onclick=()=>modal("إضافة أصل جديد",[{name:"name",label:"اسم الأصل",required:true},{name:"type",label:"النوع",options:[["تطبيق ويب","تطبيق ويب"],["خادم","خادم"],["قاعدة بيانات","قاعدة بيانات"],["جهاز","جهاز"],["شبكة","شبكة"],["أخرى","أخرى"]]},{name:"environment",label:"البيئة",options:[["إنتاج","إنتاج"],["اختبار","اختبار"],["داخلية","داخلية"],["شخصية","شخصية"]]},{name:"criticality",label:"الأهمية",options:[["عالية","عالية"],["متوسطة","متوسطة"],["منخفضة","منخفضة"]]}],d=>{state.assets.unshift({id:Date.now(),...d,status:"قيد المراجعة"});log("إضافة أصل",d.name);save();notify("تمت إضافة الأصل")});
$("#assetSearch").addEventListener("input",renderAssets);
function renderIncidents(){const list=$("#incidentList");list.replaceChildren();const data=state.incidents.filter(i=>incidentFilter==="all"||i.status===incidentFilter);data.forEach(i=>{const card=document.createElement("article");card.className="incident-card";const info=document.createElement("div"),h=document.createElement("h3"),p=document.createElement("p"),meta=document.createElement("div");h.textContent=i.title;p.textContent=i.description||"لا يوجد وصف إضافي";meta.className="incident-meta";const sev=document.createElement("span");sev.className="badge "+(i.priority==="عالية"?"high":i.priority==="متوسطة"?"medium":"");sev.textContent="الأولوية: "+i.priority;const status=document.createElement("span");status.className="badge "+(i.status==="closed"?"closed":"");status.textContent=({open:"مفتوح",working:"قيد المعالجة",closed:"مغلق"})[i.status];meta.append(sev,status);info.append(h,p,meta);const actions=document.createElement("div");actions.className="incident-actions";const cycle=document.createElement("button");cycle.textContent="تحديث الحالة";cycle.onclick=()=>{i.status=({open:"working",working:"closed",closed:"open"})[i.status];log("تحديث حالة حادث",i.title+" — "+i.status);save()};const del=document.createElement("button");del.textContent="حذف";del.onclick=()=>{if(confirm("حذف الحادث من السجل المحلي؟")){state.incidents=state.incidents.filter(x=>x.id!==i.id);log("حذف حادث",i.title);save()}};actions.append(cycle,del);card.append(info,actions);list.append(card)});if(!data.length){const e=document.createElement("div");e.className="empty";e.textContent="لا توجد حوادث في هذا العرض.";list.append(e)}}
$("#addIncidentBtn").onclick=()=>modal("تسجيل ملاحظة أو حادث",[{name:"title",label:"عنوان الحادث",required:true},{name:"description",label:"وصف مختصر",placeholder:"لا تضف أسراراً أو بيانات شخصية."},{name:"priority",label:"الأولوية",options:[["منخفضة","منخفضة"],["متوسطة","متوسطة"],["عالية","عالية"]]}],d=>{state.incidents.unshift({id:Date.now(),...d,status:"open"});log("تسجيل حادث",d.title);save();notify("تم تسجيل الحادث")});
$$("[data-filter]").forEach(b=>b.onclick=()=>{incidentFilter=b.dataset.filter;$$("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderIncidents()});
function renderControls(){const wrap=$("#controlList");wrap.replaceChildren();controls.forEach(([id,title,desc])=>{const label=document.createElement("label");label.className="control";const input=document.createElement("input");input.type="checkbox";input.checked=state.checks.includes(id);input.onchange=()=>{state.checks=input.checked?[...state.checks,id]:state.checks.filter(x=>x!==id);log("تحديث ضابط",title);save()};const span=document.createElement("span"),b=document.createElement("b"),small=document.createElement("small");b.textContent=title;small.textContent=desc;span.append(b,small);label.append(input,span);wrap.append(label)});const pct=Math.round(state.checks.length/controls.length*100);$("#riskPercent").textContent=pct+"% مكتمل";$("#progressBar").style.width=pct+"%"}
$("#resetControls").onclick=()=>{if(confirm("إعادة ضبط جميع عناصر القائمة؟")){state.checks=[];log("إعادة ضبط قائمة الضوابط","كل العناصر");save()}};
const sample="2026-11-27T10:00:00Z LOGIN_FAILED user=demo\n2026-11-27T10:00:08Z LOGIN_FAILED user=demo\n2026-11-27T10:00:16Z LOGIN_FAILED user=demo\n2026-11-27T10:02:00Z LOGIN_SUCCESS user=demo\n2026-11-27T10:03:00Z ACCESS_DENIED resource=sample\n2026-11-27T10:04:00Z MFA_ENABLED user=demo";
$("#loadSample").onclick=()=>{$("#logInput").value=sample;notify("تم تحميل عينة توضيحية")};
$("#clearLogs").onclick=()=>{$("#logInput").value="";$("#logOutput").replaceChildren()};
$("#analyzeLogs").onclick=()=>{const lines=$("#logInput").value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!lines.length){notify("أضف سجلات أولاً");return}const counts=[["محاولات دخول فاشلة",lines.filter(x=>/LOGIN_FAILED|AUTH_FAILURE|INVALID_PASSWORD/i.test(x)).length],["حالات رفض وصول",lines.filter(x=>/ACCESS_DENIED|403|PERMISSION_DENIED/i.test(x)).length],["عمليات دخول ناجحة",lines.filter(x=>/LOGIN_SUCCESS|AUTH_SUCCESS/i.test(x)).length]];const out=$("#logOutput");out.replaceChildren();const grid=document.createElement("div");grid.className="result-grid";counts.forEach(([label,n])=>{const d=document.createElement("div"),s=document.createElement("small"),b=document.createElement("strong");d.className="result-box";s.textContent=label;b.textContent=n;d.append(s,b);grid.append(d)});const note=document.createElement("p");note.className="footnote";note.textContent="تمت مراجعة "+lines.length+" سطراً محلياً. هذه مؤشرات نصية أولية ولا تثبت وجود نشاط ضار.";out.append(grid,note);state.logCount+=lines.length;log("تحليل عينة سجلات",lines.length+" سطراً");save();notify("اكتمل التحليل المحلي")};
const knowledge=[[/mfa|مصادقة|عاملين/i,"المصادقة متعددة العوامل تضيف خطوة تحقق إضافية للحساب. فعّلها للحسابات المهمة، واحتفظ بطرق استرداد آمنة، وراجع الأجهزة والجلسات المسجلة."],[/backup|نسخ احتياطي|استعادة/i,"طبّق قاعدة نسخ احتياطي مناسبة لاحتياجك، واحمِ النسخ بالتشفير والصلاحيات، واختبر الاستعادة دورياً بدلاً من الاكتفاء بوجود النسخة."],[/least|صلاحيات|امتياز/i,"مبدأ أقل قدر من الصلاحيات يعني منح كل مستخدم أو خدمة ما يلزم لأداء عملها فقط، مع مراجعة الصلاحيات وإلغاء غير الضروري."],[/log|سجل|event/i,"ابدأ بتحديد مصدر السجل وتوقيته والمنطقة الزمنية والحساب المتأثر. قارن الأحداث بالسياق المعتاد، ولا تصنّف مؤشراً منفرداً كحادث مؤكد."],[/incident|حادث|استجابة/i,"وثّق وقت الملاحظة ومصدرها والأثر المحتمل، وحافظ على السجلات الأصلية، وصعّد الأمر وفق خطة الاستجابة المعتمدة في مؤسستك."] ];
$("#chatForm").onsubmit=e=>{e.preventDefault();const input=$("#chatInput"),q=input.value.trim();if(!q)return;appendBubble(q,"user");const answer=knowledge.find(([re])=>re.test(q))?.[1]||"أستطيع المساعدة في أساسيات الحماية الدفاعية وإدارة الأصول والسجلات والنسخ الاحتياطي والاستجابة للحوادث. اكتب سؤالك في هذا النطاق، وتجنب مشاركة كلمات المرور أو البيانات الحساسة.";appendBubble(answer,"bot");input.value=""};
function appendBubble(text,kind){const d=document.createElement("div");d.className="bubble "+kind;d.textContent=text;$("#chatMessages").append(d);d.scrollIntoView({behavior:"smooth",block:"nearest"})}
function reportData(){return {product:"NEXUS SECURITY AI",generatedAt:new Date().toISOString(),notice:"Local defensive workspace summary; not a certified security audit.",assets:state.assets,incidents:state.incidents,controls:{completed:state.checks.length,total:controls.length,items:controls.map(c=>({name:c[1],completed:state.checks.includes(c[0])}))},reviewedLogLines:state.logCount,auditEvents:state.audit.length}}
function renderReport(){const d=reportData();$("#reportPreview").textContent="NEXUS SECURITY AI — ملخص دفاعي\nوقت الإنشاء: "+new Date(d.generatedAt).toLocaleString("ar-EG")+"\n\nالأصول: "+d.assets.length+"\nالحوادث المفتوحة: "+d.incidents.filter(i=>i.status!=="closed").length+"\nالضوابط المكتملة: "+d.controls.completed+"/"+d.controls.total+"\nأسطر السجلات التي تمت مراجعتها: "+d.reviewedLogLines+"\n\nملاحظة: هذا ملخص محلي توعوي وليس تدقيقاً أمنياً معتمداً."}
function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$("#exportReport").onclick=()=>{renderReport();download("nexus-defensive-report.txt",$("#reportPreview").textContent,"text/plain;charset=utf-8");log("تصدير تقرير نصي","ملخص مساحة العمل");save();notify("تم تصدير التقرير")};
$("#exportJson").onclick=()=>{download("nexus-workspace-export.json",JSON.stringify(reportData(),null,2),"application/json");log("تصدير نسخة JSON","بيانات مساحة العمل");save();notify("تم تنزيل نسخة JSON")};
function renderAudit(){const list=$("#auditRows");list.replaceChildren();state.audit.forEach(a=>{const row=document.createElement("div");row.className="audit-item";const info=document.createElement("div"),b=document.createElement("b"),small=document.createElement("small"),time=document.createElement("time");b.textContent=a.action;small.textContent=a.detail;time.textContent=new Date(a.time).toLocaleString("ar-EG");info.append(b,small);row.append(info,time);list.append(row)});$("#auditEmpty").hidden=state.audit.length>0}
$("#clearAudit").onclick=()=>{if(confirm("مسح سجل التدقيق المحلي؟")){state.audit=[];save();notify("تم مسح السجل")}};
function renderOverview(){const open=state.incidents.filter(i=>i.status!=="closed").length,pct=Math.round(state.checks.length/controls.length*100);$("#metricAssets").textContent=state.assets.length;$("#metricIncidents").textContent=open;$("#metricControls").textContent=pct+"%";$("#metricLogs").textContent=state.logCount.toLocaleString("en");const box=$("#recentActivity");box.replaceChildren();if(!state.audit.length){box.className="activity empty";box.textContent="لا توجد نشاطات بعد. ابدأ بإضافة أصل أو تسجيل حادث.";return}box.className="activity";state.audit.slice(0,5).forEach(a=>{const d=document.createElement("div");d.className="activity-item";const s=document.createElement("span"),t=document.createElement("small");s.textContent=a.action+" — "+a.detail;t.textContent=new Date(a.time).toLocaleString("ar-EG");d.append(s,t);box.append(d)})}

const sourceRules=[
 ["NXS-SEC-001","high","احتمال وجود سر ثابت داخل الكود؛ استخدم مخزناً آمناً للأسرار.",/\b(?:password|passwd|api[_-]?key|secret|access[_-]?token)\b\s*[:=]\s*["'][^"'\r\n]{6,}["']/i],
 ["NXS-SEC-002","high","قد يكون التحقق من شهادة TLS معطلاً؛ راجع إعدادات الثقة.",/(?:verify\s*=\s*False|InsecureSkipVerify\s*:\s*true|rejectUnauthorized\s*:\s*false|CURLOPT_SSL_VERIFYPEER\s*,\s*false)/i],
 ["NXS-SEC-003","medium","يوجد نمط تقييم ديناميكي؛ تحقق من المدخلات وقيّد العمليات.",/\b(?:eval|exec|Invoke-Expression)\s*\(/i],
 ["NXS-SEC-004","medium","يوجد نمط تشغيل أوامر؛ راجع التعامل مع الوسائط والمدخلات غير الموثوقة.",/(?:subprocess\.(?:run|Popen|call)\s*\([^\n]*shell\s*=\s*True|\bos\.system\s*\(|\bshell_exec\s*\(|\bchild_process\.(?:exec|execSync)\s*\(|\bInvoke-Expression\b)/i],
 ["NXS-SEC-005","medium","قد يكون استعلام SQL مركباً ديناميكياً؛ فضّل الاستعلامات المعلّمة.",/(?:execute|query)\s*\(\s*(?:f["']|["'][^\n]*\+|format\s*\()/i]
];
$("#reviewSourceBtn").onclick=()=>{
 const code=$("#sourceCodeInput").value, language=$("#sourceLanguage").value, out=$("#sourceReviewOutput");
 out.replaceChildren();
 if(!code.trim()){notify("الصق الكود أولاً");return}
 const findings=[];
 sourceRules.forEach(([id,severity,summary,pattern])=>{
  let match;
  while((match=pattern.exec(code))!==null){
   findings.push({id,severity,summary,line:code.slice(0,match.index).split("\n").length});
   if(!pattern.global)break;
  }
 });
 findings.sort((a,b)=>a.line-b.line);
 const summary=document.createElement("div");summary.className="result-grid";
 [[ "اللغة",language.toUpperCase() ],["الأسطر",code.split(/\r?\n/).length],["المؤشرات",findings.length]].forEach(([label,value])=>{
  const box=document.createElement("div"),small=document.createElement("small"),strong=document.createElement("strong");
  box.className="result-box";small.textContent=label;strong.textContent=value;box.append(small,strong);summary.append(box);
 });
 out.append(summary);
 if(!findings.length){const empty=document.createElement("div");empty.className="empty";empty.textContent="لم تُرصد مؤشرات ضمن القواعد الحالية. هذا لا يعني أن الكود خالٍ من المشكلات.";out.append(empty)}
 findings.forEach(item=>{
  const card=document.createElement("article");card.className="incident-card";
  const info=document.createElement("div"),title=document.createElement("h3"),desc=document.createElement("p"),meta=document.createElement("div");
  title.textContent=item.id+" · السطر "+item.line;
  desc.textContent=item.summary;meta.className="incident-meta";
  const badge=document.createElement("span");badge.className="badge "+(item.severity==="high"?"high":"medium");badge.textContent=item.severity==="high"?"أولوية مرتفعة":"أولوية متوسطة";
  meta.append(badge);info.append(title,desc,meta);card.append(info);out.append(card);
 });
 const note=document.createElement("p");note.className="footnote";note.textContent="مؤشرات تقريبية فقط — لم يتم تشغيل أو إرسال الكود. راجع السياق يدوياً.";out.append(note);
 log("مراجعة كود محلية",language+" — "+findings.length+" مؤشرات");save();notify("اكتملت المراجعة المحلية");
};
$("#clearSourceBtn").onclick=()=>{$("#sourceCodeInput").value="";$("#sourceReviewOutput").replaceChildren()};

function renderAll(){renderAssets();renderIncidents();renderControls();renderOverview();renderAudit();renderReport()}
renderAll();
})();