
let S={u:null,cart:[],lang:"py"};let mGrade="r_1",carI=0;
function show(w){["home","login","reg","wait","app"].forEach(v=>$("v-"+v).classList.add("hidden"));if(w!=="app")$("v-"+w).classList.remove("hidden");if(w==="home")carStart();}
/* كاروسيل */
let carT=null;function carN(){return $("slides").children.length;}
function carGo(i){carI=(i+carN())%carN();$("slides").style.transform=`translateX(${carI*100}%)`;$("dots").innerHTML=Array.from({length:carN()},(_,x)=>`<i class="${x===carI?'on':''}" onclick="carGo(${x})"></i>`).join("");}
function carP(n){carGo(carI+n);}
function carStart(){carGo(0);clearInterval(carT);carT=setInterval(()=>carP(1),5000);}
/* تسجيل */
function roleF(){const t=$("rgR").value==="teacher";$("rgTc").classList.toggle("hidden",!t);$("rgSc").classList.toggle("hidden",t);$("rgWw").classList.toggle("hidden",!t);}
function spOpen(cb){if(!cb.checked)return;const nm=$("rgN").value||"..........";
 om(`<h3>🤍 اتفاقية الكفالة</h3><p style="margin:10px 0;font-size:.88rem">أقر أنا الأستاذ/ <b>${nm}</b> بأنني أوافق على نظام الكفالة الذي تقوم به المنصة في خدمة المجتمع حيث تقدم خصومات لنوعيات معينه من الطلاب ونسب الخصم هي كالتالي:</p><ul style="font-size:.85rem;line-height:1.9;padding-inline-start:18px"><li>طلاب أبناء عاملين بالتربية والتعليم خصم 50٪</li><li>طلاب المحافظات الحدودية 50٪</li><li>طلاب ايتام 100٪</li></ul><div style="display:flex;gap:8px;margin-top:10px"><button class="btn bg" onclick="spClose(true)">موافق</button><button class="btn br" onclick="spClose(false)">غير موافق</button></div>`);}
function spClose(ok){$("rgSp").checked=ok;hm();toast(ok?"🤍 وُثقت الكفالة":"لم تُفعّل الكفالة");}
$("rgF").onsubmit=e=>{e.preventDefault();const role=$("rgR").value;
 if(!threeWords($("rgN").value))return toast("✘ الاسم ثلاثي");
 if(!natOK($("rgNat").value))return toast("✘ قومي 14 رقم");
 if(natTaken($("rgNat").value))return toast("✘ مسجل بالفعل");
 if(!phoneOK($("rgPh").value))return toast("✘ واتساب 010/011/012/015");
 if(role==="teacher"&&!phoneOK($("rgWal").value))return toast("✘ محفظة غير صحيحة");
 if(!gmailOK($("rgE").value))return toast("✘ Gmail مطلوب");
 if(!pw($("rgP").value,"rgPw"))return toast("✘ كلمة المرور");
 if(role==="teacher"&&!$("rgDoc").files.length)return toast("✘ مستند التدريس مطلوب");
 if(role==="teacher"&&$("rgS2").value&&$("rgS2").value===$("rgS1").value)return toast("✘ التخصصان متطابقان");
 if(role==="student"&&$("rgC").value!=="none"&&!$("rgDocS").files.length)return toast("✘ مستند الحالة مطلوب");
 if(!$("rgDecl").checked)return toast("✘ أقر بصحة البيانات");
 const u=DB.add("users",{role,name:$("rgN").value,nationalId:$("rgNat").value,phone:$("rgPh").value,wallet:role==="teacher"?$("rgWal").value:null,email:$("rgE").value,pass:$("rgP").value,status:role==="teacher"?"pending":"active",decl:true,subjectId:role==="teacher"?$("rgS1").value:null,subject2Id:role==="teacher"?$("rgS2").value||null:null,sponsor:role==="teacher"?$("rgSp").checked:false,caseRole:role==="student"?$("rgC").value:"none",caseStatus:role==="student"&&$("rgC").value!=="none"?"pending":null});
 if(role==="student"&&u.caseRole!=="none")DB.add("cases",{studentId:u.id,category:u.caseRole,rate:DB.cfg().caseRates[u.caseRole],doc:$("rgDocS").files[0]?.name||"",status:"pending"});
 toast(role==="teacher"?"⏳ بانتظار الاعتماد":"✔ تم التسجيل");S.u=u;role==="teacher"?show("wait"):enter();};
