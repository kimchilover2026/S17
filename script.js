const screens=[...document.querySelectorAll('.screen')];
let current=1;
const viewedFlowers=new Set();
const flowerScreens={rose:6,lily:7,carnation:8,peony:9};
const finalMessageButton=document.getElementById('finalMessageButton');

function showScreen(n){
  const target=document.getElementById(`screen${n}`);
  if(!target)return;
  screens.forEach(s=>s.classList.remove('active'));
  target.classList.add('active');
  current=n;
  window.scrollTo({top:0,left:0,behavior:'smooth'});
}

function updateFinalButton(){
  if(!finalMessageButton)return;
  finalMessageButton.hidden=viewedFlowers.size!==4;
}

document.addEventListener('click',(event)=>{
  const el=event.target.closest('button');
  if(!el)return;

  if(el.id==='finalMessageButton'){
    if(viewedFlowers.size===4)showScreen(10);
    return;
  }

  if(el.dataset.next){
    showScreen(Number(el.dataset.next));
    return;
  }

  if(el.dataset.flower){
    const flower=el.dataset.flower;
    viewedFlowers.add(flower);
    updateFinalButton();
    showScreen(flowerScreens[flower]);
    return;
  }

  if(el.dataset.back){
    showScreen(Number(el.dataset.back));
    return;
  }

  if(el.dataset.home){
    showScreen(1);
    return;
  }
});

document.getElementById('restart').addEventListener('click',()=>{
  viewedFlowers.clear();
  updateFinalButton();
  showScreen(1);
});

document.addEventListener('keydown',(event)=>{
  if(event.key==='Escape' && current>=6 && current<=9)showScreen(5);
  if(event.key==='Home' && current!==1)showScreen(1);
});

updateFinalButton();
