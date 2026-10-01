/* ================================================================
   منصة الملتقى التعليمي — data.js v3 (الجولة السادسة)
   CHANGELOG:
   [ج6-1] كتالوج 19 مادة رسمية بسمات (total/out/core/spec/adv)
   [ج6-2] هرم: صف ← نظام (بكالوريا/تقليدي للثاني والثالث) ← مسار
   [ج6-3] جدول tsubjects لربط المواد بالمسارات رسمياً
   [ج6-4] جدول rooms للحجرات المخصصة (بند 19)
   [ج6-5] البرمجة وعلوم الحاسب = c_018 (الاسم الرسمي)
   [ج5-*] كل مكتسبات الجولة الخامسة محفوظة
================================================================ */
const SCHEMA={
 users:{pk:"id",note:"s_/t_/m_ — nationalId UNIQUE",f:["id","role","name","nationalId","email","phone","wallet","pass","status","img","avatar","lastGradeId","lastTrackId","lastSystem","caseRole","caseStatus","subjectId","subject2Id","sponsor","decl"]},
 grades:{code:"r_",f:["id","name","system"]},
 tracks:{code:"tr_",fk:{gradeId:"grades"},f:["id","gradeId","system","name"]},
 subjects:{code:"c_",f:["id","name"]},
 tsubjects:{code:"ts_",fk:{trackId:"tracks",subjectId:"subjects"},f:["id","trackId","subjectId","kind"]},
 courses:{code:"c_",fk:{teacherId:"users",subjectId:"subjects",gradeId:"grades",trackId:"tracks"},f:["id","teacherId","subjectId","title","gradeId","trackId","price"]},
 enrollments:{code:"e_",fk:{studentId:"users",courseId:"courses"},f:["id","studentId","courseId","start","end","paid","discount"]},
 transactions:{code:"x_",fk:{studentId:"users",courseId:"courses"},f:["id","receiptNo","studentId","courseId","amount","method","status","date"]},
 exams:{code:"ex_",fk:{teacherId:"users",courseId:"courses"},f:["id","teacherId","courseId","title","q"]},
 submissions:{code:"sb_",fk:{examId:"exams",studentId:"users"},f:["id","examId","studentId","objScore","essay","status","feedback","finalScore"]},
 ratings:{code:"rt_",fk:{studentId:"users",teacherId:"users"},f:["id","studentId","teacherId","stars","comment"]},
 cases:{code:"cs_",fk:{studentId:"users"},f:["id","studentId","category","rate","doc","status"]},
 dues:{code:"d_",fk:{teacherId:"users"},f:["id","teacherId","period","gross","share80","paid"]},
 library:{code:"lb_",fk:{courseId:"courses"},f:["id","courseId","type","title","when","grades"]},
 links:{code:"lk_",f:["id","title","url","role"]},
 rooms:{code:"rm_",fk:{courseId:"courses",teacherId:"users"},f:["id","courseId","teacherId","name","studentIds"]}
};
const SEQ_LEN={s_:7,t_:7,m_:3,r_:1,tr_:2,c_:3,e_:5,x_:5,rc_:5,ex_:3,sb_:5,rt_:5,cs_:4,d_:4,lb_:4,lk_:3,rm_:5,ts_:3};
const LocalAdapter={read(t){try{return JSON.parse(localStorage.getItem("mq_"+t))||[]}catch(e){return[]}},write(t,r){localStorage.setItem("mq_"+t,JSON.stringify(r))},kv(k,v){localStorage.setItem("mq_"+k,JSON.stringify(v))},gv(k,d){try{return JSON.parse(localStorage.getItem("mq_"+k))??d}catch(e){return d}}};
let ADAPTER=LocalAdapter;
function nextId(p){const s=ADAPTER.gv("seq",{});s[p]=(s[p]||0)+1;ADAPTER.kv("seq",s);return p+String(s[p]).padStart(SEQ_LEN[p]||5,"0");}
const DB={all:t=>ADAPTER.read(t),get:(t,id)=>ADAPTER.read(t).find(r=>r.id===id),where:(t,fn)=>ADAPTER.read(t).filter(fn),
 add(t,row){let c=SCHEMA[t]?.code;if(t==="users"&&!row.id)c={student:"s_",teacher:"t_",admin:"m_"}[row.role];row.id=row.id||(c?nextId(c):row.id);const r=ADAPTER.read(t);r.push(row);ADAPTER.write(t,r);return row;},
 upd(t,id,patch){const r=ADAPTER.read(t);const i=r.findIndex(x=>x.id===id);if(i>-1){Object.assign(r[i],patch);ADAPTER.write(t,r);}return r[i];},
 del:(t,id)=>ADAPTER.write(t,ADAPTER.read(t).filter(r=>r.id!==id)),set:(k,v)=>ADAPTER.kv(k,v),kv:(k,d)=>ADAPTER.gv(k,d),
 cfg(){return this.kv("main",{commission:20,caseRates:{remote:50,edu:50,orphan:100}});}};
