var backColumns = 12;
var backRows = 13;

var mouseIsDown = 0;
var mute = 0;
var pause = 0;

var money = 0;

var satisfy = 0;

var time;
var timer;

var audio = new Audio('sound.ogg');

var customerDiv = document.querySelector('.customer')
var moneyDiv = document.getElementById('money').firstChild;
var pauseScreen = document.getElementById('pauseScreen');
var satisfyBar = document.getElementById('satisfyBar');
var timerDiv = document.getElementById('timer').firstChild;

function whenMouseUp() {
  mouseIsDown = 0;
  document.querySelectorAll('.scratched').forEach(spotScratched => {
    spotScratched.classList.remove('scratched')
  });
}

function finalize(timeLeft) {
  document.querySelector('.back').innerHTML = '';
  clearInterval(timer)
  timerDiv.innerHTML = '--';
  if (satisfy > 100)
    satisfy = 100;

  satisfyBar.style.width = satisfy + '%';

  money += timeLeft > 0 ? satisfy*timeLeft/100 : Math.floor(satisfy/10);

  customerDiv.style.filter = "opacity(50%)"

  document.title = "$" + money + " | Back Scratching Salon"
  moneyDiv.innerHTML = '$' + money;

  setTimeout(() => {
    customerDiv.innerHTML = "";
    createCustomer();
  }, 100);
}

function createBodyPart(classes, parent) {
  part = document.createElement('div')
  part.className = classes;
  parent.appendChild(part);
  return part;
}

function createCustomer() {
  satisfy = 0;

  let spotRowsArray = new Array(backRows).fill(0);
  let spotColumnsArray = new Array(backColumns).fill(0);
  let verticalScratches = 0;
  let horizontalScratches = 0;
  let skewScratches = 0;

  satisfyBar.style.width = '0%';

  let verticalPoints = Math.floor(Math.random() * 7) + 3;
  let horizontalPoints = Math.floor(Math.random() * 7) + 3;
  let skewPoints = Math.floor(Math.random() * 7) + 3;

  time = Math.floor((Math.random() * 5) + 20) - Math.max(verticalPoints, horizontalPoints, skewPoints);

  timerDiv.innerHTML = time;

  timer = setInterval(() => {
    if (time === 0) {
      finalize(0);
    } else if (!pause) {
      timerDiv.innerHTML = --time >= 10 ? time : '0' + time;
    }
  }, 1000);

  customerDiv.style = "--skin-color: #" + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);

  let head = createBodyPart('head', customerDiv);
  createBodyPart('neck', customerDiv);

  let back = createBodyPart('back', customerDiv);

  let hair = createBodyPart('hair', head);

  if (Math.floor((Math.random() * 2)))
    hair.classList.add('long')

  createBodyPart('ears', customerDiv);

  for (let i = 0; i < backRows; ++i) {
    for (let j = 0; j < backColumns; ++j) {
      let spot = document.createElement('div');
      spot.className = "spot";
      spot.dataset.row = i;
      spot.dataset.column = j;
      spot.onmouseover = () => {
        if (mouseIsDown) {
          spot.classList.add('scratched');

          let scratched = document.querySelectorAll('.scratched');

          if (!mute)
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
              satisfy += verticalPoints;
            else if (horizontalScratch)
              satisfy += horizontalPoints;
            else if (skewScratch)
              satisfy += skewPoints;

            if (satisfy < 100)
              document.getElementById("satisfyBar").style.width = satisfy + '%';
            else
              finalize(time)
          }
        }
      }
      back.appendChild(spot);
    }
  }
}

function startGame() {
  document.getElementById('playScreen').style.display = '';
  document.getElementById('titleScreen').style.display = 'none';
  document.title = "$" + money + " | Back Scratching Salon"
  createCustomer();
}

function pauseGame() {
  pause = 1
  pauseScreen.style.display = '';
  document.querySelector('.pause').style.display = 'none';
  document.querySelector('.start').style.display = '';
}

function resumeGame() {
  pause = 0
  pauseScreen.style.display = 'none';
  document.querySelector('.pause').style.display = '';
  document.querySelector('.start').style.display = 'none';
}

function toggleMute() {
  if (mute) {
    document.querySelector('.mute').style.display = '';
    document.querySelector('.unmute').style.display = 'none';
    mute = 0;
  } else {
    document.querySelector('.unmute').style.display = '';
    document.querySelector('.mute').style.display = 'none';
    mute = 1;
  }
}

startGame();

// vim: fen:
