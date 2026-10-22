// Lenis Smooth Scroll
function t(t,i,e){return Math.max(t,Math.min(i,e))}var i=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(i){if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=i;const s=t(0,this.currentTime/this.duration,1);e=s>=1;const o=e?1:this.easing(s);this.value=this.from+(this.to-this.from)*o}else this.lerp?(this.value=function(t,i,e,s){return function(t,i,e){return(1-e)*t+e*i}(t,i,1-Math.exp(-e*s))}(this.value,this.to,60*this.lerp,i),Math.round(this.value)===this.to&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),this.onUpdate?.(this.value,e)}stop(){this.isRunning=!1}fromTo(t,i,{lerp:e,duration:s,easing:o,onStart:n,onUpdate:r}){this.from=this.value=t,this.to=i,this.lerp=e,this.duration=s,this.easing=o,this.currentTime=0,this.isRunning=!0,n?.(),this.onUpdate=r}};var e=class{constructor(t,i,{autoResize:e=!0,debounce:s=250}={}){this.wrapper=t,this.content=i,e&&(this.debouncedResize=function(t,i){let e;return function(...s){let o=this;clearTimeout(e),e=setTimeout((()=>{e=void 0,t.apply(o,s)}),i)}}(this.resize,s),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},s=class{events={};emit(t,...i){let e=this.events[t]||[];for(let t=0,s=e.length;t<s;t++)e[t]?.(...i)}on(t,i){return this.events[t]?.push(i)||(this.events[t]=[i]),()=>{this.events[t]=this.events[t]?.filter((t=>i!==t))}}off(t,i){this.events[t]=this.events[t]?.filter((t=>i!==t))}destroy(){this.events={}}},o=100/6,n={passive:!1},r=class{constructor(t,i={wheelMultiplier:1,touchMultiplier:1}){this.element=t,this.options=i,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,n),this.element.addEventListener("touchstart",this.onTouchStart,n),this.element.addEventListener("touchmove",this.onTouchMove,n),this.element.addEventListener("touchend",this.onTouchEnd,n)}touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new s;on(t,i){return this.emitter.on(t,i)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,n),this.element.removeEventListener("touchstart",this.onTouchStart,n),this.element.removeEventListener("touchmove",this.onTouchMove,n),this.element.removeEventListener("touchend",this.onTouchEnd,n)}onTouchStart=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{const{clientX:i,clientY:e}=t.targetTouches?t.targetTouches[0]:t,s=-(i-this.touchStart.x)*this.options.touchMultiplier,o=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=i,this.touchStart.y=e,this.lastDelta={x:s,y:o},this.emitter.emit("scroll",{deltaX:s,deltaY:o,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:i,deltaY:e,deltaMode:s}=t;i*=1===s?o:2===s?this.window.width:1,e*=1===s?o:2===s?this.window.height:1,i*=this.options.wheelMultiplier,e*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:i,deltaY:e,event:t})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},Lenis=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;__rafID=null;isTouching;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new i;emitter=new s;dimensions;virtualScroll;constructor({wrapper:t=window,content:i=document.documentElement,eventsTarget:s=t,smoothWheel:o=!0,syncTouch:n=!1,syncTouchLerp:l=.075,touchInertiaMultiplier:h=35,duration:a,easing:c=t=>Math.min(1,1.001-Math.pow(2,-10*t)),lerp:p=.1,infinite:d=!1,orientation:u="vertical",gestureOrientation:m="vertical",touchMultiplier:v=1,wheelMultiplier:S=1,autoResize:w=!0,prevent:g,virtualScroll:f,overscroll:y=!0,autoRaf:E=!1,anchors:T=!1,__experimental__naiveDimensions:z=!1}={}){window.lenisVersion="1.1.20",t&&t!==document.documentElement||(t=window),this.options={wrapper:t,content:i,eventsTarget:s,smoothWheel:o,syncTouch:n,syncTouchLerp:l,touchInertiaMultiplier:h,duration:a,easing:c,lerp:p,infinite:d,gestureOrientation:m,orientation:u,touchMultiplier:v,wheelMultiplier:S,autoResize:w,prevent:g,virtualScroll:f,overscroll:y,autoRaf:E,anchors:T,__experimental__naiveDimensions:z},this.dimensions=new e(t,i,{autoResize:w}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.addEventListener("click",this.onClick,!1),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown,!1),this.virtualScroll=new r(s,{touchMultiplier:v,wheelMultiplier:S}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown,!1),this.options.anchors&&this.options.wrapper===window&&this.options.wrapper.removeEventListener("click",this.onClick,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this.__rafID&&cancelAnimationFrame(this.__rafID)}on(t,i){return this.emitter.on(t,i)}off(t,i){return this.emitter.off(t,i)}onScrollEnd=t=>{t instanceof CustomEvent||"smooth"!==this.isScrolling&&!1!==this.isScrolling||t.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};setScroll(t){this.isHorizontal?this.options.wrapper.scrollTo({left:t,behavior:"instant"}):this.options.wrapper.scrollTo({top:t,behavior:"instant"})}onClick=t=>{const i=t.composedPath().find((t=>t instanceof HTMLAnchorElement&&t.getAttribute("href")?.startsWith("#")));if(i){const t=i.getAttribute("href");if(t){const i="object"==typeof this.options.anchors&&this.options.anchors?this.options.anchors:void 0;this.scrollTo(t,i)}}};onPointerDown=t=>{1===t.button&&this.reset()};onVirtualScroll=t=>{if("function"==typeof this.options.virtualScroll&&!1===this.options.virtualScroll(t))return;const{deltaX:i,deltaY:e,event:s}=t;if(this.emitter.emit("virtual-scroll",{deltaX:i,deltaY:e,event:s}),s.ctrlKey)return;if(s.lenisStopPropagation)return;const o=s.type.includes("touch"),n=s.type.includes("wheel");this.isTouching="touchstart"===s.type||"touchmove"===s.type;const r=0===i&&0===e;if(this.options.syncTouch&&o&&"touchstart"===s.type&&r&&!this.isStopped&&!this.isLocked)return void this.reset();const l="vertical"===this.options.gestureOrientation&&0===e||"horizontal"===this.options.gestureOrientation&&0===i;if(r||l)return;let h=s.composedPath();h=h.slice(0,h.indexOf(this.rootElement));const a=this.options.prevent;if(h.find((t=>t instanceof HTMLElement&&("function"==typeof a&&a?.(t)||t.hasAttribute?.("data-lenis-prevent")||o&&t.hasAttribute?.("data-lenis-prevent-touch")||n&&t.hasAttribute?.("data-lenis-prevent-wheel")))))return;if(this.isStopped||this.isLocked)return void s.preventDefault();if(!(this.options.syncTouch&&o||this.options.smoothWheel&&n))return this.isScrolling="native",this.animate.stop(),void(s.lenisStopPropagation=!0);let c=e;"both"===this.options.gestureOrientation?c=Math.abs(e)>Math.abs(i)?e:i:"horizontal"===this.options.gestureOrientation&&(c=i),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&(this.animatedScroll>0&&this.animatedScroll<this.limit||0===this.animatedScroll&&e>0||this.animatedScroll===this.limit&&e<0))&&(s.lenisStopPropagation=!0),s.preventDefault();const p=o&&this.options.syncTouch,d=o&&"touchend"===s.type&&Math.abs(c)>5;d&&(c=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+c,{programmatic:!1,...p?{lerp:d?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(null!==this._resetVelocityTimeout&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent)this._preventNextNativeScrollEvent=!1;else if(!1===this.isScrolling||"native"===this.isScrolling){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isStopped||(this.isScrolling="native"),this.emit(),0!==this.velocity&&(this._resetVelocityTimeout=setTimeout((()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()}),400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.reset(),this.isStopped=!1)}stop(){this.isStopped||(this.reset(),this.isStopped=!0)}raf=t=>{const i=t-(this.time||t);this.time=t,this.animate.advance(.001*i),this.options.autoRaf&&(this.__rafID=requestAnimationFrame(this.raf))};scrollTo(i,{offset:e=0,immediate:s=!1,lock:o=!1,duration:n=this.options.duration,easing:r=this.options.easing,lerp:l=this.options.lerp,onStart:h,onComplete:a,force:c=!1,programmatic:p=!0,userData:d}={}){if(!this.isStopped&&!this.isLocked||c){if("string"==typeof i&&["top","left","start"].includes(i))i=0;else if("string"==typeof i&&["bottom","right","end"].includes(i))i=this.limit;else{let t;if("string"==typeof i?t=document.querySelector(i):i instanceof HTMLElement&&i?.nodeType&&(t=i),t){if(this.options.wrapper!==window){const t=this.rootElement.getBoundingClientRect();e-=this.isHorizontal?t.left:t.top}const s=t.getBoundingClientRect();i=(this.isHorizontal?s.left:s.top)+this.animatedScroll}}if("number"==typeof i){if(i+=e,i=Math.round(i),this.options.infinite?p&&(this.targetScroll=this.animatedScroll=this.scroll):i=t(0,i,this.limit),i===this.targetScroll)return h?.(this),void a?.(this);if(this.userData=d??{},s)return this.animatedScroll=this.targetScroll=i,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),a?.(this),this.userData={},void requestAnimationFrame((()=>{this.dispatchScrollendEvent()}));p||(this.targetScroll=i),this.animate.fromTo(this.animatedScroll,i,{duration:n,easing:r,lerp:l,onStart:()=>{o&&(this.isLocked=!0),this.isScrolling="smooth",h?.(this)},onUpdate:(t,i)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=t-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=t,this.setScroll(this.scroll),p&&(this.targetScroll=t),i||this.emit(),i&&(this.reset(),this.emit(),a?.(this),this.userData={},requestAnimationFrame((()=>{this.dispatchScrollendEvent()})),this.preventNextNativeScrollEvent())}})}}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame((()=>{this._preventNextNativeScrollEvent=!1}))}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return"horizontal"===this.options.orientation}get actualScroll(){const t=this.options.wrapper;return this.isHorizontal?t.scrollX??t.scrollLeft:t.scrollY??t.scrollTop}get scroll(){return this.options.infinite?(t=this.animatedScroll,i=this.limit,(t%i+i)%i):this.animatedScroll;var t,i}get progress(){return 0===this.limit?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return"smooth"===this.isScrolling}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),"smooth"===this.isScrolling&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};globalThis.Lenis=Lenis,globalThis.Lenis.prototype=Lenis.prototype;//# sourceMappingURL=lenis.min.js.map