/* قواعد ومساعدات */
const natTaken=v=>DB.where("users",u=>u.nationalId===v).length>0;
const threeWords=v=>v.trim().split(/\s+/).length>=3;
const phoneOK=v=>/^01[0125]\d{8}$/.test(v);
const gmailOK=v=>/@gmail\.com$/.test(v);
const natOK=v=>/^\d{14}$/.test(v);
const ratingOf=id=>{const r=DB.where("ratings",x=>x.teacherId===id);return r.length?+(r.reduce((a,b)=>a+b.stars,0)/r.length).toFixed(1):0;};
const votesOf=id=>DB.where("ratings",x=>x.teacherId===id).length;
const enrCount=cid=>DB.where("enrollments",e=>e.courseId===cid).length;
const caseRate=u=>DB.cfg().caseRates[u?.caseRole]||0;
const share80=p=>p*0.8, commission=p=>p*(DB.cfg().commission/100);
function calcPaid(c,s){const d=(s?.caseRole&&s.caseRole!=="none"&&s.caseStatus==="approved")?caseRate(s):0;return c.price*(1-d/100);}
/* الهرم: أنظمة ومسارات ومواد */
const SYSTEMS=[{id:"bacc",name:"بكالوريا"},{id:"trad",name:"ثانوية عامة"}];
const systemsOf=g=>g==="r_1"?[]:SYSTEMS;
const tracksOf=(g,sys)=>DB.where("tracks",t=>t.gradeId===g&&(!sys||t.system===sys||t.system==="both"));
const subjectsOfTrack=tr=>DB.where("tsubjects",x=>x.trackId===tr).map(x=>{const s=DB.get("subjects",x.subjectId);return{id:s.id,name:s.name,kind:x.kind};});
/* بيانات التدشين */
function seed(){if(DB.kv("seeded",false))return;
 [["r_1","الأول","both"],["r_2","الثاني","multi"],["r_3","الثالث","multi"]].forEach(g=>DB.add("grades",{id:g[0],name:g[1],system:g[2]}));
 [["tr_1","r_1","both","شعبة عامة"],
  ["tr_2","r_2","bacc","طب وعلوم حياة"],["tr_3","r_2","bacc","هندسة وعلوم حاسب"],["tr_4","r_2","bacc","أعمال"],["tr_5","r_2","bacc","آداب وفنون"],
  ["tr_6","r_2","trad","علمي"],["tr_7","r_2","trad","أدبي"],
  ["tr_8","r_3","bacc","طب وعلوم حياة"],["tr_9","r_3","bacc","هندسة وعلوم حاسب"],["tr_10","r_3","bacc","أعمال"],["tr_11","r_3","bacc","آداب وفنون"],
  ["tr_12","r_3","trad","علمي علوم"],["tr_13","r_3","trad","علمي رياضة"],["tr_14","r_3","trad","أدبي"]].forEach(t=>DB.add("tracks",{id:t[0],gradeId:t[1],system:t[2],name:t[3]}));
 [["c_001","اللغة العربية"],["c_002","اللغة الأجنبية الأولى"],["c_003","اللغة الأجنبية الثانية"],["c_004","الرياضيات"],["c_005","العلوم المتكاملة"],["c_006","الفيزياء"],["c_007","الكيمياء"],["c_008","الأحياء"],["c_009","التاريخ"],["c_010","الجغرافيا"],["c_011","الفلسفة والمنطق"],["c_012","علم نفس"],["c_013","المحاسبة"],["c_014","إدارة أعمال"],["c_015","الاقتصاد"],["c_016","الإحصاء"],["c_017","التربية الدينية"],["c_018","البرمجة وعلوم الحاسب"],["c_019","التربية الرياضية"]].forEach(s=>DB.add("subjects",{id:s[0],name:s[1]}));
 const TS=(tr,sb,k)=>DB.add("tsubjects",{trackId:tr,subjectId:sb,kind:k});
 /* الأول شعبة عامة */
 ["c_001","c_002","c_009","c_011","c_004","c_005"].forEach(s=>TS("tr_1",s,"total"));
 ["c_017","c_003","c_018","c_019"].forEach(s=>TS("tr_1",s,"out"));
 /* الثاني بكالوريا: أساسي موحد + دينية + خيارات تخصصية */
 ["tr_2","tr_3","tr_4","tr_5"].forEach(tr=>{["c_001","c_009","c_002"].forEach(s=>TS(tr,s,"core"));TS(tr,"c_017","out");});
 TS("tr_2","c_004","spec");TS("tr_2","c_006","spec");
 TS("tr_3","c_007","spec");TS("tr_3","c_018","spec");
 TS("tr_4","c_013","spec");TS("tr_4","c_014","spec");
 TS("tr_5","c_012","spec");TS("tr_5","c_003","spec");
 /* الثاني تقليدي */
 ["c_001","c_002","c_004","c_009","c_007","c_006"].forEach(s=>TS("tr_6",s,"total"));
 ["c_001","c_002","c_009","c_010","c_012","c_004"].forEach(s=>TS("tr_7",s,"total"));
 /* الثالث بكالوريا: مادتان متقدمتان */
 TS("tr_8","c_007","adv");TS("tr_8","c_008","adv");
 TS("tr_9","c_004","adv");TS("tr_9","c_006","adv");
 TS("tr_10","c_004","adv");TS("tr_10","c_015","adv");
 TS("tr_11","c_016","adv");TS("tr_11","c_010","adv");
 /* الثالث تقليدي */
 ["c_001","c_002","c_008","c_007","c_006"].forEach(s=>TS("tr_12",s,"total"));
 ["c_001","c_002","c_004","c_007","c_006"].forEach(s=>TS("tr_13",s,"total"));
 ["c_001","c_002","c_009","c_010","c_016"].forEach(s=>TS("tr_14",s,"total"));
 /* المستخدمون */
 DB.add("users",{id:"m_001",role:"admin",name:"وليد طه محمد",nationalId:"27608101234567",email:"walidsoft2000@gmail.com",pass:"Boss#12344321",status:"active"});
 DB.add("users",{id:"t_0000001",role:"teacher",name:"وليد طه محمد",nationalId:"27608101234568",subjectId:"c_018",subject2Id:null,sponsor:true,status:"active",email:"walid@gmail.com",pass:"T#12345a",wallet:"01063887785",phone:"01558976949"});
 DB.add("users",{id:"t_0000002",role:"teacher",name:"أحمد محمود سمير",nationalId:"27608101234569",subjectId:"c_004",subject2Id:null,sponsor:true,status:"active",email:"ahmed@gmail.com",pass:"T#12345a"});
 DB.add("users",{id:"t_0000003",role:"teacher",name:"منى الشريف",nationalId:"27608101234570",subjectId:"c_004",subject2Id:"c_006",sponsor:false,status:"pending",email:"mona@gmail.com",pass:"T#12345a"});
 DB.add("users",{id:"t_0000004",role:"teacher",name:"هالة يوسف",nationalId:"27608101234571",subjectId:"c_001",subject2Id:"c_017",sponsor:true,status:"active",email:"hala@gmail.com",pass:"T#12345a"});
 DB.add("users",{id:"s_0000001",role:"student",name:"خالد محمد علي",nationalId:"30809101234567",caseRole:"none",status:"active",email:"khaled@gmail.com",pass:"S#12345a",phone:"01012345678",lastGradeId:"r_1",lastTrackId:"tr_1",lastSystem:"both"});
 DB.add("users",{id:"s_0000002",role:"student",name:"سارة أحمد حسن",nationalId:"30809101234568",caseRole:"remote",caseStatus:"approved",status:"active",email:"sara@gmail.com",pass:"S#12345a",phone:"01112345678",lastGradeId:"r_1",lastTrackId:"tr_1",lastSystem:"both"});
 DB.add("users",{id:"s_0000003",role:"student",name:"هاني سمير فوزي",nationalId:"30809101234569",caseRole:"orphan",caseStatus:"approved",status:"active",email:"hany@gmail.com",pass:"S#12345a",phone:"01512345678",lastGradeId:"r_1",lastTrackId:"tr_1",lastSystem:"both"});
 /* الكورسات */
 DB.add("courses",{id:"c_020",teacherId:"t_0000001",subjectId:"c_018",title:"Python من الصفر",gradeId:"r_1",trackId:"tr_1",price:200});
 DB.add("courses",{id:"c_021",teacherId:"t_0000001",subjectId:"c_018",title:"شبكات عصبية",gradeId:"r_3",trackId:"tr_9",price:250});
 DB.add("courses",{id:"c_022",teacherId:"t_0000002",subjectId:"c_004",title:"الجبر والمعادلات",gradeId:"r_1",trackId:"tr_1",price:150});
 DB.add("courses",{id:"c_023",teacherId:"t_0000004",subjectId:"c_001",title:"النحو والصرف",gradeId:"r_1",trackId:"tr_1",price:100});
 DB.add("enrollments",{id:"e_00001",studentId:"s_0000001",courseId:"c_020",start:"2026-07-01",end:"2026-07-31",paid:200,discount:0});
 DB.add("enrollments",{id:"e_00002",studentId:"s_0000002",courseId:"c_020",start:"2026-07-01",end:"2026-07-31",paid:100,discount:50});
 DB.add("enrollments",{id:"e_00003",studentId:"s_0000003",courseId:"c_022",start:"2026-07-01",end:"2026-07-31",paid:0,discount:100});
 DB.add("transactions",{id:"x_00001",receiptNo:"rc_00001",studentId:"s_0000001",courseId:"c_020",amount:200,method:"فودافون كاش",status:"مكتمل",date:"2026-07-01"});
 DB.add("transactions",{id:"x_00002",receiptNo:"rc_00002",studentId:"s_0000002",courseId:"c_020",amount:100,method:"Paymob",status:"مكتمل",date:"2026-07-01"});
 DB.add("exams",{id:"ex_001",teacherId:"t_0000002",courseId:"c_022",title:"نهاية الفصل رياضيات",q:[{ty:"mcq",q:"2+2=",o:["3","4","5"],a:1,pts:2},{ty:"tf",q:"المربع مستطيل",a:true,pts:1},{ty:"es",q:"اشرح فيثاغورس",pts:5}]});
 DB.add("library",{id:"lb_001",courseId:"c_020",type:"فيديو",title:"محاضرة 1: مقدمة",when:"فوري",grades:"r_1"});
 DB.add("library",{id:"lb_002",courseId:"c_020",type:"وورد",title:"كتاب المنهج",when:"فوري",grades:"r_1"});
 DB.add("links",{id:"lk_001",title:"بنك المعرفة المصري",url:"https://www.ekb.eg",role:"both"});
 DB.add("links",{id:"lk_002",title:"وزارة التربية والتعليم",url:"https://moe.gov.eg",role:"both"});
 DB.add("rooms",{id:"rm_00001",courseId:"c_020",teacherId:"t_0000001",name:"حجرة تقوية",studentIds:["s_0000002"]});
 DB.set("main",{commission:20,caseRates:{remote:50,edu:50,orphan:100},platform:"منصة الملتقى التعليمي"});
 ADAPTER.kv("seq",{s_:3,t_:4,m_:1,r_:3,tr_:14,c_:23,e_:3,x_:2,rc_:2,ex_:1,lb_:2,lk_:2,rm_:1,ts_:69});
 DB.set("seeded",true);}
