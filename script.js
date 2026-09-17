const scene = document.getElementById('scene');
const stage = document.getElementById('stage');
const sceneFrame = document.getElementById('sceneFrame');
const chapterNumber = document.getElementById('chapterNumber');
const progressBar = document.getElementById('progressBar');
const footerNote = document.getElementById('footerNote');
const gestureHint = document.getElementById('gestureHint');
const intro = document.getElementById('intro');
const story = document.getElementById('story');

const scenes = [
  {img:'panel1.png', alt:'Hola, So. Tengo algo para darte.', note:'Hay regalos que empiezan con una pequeña sorpresa.', kind:'portrait'},
  {img:'panel2.png', alt:'Sé que hoy no puedo darte el ramo que te mereces.', note:'A veces no puedo darte exactamente lo que quisiera.', kind:'portrait'},
  {img:'panel3.png', alt:'Pero hoy te quiero mostrar una forma rara de conservar las flores.', note:'Así que pensé en una forma distinta de conservarlas.', kind:'portrait'},
  {img:'panel4.png', alt:'No vas a poder olerlas, pero las vas a poder ver cuando quieras.', note:'Para que puedas volver a ellas cuando quieras.', kind:'portrait'},
  {img:'panel5.png', alt:'Ahora elegí una flor para descubrir su significado.', note:'Cuatro flores. Cuatro formas de decir algo que me cuesta poner en palabras.', kind:'selection'},
  {img:'panel6.png', alt:'Rosas y su significado.', note:'Rosas · amor, pasión y cariño profundo.', kind:'flower'},
  {img:'panel7.png', alt:'Lirios y su significado.', note:'Lirios · pureza, admiración y fuerza.', kind:'flower'},
  {img:'panel8.png', alt:'Claveles y su significado.', note:'Claveles · amor sincero, lealtad y gratitud.', kind:'flower'},
  {img:'panel9.png', alt:'Peonías y su significado.', note:'Peonías · felicidad, romance y nuevos comienzos.', kind:'flower'},
  {img:'panel10.png', alt:'Gracias por existir en mi vida.', note:'Y después de todas las flores, queda lo que realmente quería decirte.', kind:'landscape'}
];

let current=0, lock=false, touchX=0, soundOn=false;
const audioCtx = window.AudioContext ? new AudioContext() : null;

function makeImage(meta){
  const img=document.createElement('img');
  img.src='assets/'+meta.img;
  img.alt=meta.alt;
  img.draggable=false;
  return img;
}

function loadScene(direction='forward'){
  const meta=scenes[current];
  scene.className='scene '+(meta.kind==='landscape'?'landscape ':'')+'enter'+(direction==='back'?' from-back':'');
  scene.replaceChildren(makeImage(meta));
}

function makeTurningPage(meta, direction){
  const page=document.createElement('div');
  page.className='turning-page '+(meta.kind==='landscape'?'landscape ':'')+direction;
  page.appendChild(makeImage(meta));
  sceneFrame.appendChild(page);
  page.addEventListener('animationend',()=>page.remove(),{once:true});
}

function go(n, direction='forward'){
  if(lock || n<0 || n>=scenes.length || n===current)return;
  lock=true;
  const oldMeta=scenes[current];
  makeTurningPage(oldMeta,direction==='back'?'back':'forward');
  current=n;
  loadScene(direction);
  updateUI();
  window.setTimeout(()=>{lock=false},930);
}

function next(){ if(current<scenes.length-1) go(current+1,'forward'); }
function prev(){ if(current>0) go(current-1,'back'); }

function updateUI(){
  chapterNumber.textContent=String(current+1).padStart(2,'0');
  progressBar.style.width=((current+1)/scenes.length*100)+'%';
  footerNote.textContent=scenes[current].note;
  gestureHint.classList.toggle('hide', current!==0);
  document.body.classList.toggle('finale', current===scenes.length-1);
}

function tick(){
  if(!soundOn || !audioCtx)return;
  if(audioCtx.state==='suspended')audioCtx.resume();
  const o=audioCtx.createOscillator(), g=audioCtx.createGain();
  o.frequency.value=520; o.type='sine';
  g.gain.setValueAtTime(.0001,audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(.015,audioCtx.currentTime+.01);
  g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.14);
  o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime+.15);
}

document.getElementById('soundBtn').onclick=()=>{
  soundOn=!soundOn;
  const b=document.getElementById('soundBtn');
  b.classList.toggle('active',soundOn);
  b.setAttribute('aria-pressed',soundOn);
  tick();
};

document.getElementById('brandHome').onclick=()=>{ if(current!==0)go(0,'back'); };
document.getElementById('openStory').onclick=()=>{
  intro.classList.add('hide');
  story.classList.add('ready');
  setTimeout(()=>{loadScene();updateUI();},260);
};

stage.addEventListener('click',e=>{
  if(lock || e.target.closest('button'))return;
  next();
});

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' '||e.key==='Enter'){e.preventDefault();next();}
  if(e.key==='ArrowLeft'){e.preventDefault();prev();}
  if(e.key==='Home'){e.preventDefault();go(0,'back');}
});

stage.addEventListener('touchstart',e=>touchX=e.changedTouches[0].clientX,{passive:true});
stage.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-touchX;
  if(Math.abs(dx)>=55){dx<0?next():prev();}
},{passive:true});

window.addEventListener('load',()=>{
  scenes.forEach(s=>{const im=new Image();im.src='assets/'+s.img});
});
