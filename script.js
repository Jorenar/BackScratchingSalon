var mouseIsDown = 0;
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

function finalize(pleasure) {
  customerDiv.innerHTML = "";

  customer = new Customer;
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

    let pleasure = 50;
    document.getElementById('pleasureBar').style.width = '50%';

    // time = Math.floor((Math.random() * 20) + 10);
    time = 30;

    // 0 - neutral, 1 - likes, 2 - hates
    let attitudeVertical   = Math.floor(Math.random() * 3);
    let attitudeHorizontal = Math.floor(Math.random() * 3);
    let attitudeSkew       = Math.floor(Math.random() * 3);

    if (attitudeVertical == 1) {
      let attitudeLeft = Math.floor(Math.random() * 3);
      let attitudeRight = Math.floor(Math.random() * 3);
    }

    if (attitudeHorizontal == 1) {
    }

    console.log(attitudeVertical)
    console.log(attitudeHorizontal)
    console.log(attitudeSkew)

    customerDiv.style = "--skin-color: " + randomColor() +
      "; --hair-color: " + randomColor();

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
                pleasure = this.checkAttitude(attitudeVertical, pleasure);
              else if (horizontalScratch)
                pleasure = this.checkAttitude(attitudeHorizontal, pleasure);
              else if (skewScratch)
                pleasure = this.checkAttitude(attitudeSkew, pleasure);

              console.log(pleasure);

              if (pleasure < 100 && pleasure > 0)
                document.getElementById("pleasureBar").style.width = pleasure + '%';
              else
                finalize(pleasure);
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

  checkAttitude(pref, pleasure) {
    pleasure += (pref == 0)*5;
    pleasure += (pref == 1)*10;
    pleasure -= (pref == 2)*5;
    return pleasure > 0 ? pleasure : 0;
  }
}

var customer = new Customer();

/*
setInterval(() => {
  if (time === 0) {
    finalize();
    customer = new Customer();
  } else {
    document.getElementById("timer").innerHTML = --time;
  }
}, 1000);
*/