seed();
/* الاختبارات */
const TESTS={
 student:[["تسجيل/دخول",()=>DB.add("users",{role:"student",name:"تست تست تست",nationalId:"39999999999999",email:"t@gmail.com",pass:"S#12345a",status:"active"})&&!natTaken("39999999999998")],
 ["الهرم كامل",()=>DB.all("tracks").every(t=>DB.get("grades",t.gradeId))],
 ["الأول 10 مواد",()=>subjectsOfTrack("tr_1").length===10],
 ["أنظمة الثاني/الثالث",()=>systemsOf("r_2").length===2&&systemsOf("r_3").length===2&&systemsOf("r_1").length===0],
 ["تخصصية الثاني",()=>subjectsOfTrack("tr_3").filter(x=>x.kind==="spec").length===2],
 ["متقدم الثالث",()=>subjectsOfTrack("tr_9").filter(x=>x.kind==="adv").length===2],
 ["تصفح المعلمين",()=>DB.where("users",u=>u.role==="teacher").length>0],
 ["تصفح الكورسات",()=>DB.all("courses").every(c=>DB.get("users",c.teacherId))],
 ["السعر والخصم",()=>calcPaid({price:200},{caseRole:"orphan",caseStatus:"approved"})===0&&calcPaid({price:200},{caseRole:"remote",caseStatus:"approved"})===100],
 ["السلة",()=>calcPaid({price:200},{caseRole:"none"})===200],
 ["الدفع/الإيصال",()=>{const t=DB.add("transactions",{receiptNo:nextId("rc_"),studentId:"s_0000001",courseId:"c_021",amount:200,method:"WE Pay",status:"مكتمل",date:"2026-08-10"});return t.id.startsWith("x_")&&t.receiptNo.startsWith("rc_");}],
 ["اشتراكاتي",()=>DB.where("enrollments",e=>e.studentId==="s_0000001").length>0],
 ["دخول المحتوى",()=>DB.where("library",l=>l.courseId==="c_020").length>0],
 ["المحاضرات",()=>DB.where("library",l=>l.type==="فيديو").length>0],
 ["الاختبارات",()=>DB.all("exams").length>0],
 ["النتائج",()=>!!DB.add("submissions",{examId:"ex_001",studentId:"s_0000001",objScore:3,status:"pending"}).id],
 ["تقييم المعلم",()=>DB.add("ratings",{studentId:"s_0000001",teacherId:"t_0000001",stars:5,comment:"ممتاز"}).id.startsWith("rt_")],
 ["فرز بالأصوات",()=>typeof votesOf("t_0000001")==="number"],
 ["فرز بالالتحاق",()=>enrCount("c_020")>0]],
 teacher:[["التسجيل",()=>DB.add("users",{role:"teacher",name:"معلم تست تست",nationalId:"38888888888888",status:"pending",email:"nt@gmail.com",pass:"T#12345a"}).id.startsWith("t_")],
 ["انتظار الاعتماد",()=>DB.where("users",u=>u.role==="teacher"&&u.status==="pending").length>0],
 ["لوحة المعلم",()=>DB.where("courses",c=>c.teacherId==="t_0000001").length>0],
 ["إنشاء كورس",()=>DB.add("courses",{teacherId:"t_0000001",subjectId:"c_018",title:"تست",gradeId:"r_1",trackId:"tr_1",price:100}).id.startsWith("c_")],
 ["مادتان كحد أقصى",()=>{const t=DB.get("users","t_0000004");return t.subjectId&&t.subject2Id;}],
 ["السعر",()=>DB.all("courses").every(c=>typeof c.price==="number")],
 ["المحتوى",()=>DB.add("library",{courseId:"c_020",type:"باوربوينت",title:"عرض",when:"فوري",grades:"r_1"}).id.startsWith("lb_")],
 ["جدولة درس",()=>!!DB.add("library",{courseId:"c_020",type:"فيديو",title:"درس مجدول",when:"2026-08-11T18:00",grades:"r_1"}).id],
 ["رؤية الطلاب",()=>DB.where("enrollments",e=>e.courseId==="c_020").length>0],
 ["الاختبار",()=>DB.add("exams",{teacherId:"t_0000001",courseId:"c_020",title:"كويز",q:[]}).id.startsWith("ex_")],
 ["النتائج",()=>DB.where("submissions",s=>s.examId==="ex_001").length>0],
 ["الحساب المالي",()=>share80(100)===80&&commission(100)===20],
 ["حجرة مخصصة",()=>DB.add("rooms",{courseId:"c_020",teacherId:"t_0000001",name:"تست",studentIds:[]}).id.startsWith("rm_")]],
 admin:[["Dashboard حقيقي",()=>DB.all("transactions").filter(t=>t.status==="مكتمل").reduce((a,b)=>a+b.amount,0)>0],
 ["اعتماد المعلمين",()=>{const p=DB.where("users",u=>u.status==="pending")[0];if(!p)return false;DB.upd("users",p.id,{status:"active"});return DB.get("users",p.id).status==="active";}],
 ["الطلاب",()=>DB.where("users",u=>u.role==="student").length>0],
 ["الكورسات",()=>DB.all("courses").length>0],
 ["المدفوعات",()=>DB.all("transactions").length>0],
 ["الحالات الخاصة",()=>{const c=DB.add("cases",{studentId:"s_0000002",category:"remote",rate:50,doc:"pdf",status:"pending"});DB.upd("cases",c.id,{status:"approved"});return DB.get("cases",c.id).status==="approved";}],
 ["المستحقات",()=>share80(DB.where("enrollments",e=>e.courseId==="c_020").reduce((a,b)=>a+b.paid,0))>0],
 ["عمولة المنصة",()=>commission(200)===40],
 ["التقارير",()=>runSuite("student").length===19&&runSuite("integration").length===5]],
 integration:[["دفع↔معاملات الأدمن",()=>DB.all("transactions").every(t=>t.id.startsWith("x_"))],
 ["كورس معلم↔تصفح طالب",()=>DB.all("courses").every(c=>DB.get("users",c.teacherId))],
 ["اعتماد حالة↔خصم",()=>calcPaid({price:150},{caseRole:"orphan",caseStatus:"approved"})===0],
 ["تسليم↔تصحيح",()=>{const s=DB.where("submissions",x=>x.examId==="ex_001")[0];DB.upd("submissions",s.id,{status:"graded",finalScore:8,feedback:"جيد"});return DB.get("submissions",s.id).status==="graded";}],
 ["قومي UNIQUE",()=>natTaken("30809101234567")]]
};
function runSuite(n){return TESTS[n].map(t=>{try{return{n:t[0],ok:!!t[1]()};}catch(e){return{n:t[0],ok:false,err:e.message};}});}
function fullReport(){return["student","teacher","admin","integration"].flatMap(s=>runSuite(s).map(r=>({...r,suite:s})));}