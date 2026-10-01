const $=i=>document.getElementById(i);
function toast(m){const d=document.createElement("div");d.textContent=m;d.style.cssText="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0D1B2A;color:#D4AF37;padding:10px 20px;border-radius:30px;z-index:99;font-weight:700";document.body.appendChild(d);setTimeout(()=>d.remove(),2500);}
function pw(v,id){const t=[[v.length>=8,"٨"],[/[A-Z]/,"كبير"],[/\d/,"رقم"],[/[^A-Za-z0-9]/,"رمز"]];$(id).innerHTML=t.map(x=>`<span class="${x[0]?'ok':'no'}">${x[0]?'✔':'✘'} ${x[1]}</span>`).join(" ");return t.every(x=>x[0]);}
const tName=id=>DB.get("users",id)?.name||"—";
