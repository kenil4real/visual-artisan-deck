
(function(){
"use strict";
var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- mobile menu ---------- */
var burger = document.getElementById("burger");
var mmenu = document.getElementById("mmenu");
if (burger && mmenu) {
  function setMenu(open){
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mmenu.classList.toggle("open", open);
    mmenu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function(){
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  mmenu.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){ setMenu(false); });
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && mmenu.classList.contains("open")) setMenu(false);
  });
}

/* ---------- reveal on scroll ---------- */
(function reveal(){
  var els = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)){
    els.forEach(function(el){ el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, {threshold: 0.1, rootMargin: "0px 0px -4% 0px"});
  els.forEach(function(el){ io.observe(el); });
})();

/* ---------- count-up stats ---------- */
(function countUps(){
  var els = document.querySelectorAll(".count");
  function countUp(el){
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.getAttribute("data-target"));
    var fmt = el.getAttribute("data-format") || "int";
    function fmtVal(v){
      if (fmt === "dec") return v.toFixed(1);
      return Math.round(v).toLocaleString("en-US");
    }
    if (prefersReduced){ el.textContent = fmtVal(target); return; }
    var dur = 1400, t0 = null;
    el.textContent = fmtVal(0);
    function frame(t){
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmtVal(target * e);
      if (k < 1) requestAnimationFrame(frame);
      else el.textContent = fmtVal(target);
    }
    requestAnimationFrame(frame);
  }
  if (prefersReduced || !("IntersectionObserver" in window)){
    els.forEach(countUp); return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ countUp(e.target); io.unobserve(e.target); }
    });
  }, {threshold: 0.4});
  els.forEach(function(el){ io.observe(el); });
})();

/* ---------- Pulse dashboard ---------- */
var DASH = {
  "7D": {
    label: "Last 7 days",
    tip: "Trend: climbing — budget shifted to Google Search",
    rev: "$48,210", revD: "▲ +14.2%", leads: "126", leadsD: "▲ +31",
    cpl: "$38.40", cplD: "▼ −18.6%", roas: "5.1×", roasD: "▲ +0.4",
    series: [18,22,20,26,30,27,34,41,38,47,52,49,58,66]
  },
  "30D": {
    label: "Last 30 days",
    tip: "Trend: scaling — new creatives beat the control",
    rev: "$214,600", revD: "▲ +24.8%", leads: "612", leadsD: "▲ +148",
    cpl: "$31.90", cplD: "▼ −26.4%", roas: "5.4×", roasD: "▲ +0.7",
    series: [10,12,11,14,13,16,19,17,22,21,25,24,28,31,29,34,38,36,42,45,43,50,54,52,59,63,61,68,74,80]
  },
  "90D": {
    label: "Last 90 days",
    tip: "Trend: compounding — engine at full pace",
    rev: "$672,900", revD: "▲ +41.5%", leads: "1,904", leadsD: "▲ +612",
    cpl: "$27.10", cplD: "▼ −34.2%", roas: "5.9×", roasD: "▲ +1.2",
    series: [6,7,8,7,9,10,12,11,13,15,14,17,16,19,21,20,24,23,27,26,30,29,33,36,35,39,38,43,42,47,46,51,55,53,58,57,63,62,68,72,71,78,84,90,100]
  }
};
var svgNS = "http://www.w3.org/2000/svg";

function smoothPath(pts){
  if (pts.length < 2) return "";
  var d = "M" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
  for (var i = 0; i < pts.length - 1; i++){
    var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += "C" + c1x.toFixed(1) + "," + c1y.toFixed(1) + " " + c2x.toFixed(1) + "," + c2y.toFixed(1) + " " + p2[0].toFixed(1) + "," + p2[1].toFixed(1);
  }
  return d;
}

