
/* دخول المدير من DB */
$("aF").onsubmit=e=>{e.preventDefault();const a=DB.where("users",u=>u.role==="admin"&&u.email===$("aE").value&&u.pass===$("aP").value)[0];
 if(!a)return toast("✘");$("aL").classList.add("hidden");$("aA").classList.remove("hidden");go("d");};
function go(s){document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on",b.dataset.s===s));document.querySelectorAll("main section").forEach(x=>x.classList.remove("on"));$("s-"+s).classList.add("on");
 ({d:dash,ap:appr,st:studs,co:cours,pay:pays,cs:cases,du:dues,rp:reps,lk:links})[s]?.();}
/* 1 Dashboard حقيقي */
function dash(){const rev=DB.all("transactions").filter(t=>t.status==="مكتمل").reduce((a,b)=>a+b.amount,0);
 $("dS").innerHTML=`<div class="stat"><b>${DB.where("users",u=>u.role==="student").length}</b>الطلاب</div><div class="stat"><b>${DB.where("users",u=>u.role==="teacher"&&u.status==="active").length}</b>معلمون نشطون</div><div class="stat"><b>${DB.all("courses").length}</b>كورسات</div><div class="stat"><b>${rev}</b>الإيراد</div>`;
 $("dF").innerHTML=`<div class="stat" style="border-color:var(--gr)"><b>${share80(rev)}</b>نصيب المعلمين 80%</div><div class="stat"><b>${commission(rev)}</b>عمولة المنصة ${DB.cfg().commission}%</div><div class="stat" style="border-color:var(--r)"><b>${DB.where("users",u=>u.status==="pending").length+DB.where("cases",c=>c.status==="pending").length}</b>قيد المراجعة</div>`;}
/* 2 اعتمادات */
function appr(){$("apT").innerHTML="<tr><th>الكود</th><th>المعلم</th><th>المادة</th><th>كفيل</th><th>إجراء</th></tr>"+DB.where("users",u=>u.role==="teacher"&&u.status==="pending").map(t=>`<tr><td>${t.id}</td><td>${t.name}</td><td>${DB.get("subjects",t.subjectId)?.name||"—"}</td><td>${t.sponsor?"🤍":"—"}</td><td><button class="btn bg" onclick="DB.upd('users','${t.id}',{status:'active'});appr();toast('✔')">اعتماد</button> <button class="btn br" onclick="DB.del('users','${t.id}');appr();toast('✘')">رفض</button></td></tr>`).join("")||"<tr><td>لا معلق.</td></tr>";}
/* 3 طلاب */
function studs(){$("stT").innerHTML="<tr><th>الكود</th><th>الاسم</th><th>الصف/المسار</th><th>الحالة الاجتماعية</th><th>الحساب</th></tr>"+DB.where("users",u=>u.role==="student").map(s=>`<tr><td>${s.id}</td><td>${s.name}</td><td>${DB.get("grades",s.gradeId)?.name||"—"}/${DB.get("tracks",s.trackId)?.name||"—"}</td><td>${s.caseRole!=="none"?s.caseRole+" ("+(s.caseStatus||"pending")+")":"—"}</td><td>${s.status}</td></tr>`).join("");}
/* 4 كورسات */
function cours(){$("coT").innerHTML="<tr><th>الكود</th><th>الكورس</th><th>المعلم</th><th>الصف/المسار</th><th>السعر</th><th>مشتركون</th></tr>"+DB.all("courses").map(c=>`<tr><td>${c.id}</td><td>${c.title}</td><td>${tName(c.teacherId)}</td><td>${DB.get("grades",c.gradeId)?.name}/${DB.get("tracks",c.trackId)?.name}</td><td>${c.price}</td><td>${DB.where("enrollments",e=>e.courseId===c.id).length}</td></tr>`).join("");}
/* 5 مدفوعات */
function pays(){$("payT").innerHTML="<tr><th>الكود</th><th>الإيصال</th><th>الطالب</th><th>الكورس</th><th>المبلغ</th><th>الطريقة</th><th>الحالة</th></tr>"+DB.all("transactions").map(t=>`<tr><td>${t.id}</td><td>${t.receiptNo}</td><td>${tName(t.studentId)}</td><td>${DB.get("courses",t.courseId)?.title}</td><td>${t.amount}</td><td>${t.method}</td><td>${t.status}</td></tr>`).join("");}
function expPay(){expXLSX([["كود","إيصال","طالب","كورس","مبلغ","طريقة","حالة"],...DB.all("transactions").map(t=>[t.id,t.receiptNo,tName(t.studentId),DB.get("courses",t.courseId)?.title,t.amount,t.method,t.status])],"Multaqa-Payments");}
/* 6 حالات خاصة */
function cases(){$("csT").innerHTML="<tr><th>الكود</th><th>الطالب</th><th>الفئة</th><th>مستند</th><th>٪</th><th>إجراء</th></tr>"+DB.where("cases",c=>c.status==="pending").map(c=>`<tr><td>${c.id}</td><td>${tName(c.studentId)}</td><td>${c.category}</td><td>${c.doc||"—"}</td><td><input type="number" id="r_${c.id}" value="${c.rate}" style="width:70px"></td><td><button class="btn bg" onclick="ok('${c.id}','${c.studentId}')">اعتماد</button> <button class="btn br" onclick="DB.upd('cases','${c.id}',{status:'rejected'});cases();toast('✘')">رفض</button></td></tr>`).join("")||"<tr><td>لا معلق.</td></tr>";}
function ok(cid,sid){const r=+$("r_"+cid).value;DB.upd("cases",cid,{status:"approved",rate:r});DB.upd("users",sid,{caseStatus:"approved"});cases();toast("✔ اعتُمدت بالنسبة "+r);}
/* 7 مستحقات */
function dues(){const ts=DB.where("users",u=>u.role==="teacher");
 $("duT").innerHTML="<tr><th>المعلم</th><th>إجمالي المدفوع</th><th>مستحق 80%</th><th>عمولة المنصة</th></tr>"+ts.map(t=>{const g=DB.where("enrollments",e=>DB.all("courses").some(c=>c.id===e.courseId&&c.teacherId===t.id)).reduce((a,b)=>a+b.paid,0);return `<tr><td>${t.name}</td><td>${g}</td><td>${share80(g)}</td><td>${commission(g)}</td></tr>`;}).join("");}