$("liF").onsubmit=e=>{e.preventDefault();const u=DB.where("users",x=>x.email===$("liE").value&&x.pass===$("liP").value&&x.role===$("liR").value)[0];
 if(!u)return toast("✘ بيانات خاطئة");DB.set("session",$("liRem").checked?{id:u.id}:null);S.u=u;u.role==="teacher"&&u.status==="pending"?show("wait"):enter();};
function quick(id){S.u=DB.get("users",id);S.u.role==="teacher"&&S.u.status==="pending"?show("wait"):enter();}
function logout(){S.u=null;S.cart=[];DB.set("session",null);show("home");}
function enter(){show("app");$("v-app").classList.remove("hidden");bn();go("home");ra();}
function caseOK(){return S.u.caseRole&&S.u.caseRole!=="none"&&S.u.caseStatus==="approved";}
function hasProg(){if(S.u.role==="teacher")return S.u.subjectId==="c_018"||S.u.subject2Id==="c_018";return DB.where("enrollments",e=>e.studentId===S.u.id).some(e=>DB.get("courses",e.courseId)?.subjectId==="c_018");}
function bn(){const t=S.u.role==="student"?[["home","🏠","الرئيسية"],["courses","📚 كورسات","تصفح الكورسات"],["cart","🛒","السلة"],["teachers","👨‍","المعلمون"],["subs","🎓","اشتراكاتي"],["exam","📝","الاختبارات"],["links","🔗","روابط هامة"],...(hasProg()?[[ "lab","💻","معمل الكود"]]:[]),["board","🖊️","السبورة"],["set","⚙️","الإعدادات"]]
 :[["home","🏠","الرئيسية"],["myc","📚 كورساتي","إدارة كورساتي"],["mys","👥","طلابي"],["acc","💰","حسابي"],["exam","📝","الاختبارات"],["links","🔗","روابط هامة"],...(hasProg()?[[ "lab","💻","معمل الكود"]]:[]),["board","🖊️","السبورة"],["set","⚙️","الإعدادات"]];
 $("nav").innerHTML=t.map(x=>`<button data-s="${x[0]}" title="${x[2]}" onclick="go('${x[0]}')">${x[1]}</button>`).join("");}
function go(s){document.querySelectorAll("nav.m button").forEach(b=>b.classList.toggle("on",b.dataset.s===s));document.querySelectorAll("main section").forEach(x=>x.classList.remove("on"));$("s-"+s).classList.add("on");S.sec=s;
 ({home:rH,courses:rc,cart:rCa,teachers:rT,subs:rSub,myc:rmc,mys:rms,acc:rA,exam:rE,links:rLk,lab:rLab,set:rSet})[s]?.();}
function ra(){$("av").innerHTML=S.u.img?`<img src="${S.u.img}">`:(S.u.avatar||(S.u.name||"؟")[0]);}
/* نجوم متدرجة */
function stars(r){const c=r>=4.5?"#2E9E6B":r>=3.5?"#7CC59A":r>=2.5?"#D4AF37":r>=1.5?"#E8D9A0":"#ffffff";const f=Math.round(r);let o="";for(let i=1;i<=5;i++)o+=`<span style="color:${i<=f?c:"#ffffff44"}">★</span>`;return `<span class="st" title="${r}">${o}</span>`;}
/* الرئيسية */
function rH(){$("hT").textContent="مرحباً، "+S.u.name;
 const st=S.u.role==="teacher"?[["👥",myStu().length],["📚",myCs().length],["⭐",ratingOf(S.u.id)]]:[["🎓",myEn().length],["🛒",S.cart.length],["🚪",DB.where("rooms",r=>r.studentIds.includes(S.u.id)).length]];
 $("hS").innerHTML=st.map(x=>`<div class="stat"><b>${x[1]}</b>${x[0]}</div>`).join("");
 $("hH").innerHTML="<p>🥇 سارة 98</p><p>🥈 كريم 95</p>";$("hA").innerHTML="<p>أحمد أتم الجبر</p>";$("hL").innerHTML=DB.all("links").slice(0,3).map(l=>`<p><a href="${l.url}" target="_blank" rel="noopener">${l.title}</a></p>`).join("");
 $("hBar").innerHTML=barsHTML(S.u.role==="teacher"?myRevByMonth():stuByMonth());}
function barsHTML(a){const mx=Math.max(...a.map(x=>x.v),1);return a.map(x=>`<div class="bar"><i style="height:${Math.max(x.v/mx*90,4)}px"></i><small>${x.l}</small></div>`).join("");}
function myRevByMonth(){const now=new Date();let a=[];for(let i=3;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const k=d.toISOString().slice(0,7);a.push({l:"ش"+(d.getMonth()+1),v:DB.all("transactions").filter(t=>t.status==="مكتمل"&&t.date.startsWith(k)&&myStu().some(e=>e.courseId===t.courseId)).reduce((s,t)=>s+t.amount,0)});}return a;}
function stuByMonth(){const now=new Date();let a=[];for(let i=3;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const k=d.toISOString().slice(0,7);a.push({l:"ش"+(d.getMonth()+1),v:DB.where("enrollments",e=>e.studentId===S.u.id&&e.start.startsWith(k)).length});}return a;}
/* كورسات الطالب: صف←نظام←مسار←مواد + مزدوجة */
function myEn(){return DB.where("enrollments",e=>e.studentId===S.u.id);}
function disc(c){const t=DB.get("users",c.teacherId);if(!caseOK()||!t?.sponsor)return 0;return DB.cfg().caseRates[S.u.caseRole]||0;}
function paid(c){return c.price*(1-disc(c)/100);}
function rc(){const g=$("cG").value;const sysL=systemsOf(g);let tr;
 if(!sysL.length){$("cSyW").style.display="none";$("cTw").style.display="none";tr="tr_1";}
 else{$("cSyW").style.display="";$("cTw").style.display="";
  $("cSys").innerHTML=sysL.map(s=>`<option value="${s.id}">${s.name}</option>`).join("");
  if(sysL.some(s=>s.id===S.u.lastSystem))$("cSys").value=S.u.lastSystem;
  const trs=tracksOf(g,$("cSys").value);$("cT").innerHTML=trs.map(t=>`<option value="${t.id}">${t.name}</option>`).join("");
  if(trs.some(t=>t.id===S.u.lastTrackId))$("cT").value=S.u.lastTrackId;tr=$("cT").value;}
 DB.upd("users",S.u.id,{lastGradeId:g,lastTrackId:tr,lastSystem:sysL.length?$("cSys").value:"both"});
 $("cSubs").innerHTML="<b style='font-size:.75rem'>مواد هذا المسار:</b> "+subjectsOfTrack(tr).map(x=>`<span class="chip k-${x.kind}">${x.name}</span>`).join("");
 let list=DB.where("courses",c=>c.gradeId===g&&c.trackId===tr);const s=$("cSort").value;
 list.sort((a,b)=>s==="votes"?votesOf(b.teacherId)-votesOf(a.teacherId):s==="enr"?enrCount(b.id)-enrCount(a.id):ratingOf(b.teacherId)-ratingOf(a.teacherId));
 const mine=list.filter(c=>myEn().some(e=>e.courseId===c.id)),avail=list.filter(c=>!mine.includes(c));
 $("cMine").innerHTML=mine.map(c=>card(c,true)).join("")||"<p>لا اشتراكات هنا.</p>";
 $("cAvail").innerHTML=avail.map(c=>card(c,false)).join("")||"<p>لا كورسات.</p>";}
function card(c,mine){const T=DB.get("users",c.teacherId),d=disc(c),inC=S.cart.some(x=>x.id===c.id);
 return `<div class="card"><h4>${c.title}</h4><p style="font-size:.78rem">${T?.name} ${caseOK()&&T?.sponsor?'<span class="badge b-g">🤍 داعم</span>':""}</p>
 <p style="font-size:.75rem">${stars(ratingOf(c.teacherId))} <small>(${votesOf(c.teacherId)} صوت)</small> — 👥${enrCount(c.id)}</p>
 ${d?`<p style="font-size:.78rem"><s>${c.price}</s> → <b>${paid(c)}</b></p>`:`<p style="font-size:.78rem"><b>${c.price}</b> ج</p>`}
 ${mine?'<button class="btn b-gr" disabled title="مشترك">✔ مشترك</button>':inC?'<button class="btn b-x" disabled title="في السلة">✔ في السلة</button>':`<button class="btn bn" title="أضف للسلة" onclick="ac('${c.id}')">🛒 أضف</button>`}</div>`;}
function ac(id){if(S.cart.some(x=>x.id===id)||myEn().some(e=>e.courseId===id))return toast("مكرر");S.cart.push(DB.get("courses",id));rCa();rc();toast("🛒");}
function rCa(){if(!S.cart.length){$("caT").innerHTML="<tr><td>فارغة</td></tr>";$("caTot").innerHTML="";return;}
 $("caT").innerHTML="<tr><th>الكورس</th><th>المعلم</th><th>قبل</th><th>بعد</th><th></th></tr>"+S.cart.map((c,i)=>`<tr><td>${c.title}</td><td>${tName(c.teacherId)}</td><td>${c.price}</td><td><b>${paid(c)}</b></td><td><button class="btn br" title="حذف" onclick="S.cart.splice(${i},1);rCa();rc()">✕</button></td></tr>`).join("");
 const o=S.cart.reduce((a,b)=>a+b.price,0),t=S.cart.reduce((a,b)=>a+paid(b),0);$("caTot").innerHTML=`<p>الأصلي <s>${o}</s> — المطلوب <b style="color:var(--g)">${t}</b></p>`;}
function co(){if(!S.cart.length)return toast("فارغة");om(`<h3>💳 الدفع</h3><label>الطريقة</label><select id="pm"><option>فودافون كاش</option><option>اتصالات كاش</option><option>WE Pay</option><option>Paymob</option><option>بطاقة</option></select><button class="btn bg" style="width:100%;margin-top:8px" onclick="pay()">ادفع</button>`);}
function pay(){const m=$("pm").value;
 const items=S.cart.map(c=>({courseId:c.id,amount:paid(c),discount:disc(c)}));
 requestPayment(S.u.id,items,m);
 S.cart=[];hm();rCa();rc();toast("⏳ استُلم طلبك — بانتظار مراجعة الإدارة");}
