var foo = 0;
var down = 0;
var startingTop = 0, startingLeft = 0;
document.querySelector('.back').onmousemove = (e) => {
  if (down) {
    let math = Math.round(Math.sqrt(Math.pow(startingTop - event.clientY, 2) +
      Math.pow(startingLeft - event.clientX, 2)));
    console.log(math);
  }
};

document.querySelector('.hair').onmousemove = () => {
  if (down) {
    console.log("Auch!");
  }
};
