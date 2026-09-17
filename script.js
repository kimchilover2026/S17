const screens=[...document.querySelectorAll('.screen')];
let current=1;
const viewedFlowers=new Set();
const flowerScreens={rose:6,lily:7,carnation:8,peony:9};
const finalMessageButton=document.getElementById('finalMessageButton');
let transitionLock=false;

function showScreen(n){
  const target=document.getElementById(`screen${n}`);
  if(!target || transitionLock)return;
  transitionLock=true;
  screens.forEach(s=>s.classList.remove('active'));
  target.classList.add('active');
  current=n;
  // Never use smooth scrolling here: it can leave a mobile tap over a different hotspot.
  window.scrollTo(0,0);
  requestAnimationFrame(()=>{transitionLock=false;});
}

function updateFinalButton(){
  if(!finalMessageButton)return;
  finalMessageButton.hidden=viewedFlowers.size!==4;
}

// Pointer events are used instead of delegated click events so one finger tap = one action.
document.addEventListener('pointerup',(event)=>{
  const el=event.target.closest('button');
  if(!el || event.pointerType==='mouse' && event.button!==0)return;
  if(el.disabled)return;
  event.preventDefault();

  if(el.id==='finalMessageButton'){
    if(viewedFlowers.size===4)showScreen(10);
    return;
  }
  if(el.dataset.next){showScreen(Number(el.dataset.next));return;}
  if(el.dataset.flower){
    const flower=el.dataset.flower;
    viewedFlowers.add(flower);
    updateFinalButton();
    showScreen(flowerScreens[flower]);
    return;
  }
  if(el.dataset.back){showScreen(Number(el.dataset.back));return;}
  if(el.dataset.home){showScreen(1);return;}
  if(el.id==='restart'){
    viewedFlowers.clear();
    updateFinalButton();
    showScreen(1);
  }
},{passive:false});

document.addEventListener('keydown',(event)=>{
  if(event.key==='Escape' && current>=6 && current<=9)showScreen(5);
  if(event.key==='Home' && current!==1)showScreen(1);
});

updateFinalButton();