function rT(){$("tT").innerHTML="<tr><th>المعلم</th><th>المواد</th><th>التقييم</th><th>الحالة</th><th></th></tr>"+DB.where("users",u=>u.role==="teacher"&&u.status==="active").map(t=>`<tr><td>${t.name}</td><td>${[t.subjectId,t.subject2Id].filter(Boolean).map(s=>DB.get("subjects",s)?.name).join(" + ")}</td><td>${stars(ratingOf(t.id))} (${votesOf(t.id)})</td><td>${caseOK()&&t.sponsor?'<span class="badge b-g">🤍 داعم</span>':'<span class="badge b-x">معتمد</span>'}</td><td><button class="btn bl" title="تقييم" onclick="rateT('${t.id}')">قيّم</button></td></tr>`).join("");}
function rateT(id){om(`<h3>تقييم ${tName(id)}</h3><label>النجوم</label><select id="rs"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select><label>تعليق</label><textarea id="rc2"></textarea><button class="btn bg" style="width:100%;margin-top:8px" onclick="DB.add('ratings',{studentId:S.u.id,teacherId:'${id}',stars:+$('rs').value,comment:$('rc2').value});hm();rT();toast('✔')">إرسال</button>`);}
function rSub(){const pend=DB.where("transactions",t=>t.studentId===S.u.id&&t.status!=="مكتمل");
 $("myReq").innerHTML=pend.length?"<h4 style='margin:0 0 8px'>⏳ طلباتي</h4>"+pend.map(t=>`<div class="card" style="margin:8px 0"><h4>${DB.get("courses",t.courseId)?.title} <span class="badge ${t.status==='قيد المراجعة'?'b-x':'b-r'}">${t.status}</span></h4><p style="font-size:.78rem">إيصال ${t.receiptNo} — ${t.amount} ج — ${t.date}${t.status==='مرفوض'&&t.rejectReason?' — السبب: '+t.rejectReason:''}</p></div>`).join(""):"";
 $("subB").innerHTML=myEn().map(e=>{const c=DB.get("courses",e.courseId);return `<div class="card" style="margin:10px 0"><h4>${c?.title}</h4><p style="font-size:.78rem">${tName(c?.teacherId)} — ${e.start}→${e.end} — مدفوع ${e.paid} (خصم ${e.discount}%)</p><button class="btn bn" title="المحتوى" onclick="content('${c.id}')">📖 المحتوى</button></div>`;}).join("")||"<p>لا اشتراكات.</p>";
 $("myRooms").innerHTML=DB.where("rooms",r=>r.studentIds.includes(S.u.id)).map(r=>`<div class="card" style="margin:8px 0"><h4>🚪 ${r.name} <small>(${DB.get("courses",r.courseId)?.title})</small></h4><button class="btn bn" onclick="roomChat('${r.id}')">💬 فتح الحجرة</button></div>`).join("")||"<p>لا حجرات.</p>";}
function content(cid){om(`<h3>📖 المحتوى</h3>`+(DB.where("library",l=>l.courseId===cid).map(l=>`<p>• ${l.type}: ${l.title}</p>`).join("")||"<p>لا محتوى.</p>"));}
/* معلم: واجهة بالصف + حجرات */
function myCs(){return DB.where("courses",c=>c.teacherId===S.u.id);}
function myStu(){return myCs().flatMap(c=>DB.where("enrollments",e=>e.courseId===c.id));}
function mTab(g){mGrade=g;["tb1","tb2","tb3"].forEach((b,i)=>$(b).className="btn "+(["r_1","r_2","r_3"][i]===g?"bn":"bl"));rmc();}
function rmc(){$("mcS").textContent="موادي: "+[S.u.subjectId,S.u.subject2Id].filter(Boolean).map(s=>DB.get("subjects",s)?.name).join(" + ");
 $("mSub").innerHTML=[S.u.subjectId,S.u.subject2Id].filter(Boolean).map(s=>`<option value="${s}">${DB.get("subjects",s)?.name}</option>`).join("");
 const sysL=systemsOf(mGrade);let tr;
 if(!sysL.length){$("mSyW").style.display="none";$("mTW").style.display="none";tr="tr_1";}
 else{$("mSyW").style.display="";$("mTW").style.display="";$("mSys").innerHTML=sysL.map(s=>`<option value="${s.id}">${s.name}</option>`).join("");
  const trs=tracksOf(mGrade,$("mSys").value);$("mT").innerHTML=trs.map(t=>`<option value="${t.id}">${t.name}</option>`).join("");tr=$("mT").value;}
 $("mcL").innerHTML=myCs().filter(c=>c.gradeId===mGrade&&c.trackId===tr).map(c=>`<div class="card"><h4>${c.title}</h4><p style="font-size:.78rem">${c.price} ج — 👥${enrCount(c.id)}</p><button class="btn bn" title="حجرات" onclick="rooms('${c.id}')">🚪 حجرات</button></div>`).join("")||"<p>لا كورسات بهذا الصف.</p>";
 $("lT").innerHTML="<tr><th>النوع</th><th>العنوان</th><th>الموعد</th></tr>"+DB.where("library",l=>myCs().some(c=>c.id===l.courseId)).map(l=>`<tr><td>${l.type}</td><td>${l.title}</td><td>${l.when}</td></tr>`).join("");}
function addC(){const t=$("mcT").value;if(!t)return;const sysL=systemsOf(mGrade);const tr=sysL.length?$("mT").value:"tr_1";DB.add("courses",{teacherId:S.u.id,subjectId:$("mSub").value,title:t,gradeId:mGrade,trackId:tr,price:+$("mcP").value});$("mcT").value="";rmc();toast("✔");}
function addL(){const c=myCs()[0];if(!c)return toast("أضف كورساً");DB.add("library",{courseId:c.id,type:$("lTy").value,title:$("lTi").value||"(بدون)",when:$("lW").value||"فوري",grades:mGrade});rmc();toast("✔");}
/* حجرات */
function rooms(cId){om(`<h3>🚪 حجرات: ${DB.get("courses",cId)?.title}</h3><div id="rmB"></div><label>اسم حجرة جديدة</label><input id="rmN"><button class="btn bg" style="margin-top:6px" onclick="addRoom('${cId}')">+ إنشاء</button>`);renderRooms(cId);}
function addRoom(cId){const n=$("rmN").value;if(!n)return;DB.add("rooms",{courseId:cId,teacherId:S.u.id,name:n,studentIds:[]});renderRooms(cId);toast("✔");}
function renderRooms(cId){$("rmB").innerHTML=DB.where("rooms",r=>r.courseId===cId).map(r=>`<div class="card" style="margin:8px 0"><h4>${r.name} <span class="badge b-x">${r.studentIds.length} طالب</span></h4>
 <div>${DB.where("enrollments",e=>e.courseId===cId).map(e=>{const on=r.studentIds.includes(e.studentId);return `<label style="display:inline-flex;gap:4px;margin:4px"><input type="checkbox" ${on?"checked":""} onchange="togRoom('${r.id}','${e.studentId}',this.checked)"> ${tName(e.studentId)}</label>`;}).join("")||"<small>لا طلاب بالكورس</small>"}</div>
 <button class="btn bn" onclick="roomChat('${r.id}')">💬 فتح الحجرة</button></div>`).join("")||"<p>لا حجرات.</p>";}
function togRoom(rid,sid,on){const r=DB.get("rooms",rid);const a=r.studentIds.filter(x=>x!==sid);if(on)a.push(sid);DB.upd("rooms",rid,{studentIds:a});}
function roomChat(rid){const r=DB.get("rooms",rid);om(`<h3>🚪 ${r.name}</h3><div style="max-height:220px;overflow:auto;border:1px solid #eee;border-radius:8px;padding:8px">${(r.msgs||[]).map(m=>`<p style="font-size:.8rem"><b>${tName(m.who)}:</b> ${m.txt}</p>`).join("")||"<p>ابدأ الحوار…</p>"}</div><input id="chT" style="margin-top:6px"><button class="btn bg" style="margin-top:6px" onclick="sendCh('${rid}')">إرسال</button>`);}
function sendCh(rid){const t=$("chT").value;if(!t)return;const r=DB.get("rooms",rid);const m=r.msgs||[];m.push({who:S.u.id,txt:t});DB.upd("rooms",rid,{msgs:m});roomChat(rid);}
function rms(){$("msC").innerHTML=myCs().map(c=>`<option value="${c.id}">${c.title}</option>`).join("");
 $("stT").innerHTML="<tr><th>الطالب</th><th>البدء</th><th>النهاية</th><th>مدفوع</th><th>خصم</th></tr>"+DB.where("enrollments",x=>x.courseId===$("msC").value).map(x=>`<tr><td>${tName(x.studentId)}</td><td>${x.start}</td><td>${x.end}</td><td>${x.paid}</td><td>${x.discount}%</td></tr>`).join("")||"<tr><td>لا طلاب.</td></tr>";}