// Main Animations & Timeline
(function(){
  /* amplitude: some letters sit short or ride high, like hand set wood type */
  function rng(seed){ return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
  function amp(el){
    const r = rng(+el.dataset.amp || 1);
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3){
          const frag = document.createDocumentFragment();
          let prevSmall = true;
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.style.cssText = "display:inline-block;white-space:nowrap";
            w.setAttribute("aria-hidden", "true");
            [...part].forEach(c => {
              const x = document.createElement("span"); x.textContent = c;
              const v = r();
              if (/[a-z]/i.test(c) && !prevSmall && v < 0.3){ x.className = "s"; prevSmall = true; }
              else { prevSmall = false; if (/[a-z]/i.test(c) && v > 0.88) x.className = "u"; }
              w.appendChild(x);
            });
            frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "svg"){ walk(n); }
      });
    };
    walk(el);
    el.classList.add("amp");
  }
  document.querySelectorAll("[data-amp]").forEach(amp);

  /* background music: off by default, starts only when the visitor presses the sound button */
  (function music(){
    const btn = document.getElementById("sound"), label = btn.querySelector(".sound-label");
    const SRC = "audio/interactive-playground.mp3", VOL = 0.45;
    /* 1st choice: stream it, so it starts after the first few kilobytes.
       If the stream has not actually started moving within a couple of seconds (some browsers
       are strict about how streamed audio is served), switch to decoding the file with Web Audio. */
    const audio = new Audio(SRC);
    audio.loop = true; audio.preload = "auto"; audio.volume = 0;
    let ctx = null, gain = null, bufSrc = null, mode = "stream";
    let playing = false, wanted = false, started = false, fade, check;
    const AC = window.AudioContext || window.webkitAudioContext;
    function unlock(){ /* create or resume Web Audio inside the gesture, ready for the fallback */
      if (!AC) return;
      try { ctx = ctx || new AC(); if (ctx.state === "suspended") ctx.resume(); } catch (_) {}
    }
    function ramp(to, ms, done){
      clearInterval(fade);
      if (mode === "webaudio"){
        const t = ctx.currentTime; gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value, t);
        gain.gain.linearRampToValueAtTime(to, t + ms / 1000); if (done) setTimeout(done, ms); return;
      }
      const from = audio.volume, t0 = performance.now();
      fade = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        try { audio.volume = Math.max(0, Math.min(1, from + (to - from) * k)); } catch (_) {}
        if (k === 1){ clearInterval(fade); done && done(); }
      }, 30);
    }
    async function toWebAudio(){
      if (mode === "webaudio" || !AC) return;
      mode = "webaudio"; audio.pause();
      try {
        ctx = ctx || new AC(); if (ctx.state === "suspended") await ctx.resume();
        const buf = await ctx.decodeAudioData(await (await fetch(SRC)).arrayBuffer());
        gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination);
        bufSrc = ctx.createBufferSource(); bufSrc.buffer = buf; bufSrc.loop = true; bufSrc.connect(gain); bufSrc.start(0);
        if (playing) ramp(VOL, 1400); else ctx.suspend();
      } catch (_) { playing = false; started = false; ui(); }
    }
    function watchStream(){
      clearTimeout(check); const t0 = audio.currentTime;
      check = setTimeout(() => { if (playing && mode === "stream" && (audio.paused || audio.currentTime <= t0 + 0.05)) toWebAudio(); }, 2200);
    }
    function play(){
      unlock();
      playing = true; started = true; ui();
      if (mode === "webaudio"){ if (ctx.state === "suspended") ctx.resume(); ramp(VOL, 1400); return; }
      let p; try { p = audio.play(); } catch (_) {}
      ramp(VOL, 1400); watchStream();
      if (p && p.catch) p.catch(() => { if (playing) toWebAudio(); });
    }
    function stop(){
      playing = false; ui(); clearTimeout(check);
      ramp(0, 500, () => { if (playing) return; if (mode === "webaudio") ctx.suspend(); else audio.pause(); });
    }
    function ui(){
      btn.classList.toggle("on", playing);
      btn.classList.toggle("invite", !playing && !started && wanted);
      btn.setAttribute("aria-pressed", String(playing));
      btn.setAttribute("aria-label", playing ? "Turn background music off" : "Turn background music on");
      label.textContent = playing ? "Sound on" : "Sound off";
      if (started || !wanted) btn.classList.remove("nudge");
    }
    /* show the nudge once the intro has settled, if nothing has started the music by then */
    setTimeout(() => { if (!started && wanted) btn.classList.add("nudge"); }, 2600);
    btn.addEventListener("click", e => {
      e.stopPropagation();
      if (playing) { wanted = false; stop(); } else { wanted = true; play(); }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden){ if (mode === "webaudio" && ctx) ctx.suspend(); else audio.pause(); return; }
      if (!playing) return;
      if (mode === "webaudio") ctx.resume(); else audio.play().catch(() => { playing = false; started = false; ui(); });
    });
  })();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap) {
    document.documentElement.classList.add("rm");
    const map = { work: "work", about: "about", contact: "contact" };
    document.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => {
      const el = document.getElementById(map[btn.dataset.go] || btn.dataset.go);
      if (el) el.scrollIntoView();
    }));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const $ = s => document.querySelector(s);
  const C = { deep:"#14213D", nile:"#1D5C63", terracotta:"#8C3B2E", lapis:"#2C3E8F", sand:"#8F5319", emerald:"#2E6A55", plum:"#6A2E6B" };
  const stage = $("#stage");

  /* smooth scroll */
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  window.__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* drifting dust: a few dozen specks that float up, twinkle, and lean into the scroll */
  const dust = $("#dust"), dctx = dust.getContext("2d");
  let DW = 0, DH = 0, specks = [];
  function sizeDust(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    DW = stage.clientWidth; DH = stage.clientHeight;
    dust.width = DW * dpr; dust.height = DH * dpr;
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, DW * DH / 16000));
    specks = Array.from({ length: n }, () => ({
      x: Math.random() * DW, y: Math.random() * DH,
      r: 0.5 + Math.random() * 1.5, vy: 0.08 + Math.random() * 0.25,
      sway: Math.random() * Math.PI * 2, tw: Math.random() * Math.PI * 2,
      c: Math.random() < 0.7 ? "244,242,255" : "186,186,251"
    }));
  }
  sizeDust();
  gsap.ticker.add(() => {
    const push = gsap.utils.clamp(-6, 6, (lenis.velocity || 0) * 0.08);
    dctx.clearRect(0, 0, DW, DH);
    for (const p of specks){
      p.sway += 0.012; p.tw += 0.03;
      p.y -= p.vy + push; p.x += Math.sin(p.sway) * 0.18;
      if (p.y < -4) { p.y = DH + 4; p.x = Math.random() * DW; }
      if (p.y > DH + 4) { p.y = -4; p.x = Math.random() * DW; }
      const a = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(p.tw));
      dctx.fillStyle = "rgba(" + p.c + "," + a.toFixed(2) + ")";
      dctx.beginPath(); dctx.arc(p.x, p.y, p.r, 0, 6.283); dctx.fill();
    }
  });

  /* concentric rings: the tunnel continues the rings inside the head */
  const tunnel = $("#tunnel");
  function buildTunnel(){
    tunnel.innerHTML = "";
    const w = stage.clientWidth, h = stage.clientHeight;
    const D = Math.hypot(w, h);
    for (let i = 0; i < 11; i++){
      const d = document.createElement("div");
      const size = D * Math.pow(0.8, i);
      d.style.width = d.style.height = size + "px";
      d.style.left = (w - size) / 2 + "px";
      d.style.top = (h - size) / 2 + "px";
      d.style.borderRadius = "50%";
      tunnel.appendChild(d);
    }
  }
  buildTunnel();

  /* split the hello line into characters, keeping words together */
  const hi = $("#hiLine");
  hi.setAttribute("aria-label", hi.textContent);
  const hr = rng(21); let hp = true;
  hi.innerHTML = hi.textContent.split(" ").map(w =>
    '<span class="wd" aria-hidden="true">' + [...w].map(c => {
      const small = /[a-z]/i.test(c) && !hp && hr() < 0.34; hp = small;
      return '<span class="ch' + (small ? ' sm' : '') + '">' + c + '</span>';
    }).join("") + "</span>"
  ).join(" ");
  hi.classList.add("amp");
  const chars = hi.querySelectorAll(".ch");

  /* intro: the name condenses, then a cursor drags a selection around it */
  const nameWrap = $("#nameWrap"), cursor = $("#cursor"), sel = $("#sel"), dim = $("#dim");
  function measure(){
    const r = $("#name").getBoundingClientRect();
    const s = gsap.getProperty("#heroInner", "scale") || 1;
    dim.textContent = Math.round(r.width / s) + " × " + Math.round(r.height / s);
  }
  const heroIn = $("#heroInner");
  const B = () => { const a = heroIn.getBoundingClientRect(), n = nameWrap.getBoundingClientRect(); return { x: n.left - a.left, y: n.top - a.top }; };
  gsap.set(cursor, { x: () => B().x + nameWrap.offsetWidth + 120, y: () => B().y + nameWrap.offsetHeight + 160, opacity: 0 });
  const intro = gsap.timeline({ delay: 0.25 });
  intro
    .fromTo("#name", { letterSpacing: "0.32em", opacity: 0 }, { letterSpacing: "-0.01em", opacity: 1, duration: 1.5, ease: "expo.out" })
    .from(".kicker", { y: 14, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.5)
    .from("#phrase span", { y: 16, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }, 1.0)
    .to(cursor, { opacity: 1, x: () => B().x - 18, y: () => B().y - 3, duration: 0.8, ease: "power3.inOut" }, 1.05)
    .add(() => measure(), 1.8)
    .to(cursor, { x: () => B().x + nameWrap.offsetWidth + 18, y: () => B().y + nameWrap.offsetHeight + 14, duration: 0.9, ease: "power2.inOut" }, 1.85)
    .set(sel, { opacity: 1 }, 1.85)
    .to(sel, { width: () => nameWrap.offsetWidth + 36, height: () => nameWrap.offsetHeight + 17, duration: 0.9, ease: "power2.inOut", onComplete: () => { sel.classList.add("done"); gsap.set(sel, { clearProps: "width,height" }); } }, 1.85)
    .to(dim, { opacity: 1, duration: 0.3 }, 2.6)
    .from("#role", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out" }, 2.4)
    .from(".top, #hint > span, #hintM > span, #ruler", { opacity: 0, duration: 0.8 }, 2.6)
    .fromTo("#meSvg", { yPercent: 45 }, { yPercent: 0, duration: 1.2, ease: "power4.out" }, 0.35)
    .fromTo("#lid", { rotation: 0 }, { rotation: -7, svgOrigin: "206 232", duration: 0.5, ease: "back.out(3)" }, 1.3)
    .to("#lid", { rotation: 0, svgOrigin: "206 232", duration: 0.35, ease: "power2.in" }, 1.85)
    .fromTo("#lid", { rotation: 0 }, { rotation: -7, svgOrigin: "206 232", duration: 0.45, ease: "back.out(3)", immediateRender: false }, 2.25)
    .add(idle, 2.9)
    .add(life, 2.2)
    .add(eyes, 2.9);

  /* small signs of life: the wave, and thoughts bobbing out of the head */
  function life(){
    gsap.to("#birds .bird", { scaleY: 0.45, transformOrigin: "50% 60%", duration: 0.32, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: { each: 0.11, from: "random" } });
    gsap.to("#birds", { x: 18, y: -8, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true });
    gsap.to("#hand", { rotation: 14, svgOrigin: "112 338", duration: 0.45, ease: "sine.inOut", repeat: 5, yoyo: true, repeatDelay: 0.05,
      onComplete(){ gsap.to("#hand", { rotation: 10, svgOrigin: "112 338", duration: 1.6, ease: "sine.inOut", repeat: -1, yoyo: true }); } });
    gsap.utils.toArray("#thoughts .th").forEach((t, i) => {
      gsap.to(t, { y: gsap.utils.random(-12, -5), rotation: gsap.utils.random(-12, 12), duration: gsap.utils.random(1.6, 2.4), ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.12 });
    });
  }
  /* the eyes follow the visitor once the intro hands over; they drift back to the name when the pointer leaves */
  function eyes(){
    const whites = gsap.utils.toArray("#me .eye"), pupils = gsap.utils.toArray("#me .pupil");
    const REST = { x: 6, y: -10 }, MX = 9, MY = 13;
    const movers = pupils.map(p => ({
      x: gsap.quickTo(p, "x", { duration: 0.45, ease: "power3.out" }),
      y: gsap.quickTo(p, "y", { duration: 0.45, ease: "power3.out" })
    }));
    let px = 0, py = 0, queued = false;
    function look(){
      queued = false;
      whites.forEach((w, i) => {
        const r = w.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 220);
        movers[i].x(dx / d * MX * k - REST.x);
        movers[i].y(dy / d * MY * k - REST.y);
      });
    }
    window.addEventListener("pointermove", e => {
      px = e.clientX; py = e.clientY;
      if (!queued) { queued = true; requestAnimationFrame(look); }
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", () => movers.forEach(m => { m.x(0); m.y(0); }));
  }
  /* phones: shorter screens leave less room under the name, so keep the character, thoughts, birds and closing sign
     clear of "Designing experiences". Taller phones, tablets and desktop keep the layout set in CSS */
  const dream = $("#dream"), phrase = $("#phrase"), heroTop = $(".hero-top"), me = $("#me"), birds = $("#birds");
  let tightPhone = false;
  function fitPhone(){
    me.style.width = dream.style.top = dream.style.left = dream.style.fontSize = birds.style.left = birds.style.top = "";
    tightPhone = false;
    if (!matchMedia("(max-width: 720px)").matches) return;
    const SW = stage.clientWidth, SH = stage.clientHeight;
    const below = heroTop.offsetTop + phrase.offsetTop + phrase.offsetHeight;   // bottom of "Designing experiences"
    /* the highest bobbing thought sits at about 30 of the drawing's 600 units */
    let w = me.offsetWidth;
    const room = (SH - below - 10) / (0.9375 * 570 / 600);
    if (w > room){
      w = Math.max(room, SW * 0.72); me.style.width = w + "px";
      /* a narrower character leaves less room beside the thoughts, so the sign hugs the left edge and is a touch smaller */
      dream.style.fontSize = "13px"; dream.style.left = (SW * 0.03 - (SW - w) / 2) + "px";
    }
    const meTop = SH - w * 0.9375, thoughtsTop = SH - w * 0.9375 * 570 / 600;
    /* the closing sign: just under the phrase, above the waving hand */
    if (dream.offsetTop < below + 18 - meTop) dream.style.top = (below + 18 - meTop) + "px";
    /* the birds: keep their spot unless it runs into the phrase or the thoughts, then move them over the hand */
    const hr = heroIn.getBoundingClientRect(), br = birds.getBoundingClientRect(), k = hr.width / heroIn.offsetWidth || 1;
    const bTop = (br.top - hr.top) / k - (gsap.getProperty(birds, "y") || 0), bH = br.height / k;
    if (bTop < below + 6 || bTop + bH > thoughtsTop - 6){
      tightPhone = true;
      birds.style.left = "5%"; birds.style.top = (below + 14) + "px";
    }
  }
  fitPhone();

  /* the dive heads straight into the open head */
  let origin = "50% 60%";
  function findOrigin(){
    const inner = $("#heroInner"), me = $("#me");
    const s = gsap.getProperty(inner, "scale") || 1;
    if (s !== 1) return;
    const a = inner.getBoundingClientRect(), m = me.getBoundingClientRect();
    origin = (m.left - a.left + m.width * 0.5) + "px " + (m.top - a.top + m.height * (228 / 600)) + "px";
  }
  findOrigin();
  let idleTween;
  function idle(){
    idleTween = gsap.to(cursor, {
      x: () => B().x + nameWrap.offsetWidth * gsap.utils.random(0.6, 0.97),
      y: () => B().y + nameWrap.offsetHeight * gsap.utils.random(0.2, 0.9),
      duration: 2.6, ease: "sine.inOut", repeat: -1, yoyo: true, repeatRefresh: true
    });
  }

  /* the master journey, scrubbed by scroll */
  const W = () => window.innerWidth;
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#space", start: "top top", end: "bottom bottom", scrub: true,
      invalidateOnRefresh: true,
      onUpdate: self => {
        gsap.set("#head", { left: (self.progress * 100) + "%" });
        ending(self.progress);
      }
    }
  });
  window.__tl = tl;

  // 0 to 1.8: dive into the frame
  tl.addLabel("hero", 0)
    .to("#hint", { autoAlpha: 0, duration: 0.2 }, 0)
    .to(".hero-top", { autoAlpha: 0, y: -40, duration: 0.35 }, 0)
    .to("#heroInner", { scale: 22, transformOrigin: () => origin, duration: 1.1, ease: "power3.in" }, 0)
    .to("#heroInner", { autoAlpha: 0, duration: 0.25 }, 0.85)
    .fromTo(tunnel, { scaleX: 0.3, scaleY: 0.08, autoAlpha: 0 }, { scaleX: 1.4, scaleY: 1.4, autoAlpha: 1, duration: 0.6, ease: "power1.in" }, 0.6)
    .to(tunnel, { scale: 9, duration: 0.7, ease: "power2.in" }, 1.1)
    .to(tunnel, { autoAlpha: 0, duration: 0.25 }, 1.6)
    .to(stage, { "--bg": C.terracotta, duration: 1.2 }, 0.5)

  // 1.8 to 4.6: hello
    .set("#hello", { autoAlpha: 1 }, 1.75)
    .fromTo(chars,
      { yPercent: 150, rotate: () => gsap.utils.random(-45, 45), autoAlpha: 0 },
      { yPercent: 0, rotate: i => [-4, 3, -2, 5, -3, 2, -5, 3, 4, -2, 3, -4, 2, -3][i % 14], autoAlpha: 1, duration: 0.8, stagger: 0.06, ease: "back.out(1.7)" }, 1.8)
    .fromTo("#hello .spark", { scale: 0, rotation: -120, transformOrigin: "50% 50%" }, { scale: 1, rotation: 0, duration: 0.5, stagger: 0.08, ease: "back.out(2.4)" }, 2.1)
    .fromTo("#squigPath", { strokeDasharray: 420, strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 0.6 }, 2.5)
    .addLabel("hello", 2.9)
    .to("#hello .doodles", { scale: 1.6, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 3.6)
    .fromTo("#hiCap", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 2.6)
    .fromTo(".hi-laptop, .hi-tea", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 0.9, duration: 0.5, stagger: 0.12, ease: "back.out(1.4)" }, 2.3)
    .to(".hi-laptop, .hi-tea", { autoAlpha: 0, duration: 0.3 }, 3.6)
    .to("#hiCap", { autoAlpha: 0, duration: 0.3 }, 3.6)
    .to("#hiLine", { scale: 8, autoAlpha: 0, transformOrigin: "46% 55%", duration: 1.0, ease: "power2.in" }, 3.6)
    .to(stage, { "--bg": C.lapis, duration: 1.0 }, 3.9)
    .set("#hello", { autoAlpha: 0 }, 4.65)

  // 4.6 to 8: systems, tokens assemble into a component
    .set("#systems", { autoAlpha: 1 }, 4.55)
    .fromTo("#sysWord", { scale: 0.16, "--wg": 100, rotate: 0 }, { scale: 1, "--wg": 900, rotate: -5, duration: 1.3, ease: "power3.out" }, 4.6)
    .fromTo("#sysSmall", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 5.0);

  const sws = gsap.utils.toArray("#kit .sw");
  sws.forEach((s, i) => {
    const a = (i / sws.length) * Math.PI * 2 + 0.6;
    tl.fromTo(s,
      { x: () => Math.cos(a) * W() * 0.45, y: () => Math.sin(a) * window.innerHeight * 0.45, scale: 0.4, autoAlpha: 0 },
      { x: () => -150 + i * 34 + 40, y: () => 150, scale: 0.62, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, 5.2 + i * 0.05);
  });
  tl.fromTo("#card", { scale: 0.6, autoAlpha: 0, rotate: 4 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.5, ease: "back.out(1.4)" }, 6.0)
    .to("#sysWord", { autoAlpha: 0.22, duration: 0.5 }, 6.0)
    .fromTo("#sysCap", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 6.3)
    .addLabel("systems", 6.6)
    .to(["#kit", "#sysSmall", "#sysCap"], { yPercent: -30, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 7.3)
    .to("#sysWord", { scale: 2.2, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, 7.3)
    .to(stage, { "--bg": C.deep, duration: 0.9 }, 7.4)
    .set("#systems", { autoAlpha: 0 }, 7.92)

  // 8 to 10.9: based, an auto crosses the frame
    .set("#based", { autoAlpha: 1 }, 7.95)
    .fromTo("#basedText > span", { xPercent: 70, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 8.0)
    .fromTo("#auto", { x: () => -W() * 0.35 }, { x: () => W() * 1.1, duration: 2.0 }, 8.3)
    .fromTo("#wf", { rotation: 0 }, { rotation: -1080, svgOrigin: "72 206", duration: 2.0 }, 8.3)
    .fromTo("#wr", { rotation: 0 }, { rotation: -1080, svgOrigin: "272 206", duration: 2.0 }, 8.3)
    .fromTo("#basedCap", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 8.9)
    .fromTo("#based .palm", { x: () => W() * 0.12 }, { x: () => -W() * 0.12, duration: 2.8 }, 8.0)
    .fromTo("#based .hills", { x: () => W() * 0.03, autoAlpha: 0 }, { x: () => -W() * 0.03, autoAlpha: 1, duration: 2.8 }, 8.0)
    .fromTo("#based .palm", { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.6)" }, 8.1)
    .fromTo("#cup", { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.8)" }, 8.6)
    .fromTo("#steam", { y: 8, opacity: 0.2 }, { y: -10, opacity: 1, duration: 1.4 }, 8.8)
    .addLabel("based", 9.3)
    .to("#based .doodles", { yPercent: 30, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 10.3)
    .to("#basedText > span", { xPercent: -70, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: "power2.in" }, 10.2)
    .to("#basedCap", { autoAlpha: 0, duration: 0.3 }, 10.2)
    .to(stage, { "--bg": C.emerald, duration: 0.8 }, 10.3)
    .set("#based", { autoAlpha: 0 }, 10.95)

  // 10.9 to 15.9: work, a horizontal run of frames
    .set("#work", { autoAlpha: 1 }, 10.85)
    .fromTo(".work-head", { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }, 10.9)
    .fromTo(".proj", { y: 80, rotate: 2, autoAlpha: 0 }, { y: 0, rotate: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 11.0)
    .fromTo("#peek", { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" }, 11.2)
    .fromTo(["#pl", "#pr"], { x: 0 }, { x: 4, duration: 0.3 }, 11.6)
    .addLabel("work", 11.5)
    .to("#track", { x: () => -(document.querySelector("#track").scrollWidth - stage.clientWidth), duration: 3.6, ease: "power1.inOut" }, 11.7)
    .fromTo("#workProg", { scaleX: 0.05 }, { scaleX: 1, duration: 3.6, ease: "power1.inOut" }, 11.7)
    .to("#work", { yPercent: -18, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 15.4)
    .to(stage, { "--bg": C.plum, duration: 0.8 }, 15.5)

  // 15.9 to 18: about
    .set("#about", { autoAlpha: 1 }, 15.85)
    .fromTo("#aboutSt i", { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.14, ease: "power3.out" }, 15.9)
    .fromTo(["#aboutSub", "#facts", "#tools", "#more"], { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, 16.4)
    .fromTo("#trail", { strokeDashoffset: 320, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: 0.8 }, 16.2)
    .fromTo("#planeBody", { x: -190, y: 60, rotation: -20, svgOrigin: "226 36" }, { x: 0, y: 0, rotation: 0, svgOrigin: "226 36", duration: 0.8, ease: "power2.out" }, 16.2)
    .addLabel("about", 16.9)
    .to("#about", { scale: 0.92, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 17.4)

  // 18 to 20: dive back out to the frame, now an invitation
    .set("#role", { autoAlpha: 0 }, 17.9)
    .set("#contact", { autoAlpha: 1 }, 17.9)
    /* the sign pops in only after the zoom back out has settled (18.4 to 19.4), so it is never magnified across the screen */
    .fromTo("#dream", { autoAlpha: 0, scale: 0.6, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: -7, duration: 0.45, ease: "back.out(2)", immediateRender: false }, 19.45)
    /* on shorter phones the birds sit where the sign lands, so they fly off as it arrives */
    .fromTo("#birds", { opacity: 1 }, { opacity: () => tightPhone ? 0 : 1, duration: 0.3, immediateRender: false }, 19.4)
    .to(stage, { "--bg": C.nile, duration: 0.9 }, 17.9)
    .fromTo(tunnel, { scale: 9, autoAlpha: 0 }, { scale: 1.2, autoAlpha: 1, duration: 0.9, ease: "power2.out", immediateRender: false }, 17.9)
    .to(tunnel, { scale: 0.42, autoAlpha: 0, duration: 0.5 }, 18.8)
    /* zoom back out of the head. Scale and opacity are separate: the character stays invisible while he is
       magnified many times over (that showed as big blurry blocks over the rings), and fades in only once he is
       close to normal size */
    .fromTo("#heroInner", { scale: 22 }, { scale: 1, transformOrigin: () => origin, duration: 1.0, ease: "power3.out", immediateRender: false }, 18.4)
    .fromTo("#heroInner", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32, ease: "power1.inOut", immediateRender: false }, 18.9)
    .fromTo(".hero-top", { autoAlpha: 0, y: -40 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, 19.1)
    .addLabel("contact", 20)
    .to({}, { duration: 0.01 }, 20);

  /* beliefs: a manifesto chapter slotted in after Systems */
  (function beliefs(){
    const S = 7.95, M = 7.9;
    tl.shiftChildren(M, true, 7.94);
    // split the belief headlines into words so they can rise in sequence
    document.querySelectorAll(".bl-b h3").forEach(h => {
      /* words are spaced by margin, not a space character, which some browsers drop between animated words */
      h.setAttribute("aria-label", h.textContent);
      h.innerHTML = h.textContent.split(" ").map(w => '<span class="w" aria-hidden="true">' + w + '</span>').join("\u200B");
    });
    tl.set("#beliefs", { autoAlpha: 1 }, S)
      // A: seven years, still hands on
      .set("#blA", { autoAlpha: 1 }, S)
      .fromTo(".bl-years", { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, S)
      .fromTo("#blUnder", { strokeDasharray: 440, strokeDashoffset: 440 }, { strokeDashoffset: 0, duration: 0.45 }, S + 0.35)
      .fromTo(".bl-hands", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, S + 0.3)
      .to("#blA", { y: -50, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, S + 1.0);
    // B: four beliefs, one screen each
    ["#blB1", "#blB2", "#blB3", "#blB4"].forEach((id, k) => {
      const t = S + 1.3 + k * 0.72;
      tl.set(id, { autoAlpha: 1 }, t)
        .fromTo(id + " h3 .w", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.018, ease: "power3.out" }, t)
        .fromTo(id + " p:not(.bl-kick)", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, t + 0.2);
      if (id === "#blB4") tl.fromTo("#blB4 .bl-kick", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, t + 0.4);
      tl.to(id, { y: -40, autoAlpha: 0, duration: 0.22, ease: "power2.in" }, t + 0.55);
    });
    tl.addLabel("beliefs", S + 1.5);
    // C: what I don't believe in, and what I do
    const c = S + 4.2;
    tl.set("#blC", { autoAlpha: 1 }, c)
      .fromTo(".bl-c .c1", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, c)
      .fromTo(".bl-c .c2", { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, c + 0.35)
      .fromTo("#strikePath", { strokeDasharray: 340, strokeDashoffset: 340 }, { strokeDashoffset: 0, duration: 0.3 }, c + 0.8)
      .fromTo(".bl-c .c3", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, c + 1.0)
      .to("#blC", { y: -40, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, c + 1.85);
    // D: the invitation
    const d = S + 6.3;
    tl.set("#blD", { autoAlpha: 1 }, d)
      .fromTo(".bl-d h2", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, d)
      .fromTo(".bl-d p:not(.bl-open)", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, d + 0.25)
      .fromTo(".bl-open", { y: 20, opacity: 0 }, { y: 0, opacity: 0.85, duration: 0.35 }, d + 0.4)
      .fromTo("#blD .ddp", { scale: 0, rotation: () => gsap.utils.random(-30, 30) }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.2)", stagger: { each: 0.05, from: "random" } }, d + 0.1)
      .to("#blD", { y: -40, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, d + 1.3)
      .to(stage, { "--bg": C.sand, duration: 0.6 }, S + M - 0.6)
      .set("#beliefs", { autoAlpha: 0 }, S + M - 0.05);
  })();

  /* opening the mind: the first stretch of scroll lifts the lid and lets the thoughts out */
  const OPEN = 1.0;
  tl.shiftChildren(OPEN, true, 0);
  tl.to(["#hint", "#hintM"], { autoAlpha: 0, duration: 0.3 }, 0)
    .fromTo("#lid", { rotation: -7, svgOrigin: "206 232" }, { rotation: -78, svgOrigin: "206 232", duration: 0.8, ease: "power2.inOut", immediateRender: false }, 0.05)
    .fromTo("#cavity", { attr: { ry: 13 } }, { attr: { ry: 20 }, duration: 0.6, immediateRender: false }, 0.1)
    .fromTo("#rings", { opacity: 0, scale: 0.3, svgOrigin: "320 232" }, { opacity: 1, scale: 1.15, svgOrigin: "320 232", scaleY: 1.3, duration: 0.7, ease: "power2.out" }, 0.2)
    .fromTo("#thoughts .th", { scale: 0, opacity: 0, yPercent: 160 }, { scale: 1, opacity: 1, yPercent: 0, transformOrigin: "50% 50%", duration: 0.55, stagger: 0.06, ease: "back.out(1.8)" }, 0.3)
    .to(".hero-top", { y: -12, duration: OPEN }, 0);
  // and it closes again for the goodbye
  tl.fromTo("#lid", { rotation: -78, svgOrigin: "206 232" }, { rotation: -10, svgOrigin: "206 232", duration: 0.6, ease: "back.out(2)", immediateRender: false }, tl.labels.contact - 0.7)
    .to("#rings", { opacity: 0, duration: 0.3 }, tl.labels.contact - 0.7)
    .to("#thoughts .th", { scale: 0.85, duration: 0.4 }, tl.labels.contact - 0.7);

  /* at the very end, the cursor hands over to the visitor */
  let handed = false;
  function ending(p){
    if (p > 0.965 && !handed){
      handed = true;
      if (idleTween) idleTween.pause();
      $("#cursorLabel").textContent = "Your turn";
      const m = $("#mail").getBoundingClientRect(), n = heroIn.getBoundingClientRect();
      gsap.to(cursor, { x: m.left - n.left + m.width * 0.8, y: m.top - n.top + m.height * 0.55, duration: 0.8, ease: "power3.inOut" });
    } else if (p < 0.94 && handed){
      handed = false;
      $("#cursorLabel").textContent = "Mohamed Beshir";
      if (idleTween) idleTween.restart(); else idle();
    }
  }

  /* the closing doodles drift with the pointer, each by its own depth */
  const drift = gsap.utils.toArray("#blD .dd").map(el => {
    const t = el.querySelector(".ddp"), d = +el.dataset.depth || 10;
    return { d, x: gsap.quickTo(t, "x", { duration: 0.9, ease: "power3.out" }), y: gsap.quickTo(t, "y", { duration: 0.9, ease: "power3.out" }) };
  });
  window.addEventListener("pointermove", e => {
    const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
    drift.forEach(m => { m.x(dx * m.d * 2); m.y(dy * m.d * 2); });
  }, { passive: true });

  /* ruler labels and nav jumps */
  const ruler = $("#ruler"), total = tl.duration();
  const marks = [["hello","Hello"],["systems","Systems"],["beliefs","Beliefs"],["based","Cairo"],["work","Work"],["about","About"],["contact","Contact"]];
  marks.forEach(([k, t]) => {
    const b = document.createElement("button");
    b.textContent = t; b.dataset.go = k; b.tabIndex = -1;
    b.style.left = Math.min(98, (tl.labels[k] / total) * 100) + "%";
    ruler.appendChild(b);
  });
  function go(k){
    const st = tl.scrollTrigger;
    const y = st.start + (tl.labels[k] / total) * (st.end - st.start);
    lenis.scrollTo(y, { duration: 1.6 });
  }
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => go(b.dataset.go)));

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("jump")) {
    const k = urlParams.get("jump");
    if (tl.labels[k] !== undefined) {
      setTimeout(() => {
        const st = tl.scrollTrigger;
        const y = st.start + (tl.labels[k] / total) * (st.end - st.start);
        window.scrollTo(0, y);
        lenis.scrollTo(y, { immediate: true });
        tl.progress(tl.labels[k] / total);
      }, 100);
    }
  } else if (urlParams.has("p")) {
    const p = parseFloat(urlParams.get("p"));
    setTimeout(() => {
      const st = tl.scrollTrigger;
      const y = st.start + p * (st.end - st.start);
      window.scrollTo(0, y);
      lenis.scrollTo(y, { immediate: true });
      tl.progress(p);
    }, 100);
  }

  window.addEventListener("resize", () => { fitPhone(); buildTunnel(); measure(); findOrigin(); sizeDust(); });
})();


// Case Study & Interactive UI
(() => {
  const cs = document.getElementById("cs"), title = document.getElementById("csTitle"), back = document.getElementById("csBack"), dl = document.getElementById("csDl");
  let frame = document.getElementById("csFrame");
  const backLabel = back.lastChild;
  const hashOf = el => el.dataset.hash || "#work/" + el.dataset.case;
  const fromHash = () => location.hash ? [...document.querySelectorAll("[data-case]")].find(el => hashOf(el) === location.hash) : null;
  /* phones show PDFs poorly inside a frame, so there the resume opens in the browser's own viewer instead */
  /* also when the site itself is shown inside another page's frame (a preview): browsers refuse a PDF nested there */
  const framed = (() => { try { return window.self !== window.top; } catch (_) { return true; } })();
  const smallScreen = () => framed || matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  let opener = null, pushed = false;
  function loadFrame(url){
    /* A fresh frame starts at the top and cannot reveal the previous project's
       document or add a nested navigation to the browser's Back history. */
    const next = frame.cloneNode(false);
    next.classList.remove("ready");
    cs.classList.remove("ready");
    next.dataset.url = url;
    next.addEventListener("load", () => {
      if (frame !== next) return;
      next.classList.add("ready"); cs.classList.add("ready");
      try { next.contentWindow.addEventListener("keydown", e => { if (e.key === "Escape") leave(); }); } catch (_) {}
    }, { once: true });
    next.src = url;
    frame.replaceWith(next);
    frame = next;
  }
  /* start fetching a case study the moment someone shows intent (hover, focus, touch) */
  const warmed = new Set();
  const warm = el => { const u = el.getAttribute("href"); if (!u || warmed.has(u)) return; warmed.add(u);
    const l = document.createElement("link"); l.rel = "prefetch"; l.href = u; document.head.appendChild(l); };
  document.querySelectorAll("[data-case]").forEach(el => ["pointerenter", "focus", "touchstart"].forEach(ev => el.addEventListener(ev, () => warm(el), { passive: true, once: true })));
  function open(card, fromHistory){
    const url = card.getAttribute("href");
    opener = card;
    title.textContent = card.dataset.title || card.querySelector(".label span")?.textContent || "Case study";
    frame.title = card.dataset.title ? title.textContent : title.textContent + " case study";
    backLabel.textContent = card.dataset.back || "Back to work";
    if (card.dataset.download){ dl.href = url; dl.setAttribute("download", card.dataset.download); dl.hidden = false; } else dl.hidden = true;
    if (frame.dataset.url !== url) loadFrame(url);
    cs.classList.add("open");
    document.documentElement.classList.add("cs-lock");
    window.__lenis?.stop();
    /* sandboxed previews can refuse history changes; the viewer still works, just without a link of its own */
    if (!fromHistory){ try { history.pushState({ cs: card.dataset.case }, "", hashOf(card)); pushed = true; } catch (_) { pushed = false; } }
    back.focus({ preventScroll: true });
  }
  function close(){
    if (!cs.classList.contains("open")) return;
    cs.classList.remove("open");
    document.documentElement.classList.remove("cs-lock");
    window.__lenis?.start();
    opener?.focus({ preventScroll: true });
  }
  function leave(){
    if (pushed){ pushed = false; history.back(); }
    else { try { if (location.hash) history.replaceState(null, "", location.pathname + location.search); } catch (_) {} close(); }
  }
  document.querySelectorAll("[data-case]").forEach(card => card.addEventListener("click", e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (card.dataset.download && smallScreen()) return;
    e.preventDefault(); open(card);
  }));
  back.addEventListener("click", leave);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && cs.classList.contains("open")) leave(); });
  window.addEventListener("popstate", () => {
    const card = fromHash();
    if (card) open(card, true); else { pushed = false; close(); }
  });
  const deep = fromHash();
  if (deep && !(deep.dataset.download && smallScreen())) open(deep, true);

  /* copy the email address, with a tick and a short "Copied" note */
  const copyBtn = document.getElementById("copyMail"), copyStatus = document.getElementById("copyStatus");
  let copyTimer;
  copyBtn?.addEventListener("click", async () => {
    const text = copyBtn.dataset.copy;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (_) {
      const t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(t); t.select(); try { ok = document.execCommand("copy"); } catch (_) {} t.remove();
    }
    if (!ok) return;
    copyBtn.classList.add("done"); copyStatus.textContent = "Email address copied";
    clearTimeout(copyTimer); copyTimer = setTimeout(() => { copyBtn.classList.remove("done"); copyStatus.textContent = ""; }, 1800);
  });
})();