/* 8 تقارير */
function reps(){const r=fullReport();const by={};r.forEach(x=>{by[x.suite]=by[x.suite]||{ok:0,no:0};by[x.suite][x.ok?"ok":"no"]++;});
 $("rpT").innerHTML="<tr><th>المجموعة</th><th>ناجح</th><th>فشل</th><th>الحالة</th></tr>"+Object.keys(by).map(k=>`<tr><td>${k}</td><td>${by[k].ok}</td><td>${by[k].no}</td><td>${by[k].no? '<span class="badge b-r">يحتاج معالجة</span>':'<span class="badge b-gr">مطابق</span>'}</td></tr>`).join("");}
function expRep(){expXLSX([["مجموعة","معيار","نتيجة"],...fullReport().map(r=>[r.suite,r.n,r.ok?"ناجح":"فشل"])],"Multaqa-Report");}
/* 9 روابط */
function links(){$("lkTb").innerHTML="<tr><th>الكود</th><th>العنوان</th><th>URL</th><th>الدور</th><th></th></tr>"+DB.all("links").map(l=>`<tr><td>${l.id}</td><td>${l.title}</td><td>${l.url}</td><td>${l.role}</td><td><button class="btn br" onclick="DB.del('links','${l.id}');links();toast('✘')">حذف</button></td></tr>`).join("");}
function addLk(){if(!$("lkT").value||!$("lkU").value)return toast("✘");DB.add("links",{title:$("lkT").value,url:$("lkU").value,role:$("lkR").value});$("lkT").value=$("lkU").value="";links();toast("✔");}
/* كلمة سر */
function chP(){const a=DB.where("users",u=>u.role==="admin")[0];
 if($("pE").value.trim()!==a.email)return toast("✘ البريد");if($("pO").value!==a.pass)return toast("✘ القديمة");if(!pw($("pN").value,"pAu"))return toast("✘ السياسة");
 DB.upd("users",a.id,{pass:$("pN").value});toast("📧 أُرسلت للبريد (محاكاة)");}
function expXLSX(rows,name){if(window.XLSX){const w=XLSX.utils.aoa_to_sheet(rows),b=XLSX.utils.book_new();XLSX.utils.book_append_sheet(b,w,"data");XLSX.writeFile(b,name+".xlsx");toast("✔ XLSX حقيقي");}
 else{const c="\uFEFF"+rows.map(r=>r.join(",")).join("\n");const el=document.createElement("a");el.href=URL.createObjectURL(new Blob([c],{type:"text/csv"}));el.download=name+".csv";el.click();toast("⚠ CSV (يتوافق مع Excel)");}}
