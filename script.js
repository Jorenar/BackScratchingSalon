var backColumns = 12;
var backRows = 13;

var mouseIsDown = 0;
var mute = 0;
var pause = 0;

var money = 0;

var satisfy = 0;

var time;
var timer;

var customerDiv = document.querySelector('.customer')
var moneyDiv = document.getElementById('money').firstChild;
var pauseScreen = document.getElementById('pauseScreen');
var satisfyBar = document.getElementById('satisfyBar');
var timerDiv = document.getElementById('timer').firstChild;

function sound() {
  with(new AudioContext)
    with(G=createGain())
      for(i in D=[17,12])
        with(createOscillator())
          if(D[i])
            connect(G),
              G.connect(destination),
              start(i*.1),
              frequency.setValueAtTime(440*1.06**(13-D[i]),i*.1),
              gain.setValueAtTime(1,i*.1),
              gain.setTargetAtTime(.0001,i*.1+.08,.005),
              stop(i*.1+.09)
}

function whenMouseUp() {
  mouseIsDown = 0;
  document.querySelectorAll('.scratched').forEach(spotScratched => {
    spotScratched.classList.remove('scratched')
  });
}

function finalize() {
  clearInterval(timer)
  document.querySelector('.back').innerHTML = '';
  timerDiv.innerHTML = '--';

  satisfyBar.style.width = satisfy + '%';

  money += time > 0 ? satisfy*time/100 : Math.floor(satisfy/10);

  customerDiv.style.filter = "opacity(20%)"

  document.title = "$" + money + " | Back Scratching Salon"
  moneyDiv.innerHTML = '$' + money;

  setTimeout(() => {
    customerDiv.innerHTML = "";
    createCustomer();
  }, 1000);
}

function createBodyPart(classes, parent) {
  part = document.createElement('div')
  part.className = classes;
  parent.appendChild(part);
  return part;
}

function createCustomer() {
  satisfy = 0;

  satisfyBar.style.width = '0%';

  time = 15;

  timerDiv.innerHTML = time;

  timer = setInterval(() => {
    if (time === 0) {
      finalize();
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
      spot.onmouseover = () => {
        if (mouseIsDown) {
          spot.classList.add('scratched');

          let scratched = document.querySelectorAll('.scratched');

          if (scratched.length >= 10) {
            scratched.forEach(spotScratched => {
              spotScratched.classList.remove('scratched')
            });

            if (!mute)
              sound()

            satisfy += 5;
            if (satisfy < 100)
              document.getElementById("satisfyBar").style.width = satisfy + '%';
            else
              finalize()
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
  document.querySelector('.mute').style.display = 'none';
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
  document.querySelector('.mute').style.display = mute ? 'none' : '';
  mute = mute ? 0 : 1;
}

startGame();

// vim: fen:
