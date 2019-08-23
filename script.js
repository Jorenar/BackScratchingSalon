var mouseIsDown = 0;
var spotRows = 13;
var spotColumns = 12;

var audio = new Audio('sound.ogg');

var customerDiv = document.querySelector('.customer')

function randomColor() {
  return '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6)
}
var satisfyBar = document.getElementById('satisfyBar');

function whenMouseUp() {
  mouseIsDown = 0;
  document.querySelectorAll('.scratched').forEach(spotScratched => {
    spotScratched.classList.remove('scratched')
  });
}

function finalize(satisfy, timeLeft) {
  document.querySelector('.back').innerHTML = '';
  clearInterval(customer.timer)
  document.getElementById("timer").firstChild.innerHTML = '--';
  satisfyBar.style.width = satisfy + '%';

  customerDiv.style.filter = "opacity(50%)"

  setTimeout( () => {
    customerDiv.innerHTML = "";
    customer = new Customer;
  }, 1000);
}

function createBodyPart(classes, parent) {
  part = document.createElement('div')
  part.className = classes;
  parent.appendChild(part);
  return part;
}

class Customer {
  constructor() {
    let spotRowsArray = new Array(spotRows).fill(0);
    let spotColumnsArray = new Array(spotColumns).fill(0);
    this.verticalScratches = 0;
    this.horizontalScratches = 0;
    this.skewScratches = 0;

    this.satisfy = 0;
    satisfyBar.style.width = '0%';

    let multipliers = { vertical:1, horizontal:1, skew:1 }
    //, left:1, right:1, top:1, down:1, middleV:1, middleH:1 };
    let maxMul = 0;
    for (let multiplier in multipliers) {
      multipliers[multiplier] = Math.floor(Math.random() * 7) + 3;
      maxMul = multipliers[multiplier] > maxMul ? multipliers[multiplier] : maxMul;
    }

    this.time = Math.floor((Math.random() * 5) + 20) - maxMul;

    document.getElementById("timer").firstChild.innerHTML = this.time;

    this.timer = setInterval(() => {
      if (this.time === 0) {
      } else {
        document.getElementById("timer").firstChild.innerHTML = --this.time >= 10 ? this.time : '0'+this.time;
        finalize(customer.satisfy, 0);
      }
    }, 1000);

    customerDiv.style = "--skin-color: " + randomColor();

    let head = createBodyPart('head', customerDiv);
    let back = createBodyPart('back', customerDiv);

    createBodyPart('hair', head);
    createBodyPart('ears', customerDiv);
    createBodyPart('neck', customerDiv);

    for (let i = 0; i < spotRows; ++i) {
      for (let j = 0; j < spotColumns; ++j) {
        let spot = document.createElement('div');
        spot.className = "spot";
        spot.dataset.row = i;
        spot.dataset.column = j;
        spot.onmouseover = () => {
          if (mouseIsDown) {
            spot.classList.add('scratched');

            let scratched = document.querySelectorAll('.scratched');

            audio.play();

            if (scratched.length >= 10) {
              scratched.forEach(spotScratched => {
                spotRowsArray[spotScratched.dataset.row]++;
                spotColumnsArray[spotScratched.dataset.column]++;
              });

              let horizontality = spotRowsArray.reduce((n, x) => n + (x === 0), 0);
              let verticality = spotColumnsArray.reduce((n, x) => n + (x === 0), 0);

              let verticalScratch = verticality > horizontality + 2 ? 1 : 0;
              let horizontalScratch = verticality + 2 < horizontality ? 1 : 0;
              let skewScratch = Math.abs(verticality - horizontality) < 2 ? 1 : 0;

              spotRowsArray.fill(0);
              spotColumnsArray.fill(0);

              scratched.forEach(spotScratched => {
                spotScratched.classList.remove('scratched')
              });

              if (verticalScratch)
                this.satisfy += verticalPoints;
              else if (horizontalScratch)
                this.satisfy += horizontalPoints;
              else if (skewScratch)
                this.satisfy += skewPoints;

              if (this.satisfy < 100)
                document.getElementById("satisfyBar").style.width = this.satisfy + '%';
              else
                finalize(100, this.time)
            }
          }
        }
        back.appendChild(spot);
      }
    }

    document.querySelectorAll('.unpleasant, .unpleasant *').forEach(item => {
      item.onmousemove = () => {
        if (mouseIsDown) {
          alert("Auch!");
        }
      }
    });

  }
}

var customer = new Customer();
