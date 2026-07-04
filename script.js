const screen=document.getElementById('screen');
const backBtn=document.getElementById('hs-back');
const routes={home:'images/home.png',production:'images/production.png',shrink:'images/shrink.png',
console:'images/deli-notifications.png',temperature_log:'images/temperature_log.png',
temp_1:'images/temp_1.png',temp_2:'images/temp_2.png',temp_3:'images/temp_3.png',
temp_4:'images/temp_4.png',temp_5:'images/temp_5.png',temp_6:'images/temp_6.png'};
const tempSeq=['temperature_log','temp_1','temp_2','temp_3','temp_4','temp_5','temp_6'];
let stack=['home'];let current='home';let tempIndex=-1;
function render(){screen.src=routes[current];backBtn.style.display=current==='home'?'none':'block';}
function show(name){current=name;stack.push(name);tempIndex=tempSeq.indexOf(name);render();}
function back(){if(stack.length<2)return;stack.pop();current=stack.at(-1);tempIndex=tempSeq.indexOf(current);render();}
function nextTemp(){if(tempIndex<0)return;tempIndex++;if(tempIndex>=tempSeq.length){current='home';stack=['home'];tempIndex=-1;}else current=tempSeq[tempIndex];render();}
let sx=0;screen.addEventListener('touchstart',e=>sx=e.touches[0].clientX);
screen.addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx;if(dx<-60)nextTemp();});
document.getElementById('hs-production').onclick=()=>show('production');
document.getElementById('hs-shrink').onclick=()=>show('shrink');
document.getElementById('hs-temperature').onclick=()=>show('temperature_log');
document.getElementById('hs-console').onclick=()=>show('console');
backBtn.onclick=back;
render();