function svgEl(name, attrs){
  var n = document.createElementNS(svgNS, name);
  for (var k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

function renderChart(key, animate){
  var svg = document.getElementById("chart");
  if (!svg) return;
  var data = DASH[key];
  var W = 640, H = 240, padL = 44, padR = 14, padT = 14, padB = 28;
  var iw = W - padL - padR, ih = H - padT - padB;
  var min = Math.min.apply(null, data.series) * 0.8, max = Math.max.apply(null, data.series) * 1.06;
  var px = function(i){ return padL + (i / (data.series.length - 1)) * iw; };
  var py = function(v){ return padT + ih - ((v - min) / (max - min)) * ih; };
  svg.textContent = "";

  var defs = svgEl("defs", {});
  var grad = svgEl("linearGradient", {id: "areaG", x1: "0", y1: "0", x2: "0", y2: "1"});
  grad.appendChild(svgEl("stop", {offset: "0%", "stop-color": "#e8490f", "stop-opacity": "0.30"}));
  grad.appendChild(svgEl("stop", {offset: "100%", "stop-color": "#e8490f", "stop-opacity": "0"}));
  defs.appendChild(grad);
  svg.appendChild(defs);

  for (var gLine = 0; gLine <= 4; gLine++){
    var gy = padT + (ih / 4) * gLine;
    svg.appendChild(svgEl("line", {x1: padL, y1: gy, x2: W - padR, y2: gy, stroke: "rgba(24,20,16,.10)", "stroke-width": "1"}));
  }

  var pts = data.series.map(function(v, i){ return [px(i), py(v)]; });
  var lineD = smoothPath(pts);
  var areaD = lineD + "L" + pts[pts.length - 1][0].toFixed(1) + "," + (padT + ih) + "L" + pts[0][0].toFixed(1) + "," + (padT + ih) + "Z";

  var area = svgEl("path", {d: areaD, fill: "url(#areaG)"});
  if (animate && !prefersReduced){ area.style.opacity = "0"; area.style.transition = "opacity .8s ease .3s"; }
  svg.appendChild(area);

  var line = svgEl("path", {d: lineD, fill: "none", stroke: "#e8490f", "stroke-width": "2.5", "stroke-linecap": "round"});
  if (animate && !prefersReduced){
    var len = 0;
    try { len = line.getTotalLength(); } catch (err) { len = 0; }
    if (len > 0){
      line.style.strokeDasharray = String(len);
      line.style.strokeDashoffset = String(len);
      line.style.transition = "stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)";
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ line.style.strokeDashoffset = "0"; });
      });
    }
  }
  svg.appendChild(line);

  var step = Math.ceil(data.series.length / 6);
  pts.forEach(function(p, i){
    if (i % step !== 0 && i !== pts.length - 1) return;
    svg.appendChild(svgEl("circle", {cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: "3.2", fill: "#faf7ee", stroke: "#e8490f", "stroke-width": "2"}));
  });

  var last = pts[pts.length - 1];
  svg.appendChild(svgEl("circle", {cx: last[0].toFixed(1), cy: last[1].toFixed(1), r: "5", fill: "#e8490f"}));

  for (var t = 0; t < 5; t++){
    var idx = Math.round((data.series.length - 1) * t / 4);
    var tx = svgEl("text", {
      x: px(idx).toFixed(1), y: H - 8,
      "text-anchor": "middle",
      fill: "rgba(24,20,16,.40)",
      "font-size": "10",
      "font-family": "'IBM Plex Mono',monospace",
      "letter-spacing": "1"
    });
    tx.textContent = "P" + (idx + 1);
    svg.appendChild(tx);
  }

  if (area.style.opacity === "0"){
    requestAnimationFrame(function(){ area.style.opacity = "1"; });
  }
}

function setKPIs(key){
  var d = DASH[key];
  var map = [["kRev","rev"],["kLeads","leads"],["kCpl","cpl"],["kRoas","roas"],
             ["kRevD","revD"],["kLeadsD","leadsD"],["kCplD","cplD"],["kRoasD","roasD"]];
  map.forEach(function(pair){
    var n = document.getElementById(pair[0]);
    if (n) n.textContent = d[pair[1]];
  });
  var tot = document.getElementById("chartTotal"); if (tot) tot.textContent = d.rev;
  var rng = document.getElementById("chartRange"); if (rng) rng.textContent = d.label;
  var tip = document.getElementById("chartTip"); if (tip) tip.textContent = d.tip;
}

(function dashInit(){
  renderChart("7D", false);
  var tabs = document.querySelectorAll(".range-tabs button");
  tabs.forEach(function(btn){
    btn.addEventListener("click", function(){
      tabs.forEach(function(b){ b.setAttribute("aria-selected", "false"); });
      btn.setAttribute("aria-selected", "true");
      var key = btn.getAttribute("data-range");
      setKPIs(key);
      renderChart(key, true);
    });
  });
})();

/* channel bars animate on scroll into view */
(function channels(){
  var wrap = document.getElementById("channels");
  if (!wrap) return;
  var bars = wrap.querySelectorAll(".ch-bar i");
  function fillNow(){
    bars.forEach(function(b){ b.style.transition = "none"; b.style.width = b.getAttribute("data-w") + "%"; });
  }
  window.__fillChannels = fillNow;
  if (prefersReduced || !("IntersectionObserver" in window)){ fillNow(); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){
        bars.forEach(function(b, i){
          setTimeout(function(){ b.style.width = b.getAttribute("data-w") + "%"; }, i * 110);
        });
        io.disconnect();
      }
    });
  }, {threshold: 0.25});
  io.observe(wrap);
})();

/* ---------- review micro-forms: validate + confirm in place ---------- */
(function reviewForms(){
  var forms = document.querySelectorAll(".audit-form");
  if (!forms.length) return;

  function cleanHost(raw){
    var s = (raw || "").trim().toLowerCase();
    s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
    s = s.split("/")[0].split("?")[0].split("#")[0];
    s = s.replace(/:\d+$/, "").replace(/\.+$/, "");
    return s;
  }
  function isValidHost(s){
    if (!s || /\s/.test(s)) return false;
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(s)) return false;
    var tld = s.slice(s.lastIndexOf(".") + 1);
    return /^[a-z]{2,}$/.test(tld);
  }

  forms.forEach(function(form){
    var input = form.querySelector("input[name='website']");
    var box = form.closest(".audit-box, .final-box");
    var note = box ? box.querySelector(".form-note") : null;
    if (!input || !note) return;
    var original = note.innerHTML;
    note.setAttribute("tabindex", "-1");
    note.setAttribute("aria-live", "polite");

    var reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "Use a different website";
    reset.style.cssText = "display:none;margin-top:10px;background:none;border:0;border-bottom:1px solid currentColor;padding:0;font:600 11px/1.6 'IBM Plex Mono',monospace;letter-spacing:.08em;color:#274e3c;cursor:pointer";
    note.parentNode.insertBefore(reset, note.nextSibling);

    reset.addEventListener("click", function(){
      form.style.display = "";
      reset.style.display = "none";
      note.style.color = "";
      note.innerHTML = original;
      input.removeAttribute("aria-invalid");
      input.value = "";
      if (emailForm && emailForm.parentNode) emailForm.parentNode.removeChild(emailForm);
      emailForm = null;
      input.focus();
    });

    input.addEventListener("input", function(){
      if (input.getAttribute("aria-invalid") === "true"){
        input.removeAttribute("aria-invalid");
        note.style.color = "";
        note.innerHTML = original;
      }
    });

    function esc(s){
      return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
    }

    function showEmailStep(site){
      emailForm = document.createElement("form");
      emailForm.className = "audit-form";
      emailForm.setAttribute("novalidate", "");
      emailForm.innerHTML =
        '<input type="email" name="email" inputmode="email" autocomplete="email" placeholder="you@yourbusiness.com" aria-label="Your email address" />' +
        '<button class="btn btn-accent" type="submit">Send my review</button>';
      note.parentNode.insertBefore(emailForm, reset);
      var emInput = emailForm.querySelector("input[name='email']");
      var btn = emailForm.querySelector("button");
      emInput.focus();
      emailForm.addEventListener("submit", function(ev){
        ev.preventDefault();
        var em = emInput.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){
          note.style.color = "#bc3a08";
          note.innerHTML = "<b>That doesn&rsquo;t look like an email address.</b> We need it to send your PDF.";
          emInput.focus();
          emInput.select();
          return;
        }
        note.style.color = "";
        btn.disabled = true;
        btn.textContent = "Scoring your site\u2026";
        fetch("/api/growth-review", {
          method: "POST",
          headers: {"content-type": "application/json"},
          body: JSON.stringify({website: site, email: em})
        }).then(function(r){
          return r.json().then(function(j){ return {status: r.status, body: j}; });
        }).then(function(res){
          if (res.status === 200 && res.body && res.body.ok){
            emailForm.style.display = "none";
            note.innerHTML = "<b>&#10003; Done — your review is on its way to " + esc(em) + ".</b> Your scored PDF lands within the hour, from Divya herself. <b>We reply within one business day.</b>";
            reset.style.display = "inline-block";
          } else {
            btn.disabled = false;
            btn.textContent = "Send my review";
            note.style.color = "#bc3a08";
            note.innerHTML = "<b>Something didn&rsquo;t work.</b> " + esc((res.body && res.body.error) || "Please try again in a minute.");
          }
          note.focus();
        }).catch(function(){
          btn.disabled = false;
          btn.textContent = "Send my review";
          note.style.color = "#bc3a08";
          note.innerHTML = "<b>Something didn&rsquo;t work.</b> Check your connection and try again.";
          note.focus();
        });
      });
    }

    var emailForm = null;

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var site = cleanHost(input.value);
      if (!isValidHost(site)){
        input.setAttribute("aria-invalid", "true");
        note.style.color = "#bc3a08";
        note.innerHTML = "<b>That doesn&rsquo;t look like a website address.</b> Try yourbusiness.com &mdash; then we&rsquo;ll take it from there.";
        input.focus();
        input.select();
        return;
      }
      input.removeAttribute("aria-invalid");
      form.style.display = "none";
      note.style.color = "";
      if (input.getAttribute("aria-invalid") === "true"){
        input.removeAttribute("aria-invalid");
        note.style.color = "";
        note.innerHTML = original;
      }
    });

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var site = cleanHost(input.value);
      if (!isValidHost(site)){
        input.setAttribute("aria-invalid", "true");
        note.style.color = "#bc3a08";
        note.innerHTML = "<b>That doesn&rsquo;t look like a website address.</b> Try yourbusiness.com &mdash; then we&rsquo;ll take it from there.";
        input.focus();
        input.select();
        return;
      }
      input.removeAttribute("aria-invalid");
      form.style.display = "none";
      note.style.color = "";
      note.innerHTML = "<b>&#10003; Got it: " + esc(site) + ".</b> Where should we send your scored PDF?";
      showEmailStep(site);
      note.focus();
    });
  });
})();

/* ---------- safety net: never leave content hidden ---------- */
setTimeout(function(){
  document.querySelectorAll("[data-reveal]:not(.in)").forEach(function(el){ el.classList.add("in"); });
  document.querySelectorAll(".count").forEach(function(el){
    if (!el.dataset.done){
      el.dataset.done = "1";
      var target = parseFloat(el.getAttribute("data-target"));
      var fmt = el.getAttribute("data-format") || "int";
      el.textContent = fmt === "dec" ? target.toFixed(1) : Math.round(target).toLocaleString("en-US");
    }
  });
  if (window.__fillChannels) window.__fillChannels();
}, 6000);
})();



(function(){
"use strict";
var overlay=document.getElementById("calcOverlay");
var modal=overlay.querySelector(".calc-modal");
var closeBtn=document.getElementById("calcClose");
var title=document.getElementById("calcTitle");
var tabs=overlay.querySelectorAll(".calc-tabs button");
var panes={roas:document.getElementById("pane-roas"),budget:document.getElementById("pane-budget"),grader:document.getElementById("pane-grader")};
var names={roas:"ROAS Calculator",budget:"Ad-Budget Calculator",grader:"Google Profile Grader"};
var lastFocus=null;
function fmt(n){return "$"+Math.round(n).toLocaleString("en-US");}
function openPane(which){
  tabs.forEach(function(t){var on=t.dataset.pane===which;t.classList.toggle("on",on);t.setAttribute("aria-selected",on?"true":"false");});
  Object.keys(panes).forEach(function(k){panes[k].hidden=(k!==which);});
  title.textContent=names[which];
}
function openCalc(which){
  lastFocus=document.activeElement;
  openPane(which||"roas");
  overlay.hidden=false;
  document.body.style.overflow="hidden";
  closeBtn.focus();
}
function closeCalc(){
  overlay.hidden=true;
  document.body.style.overflow="";
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
closeBtn.addEventListener("click",closeCalc);
overlay.addEventListener("click",function(e){if(e.target===overlay)closeCalc();});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!overlay.hidden)closeCalc();});
tabs.forEach(function(t){t.addEventListener("click",function(){openPane(t.dataset.pane);});});
document.querySelectorAll("a.tool").forEach(function(card,idx){
  card.addEventListener("click",function(e){
    e.preventDefault();
    openCalc(idx===1?"budget":(idx===2?"grader":"roas"));
  });
});
function num(id){var v=parseFloat(document.getElementById(id).value);return (isFinite(v)&&v>=0)?v:NaN;}
document.getElementById("roasGo").addEventListener("click",function(){
  var spend=num("roasSpend"),rev=num("roasRev"),out=document.getElementById("roasOut");
  if(isNaN(spend)||isNaN(rev)||spend<=0){out.innerHTML="<b>Enter both numbers</b> — spend above zero, revenue as it is.";return;}
  var roas=rev/spend;
  var verdict=roas>=5?"Strong — this is worth scaling.":(roas>=3?"Solid — there's room to push it higher.":"Leaking — this is exactly what we'd fix first.");
  out.innerHTML="<div class='big'>"+roas.toFixed(1)+"&times; ROAS</div>"
    +"<div>One point of ROAS is worth <b>"+fmt(spend)+"/mo</b> to you.</div>"
    +"<div class='verdict'>"+verdict+"</div>";
});
document.getElementById("budGo").addEventListener("click",function(){
  var job=num("budJob"),close=num("budClose"),leads=num("budLeads"),out=document.getElementById("budOut");
  if(isNaN(job)||isNaN(close)||isNaN(leads)||job<=0||close<=0||close>100||leads<=0){out.innerHTML="<b>Fill all three fields</b> with numbers above zero (close rate 1&ndash;100).";return;}
  var customers=leads*close/100, revenue=customers*job, budget=revenue/5;
  out.innerHTML="<div>"+leads+" leads &times; "+close+"% close rate = <b>"+customers.toFixed(1)+" customers</b></div>"
    +"<div>"+customers.toFixed(1)+" customers &times; "+fmt(job)+" = <b>"+fmt(revenue)+" revenue</b></div>"
    +"<div class='big' style='margin-top:10px'>"+fmt(budget)+"/mo</div>"
    +"<div class='verdict'>Suggested ad budget at a 5&times; ROAS target. Ad spend stays in accounts you own.</div>";
});
var checks=document.getElementById("graderChecks").querySelectorAll("input[type=checkbox]");
function grade(){
  var out=document.getElementById("graderOut"),total=checks.length,done=0,missed=[];
  checks.forEach(function(c){if(c.checked)done++;else missed.push(c.value);});
  var score=Math.round(done/total*100);
  var g=score>=85?"A":(score>=70?"B":(score>=50?"C":"D"));
  var html="<div class='calc-score'>"+score+" / 100 — Grade "+g+"</div>";
  if(missed.length){html+="<div class='verdict'><b>Fix first:</b> "+missed.slice(0,3).join("; ")+".</div>";}
  else{html+="<div class='verdict'>Profile's in great shape — now it's about reviews and posts.</div>";}
  out.innerHTML=html;
}
checks.forEach(function(c){c.addEventListener("change",grade);});
/* back to top */
var toTop=document.getElementById("toTop");
if(toTop){
  var reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function ttToggle(){toTop.classList.toggle("show",window.scrollY>600);}
  window.addEventListener("scroll",ttToggle,{passive:true});
  ttToggle();
  toTop.addEventListener("click",function(){window.scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"});});
}
})();
