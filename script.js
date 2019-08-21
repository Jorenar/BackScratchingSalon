var mouseIsDown = 0;
var points = 0;
var time;
var spotRows = 13;
var spotColumns = 12;
var spotRowsArray = new Array(spotRows).fill(0);
var spotColumnsArray = new Array(spotColumns).fill(0);

var customerDiv = document.querySelector('.customer')

const randomColor = () => {
  return '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6)
}

const createBodyPart = (classes, parent) => {
  part = document.createElement('div')
  part.className = classes;
  parent.appendChild(part);
  return part;
}

const createCustomer = () => {
  let verticalScratches = 0;
  let horizontalScratches = 0;
  time = Math.floor((Math.random() * 20) + 10);
  customerDiv.innerHTML = "";
  customerDiv.className = 'customer';
  customerDiv.style = "--skin-color: " + randomColor() +
    "; --hair-color: " + randomColor();

  head = createBodyPart('head', customerDiv);
  createBodyPart('hair', head);
  ears = createBodyPart('ears', customerDiv);
  createBodyPart('ear', ears);
  createBodyPart('ear earRight', ears);
  createBodyPart('neck', customerDiv);
  back = createBodyPart('back', customerDiv);

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

            verticalScratches += verticality > horizontality ? 1 : 0;
            horizontalScratches += verticality < horizontality ? 1 : 0;
            console.log(verticalScratches)

            spotRowsArray.fill(0);
            spotColumnsArray.fill(0);
            document.getElementById('points').innerText = Math.floor(++points);
            scratched.forEach(spotScratched => {
              spotScratched.classList.remove('scratched')
            });
          }
        }
      }
      back.appendChild(spot);
    }
  }

  back.addEventListener('touchmove', () => {
    document.getElementById('points').innerText = Math.floor(points += 0.05);
  });

  document.querySelectorAll('.unpleasant, .unpleasant *').forEach(item => {
    item.onmousemove = () => {
      if (mouseIsDown) {
        alert("Auch!");
      }
    }
  });


  document.getElementById("timer").innerHTML = time;
}

createCustomer();

const nextCustomer = () => {
  customerDiv.innerHTML = "";
  createCustomer();
}

/*
setInterval(() => {
  if (time === 0) {
    nextCustomer();
  } else {
    document.getElementById("timer").innerHTML = --time;
  }
}, 1000);
*/
