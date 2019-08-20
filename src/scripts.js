var foo = 0;
var down = 0;
var startingTop = 0, startingLeft = 0;
var points = 0;
document.querySelector('.back').onmousemove = () => {
  if (down) {
    if (up && dn) {
      document.getElementById('points').innerText = ++points;
      up = 0; dn = 0;
    }
  }
};

document.querySelector('.hair').onmousemove = () => {
  if (down) {
    console.log("Auch!");
  }
};
