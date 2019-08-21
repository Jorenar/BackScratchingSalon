var mouseIsDown = 0;
var points = 0;
var time;
var spotRows = 13;
var spotColumns = 12;

var customerDiv = document.querySelector('.customer')

function randomColor() {
  return '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6)
}

function whenMouseUp() {
  mouseIsDown = 0;
  document.querySelectorAll('.scratched').forEach(spotScratched => {
    spotScratched.classList.remove('scratched')
  });
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

    this.preferVertical = Math.floor(Math.random() * 2);

    time = Math.floor((Math.random() * 20) + 10);
    customerDiv.innerHTML = "";
    customerDiv.className = 'customer';
    customerDiv.style = "--skin-color: " + randomColor() +
      "; --hair-color: " + randomColor();

    let head = createBodyPart('head', customerDiv);
    createBodyPart('hair', head);
    let ears = createBodyPart('ears', customerDiv);
    createBodyPart('ear', ears);
    createBodyPart('ear earRight', ears);
    createBodyPart('neck', customerDiv);
    let back = createBodyPart('back', customerDiv);

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

            if (scratched.length >= 10) {
              scratched.forEach(spotScratched => {
                spotRowsArray[spotScratched.dataset.row]++;
                spotColumnsArray[spotScratched.dataset.column]++;
              });

              let horizontality = spotRowsArray.reduce((n, x) => n + (x === 0), 0);
              let verticality = spotColumnsArray.reduce((n, x) => n + (x === 0), 0);

              this.verticalScratches += verticality > horizontality ? 1 : 0;
              this.horizontalScratches += verticality < horizontality ? 1 : 0;

              spotRowsArray.fill(0);
              spotColumnsArray.fill(0);

              scratched.forEach(spotScratched => {
                spotScratched.classList.remove('scratched')
              });
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

    document.getElementById("timer").innerHTML = time;
  }

  finalize() {
    customerDiv.innerHTML = "";
  }
}

var customer = new Customer();

setInterval(() => {
  if (time === 0) {
    customer.finalize();
    customer = new Customer();
  } else {
    document.getElementById("timer").innerHTML = --time;
  }
}, 1000);