function rA(){let g=0;myStu().forEach(e=>g+=e.paid);
 $("aS").innerHTML=`<div class="stat"><b>${myStu().length}</b>اشتراكات</div><div class="stat"><b>${g}</b>الإجمالي</div><div class="stat"><b>${share80(g)}</b>نصيبي 80%</div>`;
 $("aBar").innerHTML=barsHTML(myRevByMonth());
 $("aT").innerHTML="<tr><th>الطالب</th><th>الكورس</th><th>مدفوع</th><th>نصيبي</th></tr>"+myStu().map(e=>`<tr><td>${tName(e.studentId)}</td><td>${DB.get("courses",e.courseId)?.title}</td><td>${e.paid}</td><td>${share80(e.paid)}</td></tr>`).join("");}
/* اختبارات + روابط + معمل + إعدادات */
function rE(){if(S.u.role==="teacher")return rET();const my=myEn().map(e=>e.courseId);
 $("exB").innerHTML=DB.where("exams",x=>my.includes(x.courseId)).map(x=>`<div class="card" style="margin:10px 0"><h4>${x.title}</h4><button class="btn bn" onclick="take('${x.id}')">أداء</button> <span id="r_${x.id}"></span></div>`).join("")||"<p>لا اختبارات.</p>";}
function take(id){const e=DB.get("exams",id);om(`<h3>${e.title}</h3>`+e.q.map((q,i)=>`<div style="margin:10px 0"><b>${q.q}</b>${q.ty==="mcq"?`<select id="q${i}">${q.o.map((o,x)=>`<option value="${x}">${o}</option>`).join("")}</select>`:q.ty==="tf"?`<select id="q${i}"><option value="true">صح</option><option value="false">خطأ</option></select>`:`<textarea id="q${i}"></textarea>`}</div>`).join("")+`<button class="btn bg" onclick="sub('${id}')">تسليم</button>`);}
function sub(id){const e=DB.get("exams",id);let sc=0;const ess=[];e.q.forEach((q,i)=>{const v=$("q"+i).value;
 if(q.ty==="mcq"&&+v===q.a)sc+=q.pts;if(q.ty==="tf"&&(v==="true")===q.a)sc+=q.pts;if(q.ty==="es")ess.push({q:q.q,ans:v});});
 DB.add("submissions",{examId:id,studentId:S.u.id,objScore:sc,essay:ess,status:"pending"});hm();$("r_"+id).innerHTML=`<span class="badge b-gr">الموضوعي ${sc}</span>`;toast("✔");}
function rET(){$("exB").innerHTML=`<div class="card"><h4>إنشاء اختبار</h4><input id="neT" placeholder="العنوان"><button class="btn bn" style="margin-top:6px" onclick="DB.add('exams',{teacherId:S.u.id,courseId:myCs()[0]?.id,title:$('neT').value||'اختبار',q:[{ty:'mcq',q:'2+2=',o:['3','4'],a:1,pts:2},{ty:'es',q:'اشرح',pts:5}]});toast('✔')">+ إنشاء</button></div><div class="card" style="margin-top:10px"><h4>تصحيح المقالي</h4><div id="grB"></div></div>`;
 $("grB").innerHTML=DB.where("submissions",x=>x.status==="pending").map(s=>`<div style="border-bottom:1px solid #eee;padding:8px"><b>${tName(s.studentId)}</b> — موضوعي ${s.objScore}<input id="fb_${s.id}" placeholder="تغذية"><input id="fs_${s.id}" type="number" placeholder="درجة" style="width:70px"> <button class="btn bg" onclick="DB.upd('submissions','${s.id}',{status:'graded',finalScore:+$('fs_${s.id}').value,feedback:$('fb_${s.id}').value});toast('✔')">تقييم</button></div>`).join("")||"<p>لا معلق.</p>";}
