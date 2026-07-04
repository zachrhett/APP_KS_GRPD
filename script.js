const screen=document.getElementById('screen'),backBtn=document.getElementById('hs-back');
const routes={home:'images/home.png',production:'images/production.png',shrink:'images/shrink.png',
temperature_log:'images/temperature_log.png',temp_1:'images/temp_1.png',temp_2:'images/temp_2.png',temp_3:'images/temp_3.png',temp_4:'images/temp_4.png',temp_5:'images/temp_5.png',temp_6:'images/temp_6.png',
deli:'images/deli-notifications.png',bakery:'images/bakery-notifications.png',center:'images/center.png',meat:'images/meat-notifications.png',frontend:'images/frontend.png'};
const temp=['temperature_log','temp_1','temp_2','temp_3','temp_4','temp_5','temp_6'];
const consoleSeq=['deli','bakery','center','meat','frontend'];
let stack=['home'],current='home',mode='',idx=-1,sx=0;
function render(){screen.src=routes[current];backBtn.style.display=current==='home'?'none':'block';}
function go(name){current=name;stack.push(name);render();}
function back(){if(stack.length<2)return;stack.pop();current=stack.at(-1);mode='';idx=-1;render();}
function advance(){if(mode==='temp'){idx++;if(idx>=temp.length){stack=['home'];current='home';mode='';idx=-1;}else current=temp[idx];}
else if(mode==='console'){idx++;if(idx>=consoleSeq.length){stack=['home'];current='home';mode='';idx=-1;}else current=consoleSeq[idx];}
render();}
screen.addEventListener('touchstart',e=>sx=e.touches[0].clientX);
screen.addEventListener('touchend',e=>{if(e.changedTouches[0].clientX-sx<-60)advance();});
hs_production.onclick=()=>go('production');
hs_shrink.onclick=()=>go('shrink');
hs_temperature.onclick=()=>{mode='temp';idx=0;current=temp[0];stack.push(current);render();}
hs_console.onclick=()=>{mode='console';idx=0;current=consoleSeq[0];stack.push(current);render();}
backBtn.onclick=back;render();
