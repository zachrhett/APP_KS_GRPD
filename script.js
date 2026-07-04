const screen=document.getElementById('screen');
const backBtn=document.getElementById('hs-back');
const routes={
home:'images/home.png',
production:'images/production.png',
shrink:'images/shrink.png',
temperature:'images/temperature_log.png',
console:'images/deli-notifications.png'
};
let current='home';
let stack=['home'];
function show(name){
 if(!routes[name]) return;
 current=name;
 screen.src=routes[name];
 stack.push(name);
 backBtn.style.display=name==='home'?'none':'block';
}
function back(){
 if(stack.length<2)return;
 stack.pop();
 current=stack[stack.length-1];
 screen.src=routes[current];
 backBtn.style.display=current==='home'?'none':'block';
}
document.getElementById('hs-production').onclick=()=>show('production');
document.getElementById('hs-shrink').onclick=()=>show('shrink');
document.getElementById('hs-temperature').onclick=()=>show('temperature');
document.getElementById('hs-console').onclick=()=>show('console');
backBtn.onclick=back;
