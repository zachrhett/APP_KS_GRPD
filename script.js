const screen=document.getElementById('screen');

const routes={
 home:'images/home.png',
 production:'images/production.png',
 inventory:'images/inventory.png',
 ordering:'images/ordering.png',
 labor:'images/labor.png',
 replenishment:'images/replenishment.png',
 sales:'images/sales.png',
 shrink:'images/shrink.png',
 safety:'images/safety.png',
 foodsafety:'images/foodsafety.png',
 freshstart:'images/freshstart.png',
 maximo:'images/maximo.png',
 storeleader:'images/storeleader.png',
 scorecard:'images/store_scorecard.png',
 composite:'images/composite.png',
 temperature:'images/temperature_log.png'
};

let history=['home'];

function show(name){
 if(!routes[name]) return;
 screen.src=routes[name];
 history.push(name);
}

function back(){
 if(history.length>1){
   history.pop();
   screen.src=routes[history[history.length-1]];
 }
}

// Pass 3 adds hotspots and swipe navigation.
show('home');