function rLk(){$("lkB").innerHTML=DB.where("links",l=>l.role==="both"||l.role===S.u.role).map(l=>`<div class="card"><h4><a href="${l.url}" target="_blank" rel="noopener" title="${l.title}">${l.title} ↗</a></h4></div>`).join("");}
let pyL=null;function loadPy(){if(!pyL)pyL=new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});return pyL;}
function rLab(){$("labB").innerHTML=`<div class="card"><div style="display:flex;gap:6px"><button class="btn bn" id="tp" title="بايثون" onclick="lt('py')">Python</button><button class="btn bl" id="tj" title="جافاسكريبت" onclick="lt('js')">JS</button><button class="btn bg" title="تشغيل" onclick="run()">▶</button></div><textarea id="code" class="ed" style="margin-top:8px">print("أهلاً")</textarea><div class="out" id="labO" style="margin-top:8px"></div></div>`;}
function lt(l){S.lang=l;$("tp").className="btn "+(l==="py"?"bn":"bl");$("tj").className="btn "+(l==="js"?"bn":"bl");}
async function run(){const c=$("code").value;
 if(S.lang==="js"){const f=document.createElement("iframe");f.sandbox="allow-scripts";f.style.display="none";
  f.srcdoc="<scr"+"ipt>const L=[];['log','error'].forEach(m=>console[m]=(...a)=>L.push(a.join(' ')));window.onerror=m=>L.push('✗ '+m);try{"+c+"}catch(e){L.push('✗ '+e.message)}parent.postMessage({s:'sb',o:L.join('\\n')||'(لا ناتج)'},'*');</scr"+"ipt>";
  const h=e=>{if(e.data?.s==="sb"){$("labO").textContent=e.data.o;window.removeEventListener("message",h);f.remove();}};window.addEventListener("message",h);document.body.appendChild(f);}
 else{$("labO").textContent="...";try{await loadPy();const py=await window.loadPyodide();let o="";py.setStdout({batched:t=>o+=t+"\n"});await py.runPythonAsync(c);$("labO").textContent=o||"(لا ناتج)";}catch(e){$("labO").textContent="✗ "+e.message;}}}
function rSet(){const AV=["👨‍🏫","‍🏫","‍💻","💻","","🦅"];$("avP").innerHTML=AV.map(a=>`<button class="btn bl" title="أفاتار" onclick="setAv('${a}')">${a}</button>`).join("");}
function setAv(a){DB.upd("users",S.u.id,{avatar:a,img:null});S.u.avatar=a;ra();toast("✔");}
function upAv(i){const f=i.files[0];if(!f||!f.type.startsWith("image/"))return toast("✘");if(f.size>1048576)return toast("✘ ≤1MB");const r=new FileReader();r.onload=e=>{DB.upd("users",S.u.id,{img:e.target.result,avatar:null});S.u.img=e.target.result;ra();};r.readAsDataURL(f);}
function cp(){if(pw($("sW").value,"sPw")){DB.upd("users",S.u.id,{pass:$("sW").value});toast("✔");}}
function ss(q){if(!q)return;document.querySelectorAll("#s-"+S.sec+" .card, #s-"+S.sec+" tr").forEach(el=>el.style.display=el.textContent.includes(q)?"":"none");}
function om(h){$("mdB").innerHTML=h;$("md").classList.remove("hidden");}function hm(){$("md").classList.add("hidden");}
function lg(k){om(`<h3>${k==="t"?"شروط":k==="p"?"خصوصية":"الكفالة"}</h3><p style="margin:10px 0">نص تجريبي.</p>`);}
/* تهيئة */
$("rgS1").innerHTML=DB.all("subjects").map(s=>`<option value="${s.id}">${s.name}</option>`).join("");
$("rgS2").innerHTML="<option value=''>بدون</option>"+DB.all("subjects").map(s=>`<option value="${s.id}">${s.name}</option>`).join("");
$("cG").innerHTML=DB.all("grades").map(g=>`<option value="${g.id}">${g.name}</option>`).join("");
$("hStats").innerHTML=`<div class="stat"><b>${DB.where("users",u=>u.role==="student").length}</b>طالب</div><div class="stat"><b>${DB.where("users",u=>u.role==="teacher").length}</b>معلم</div><div class="stat"><b>${DB.all("courses").length}</b>كورس</div><div class="stat"><b>${DB.all("links").length}</b>رابط</div>`;
const ses=DB.kv("session",null);if(ses?.id&&DB.get("users",ses.id)){S.u=DB.get("users",ses.id);S.u.role==="teacher"&&S.u.status==="pending"?show("wait"):enter();}else show("home");
roleF();
