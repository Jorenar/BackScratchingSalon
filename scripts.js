for (let area of [document.querySelector('.upper'), document.querySelector('.down')]) {
  for (let i = 0; i < 36; ++i) {
    let spot = document.createElement('div');
    spot.className = "spot";
    area.appendChild(spot);
  }
}

for (let i = 0; i < 36; ++i) {
  let spot = document.createElement('div');
  spot.className = "spot";
  document.querySelector('.upper').after(spot);
}

var spotted=0;
while(!spotted) {
  for (let spot of document.getElementsByClassName('spot')) {
    if (Math.floor((Math.random() * 2000) + 1) % 13 === 0
      && Math.floor((Math.random() * 2000) + 1) % 5 === 0) {
      spot.className = "spot itchy";
      spotted++;
      break;
    }
  }
}

var foo = 0;
var down = 0;
var startingTop = 0,
  startingLeft = 0;
var points = 0;
up = 0;
dn = 0;

document.querySelector('.back').onmousemove = () => {
  if (down) {
    if (up && dn) {
      document.getElementById('points').innerText = ++points;
      up = 0;
      dn = 0;
    }
  }
};

document.querySelectorAll('.unpleasant, .unpleasant *').forEach(item => {
  item.onmousemove = () => {
    if (down) {
      alert("Auch!");
    }
  }
});

document.querySelectorAll('.itchy').forEach(item => {
  item.onmousemove = () => {
    if (down) {
      document.getElementById('points').innerText = points += 2;
      up = 0;
      dn = 0;
    }
  }
});
