// variables -------------------------------------

// flag variables
var mouseIsDown = 0;
var firstRun = 1; // there is no need to generate some things again
var mute = 0;
var pause = 0;
var sound = 0;

var satisfy = 0;

var customerTime;
var taxTime;

var customerTimer;
var paydayTimer;
var taxTimer;
var equipmentTimer;
var autosaveTimer;

var customerDiv = document.querySelector('.playScreen .customer');
var satisfyBar = document.getElementById('satisfyBar');
var timerDiv = document.querySelector('.timer');

// data variables
var d = {
  chainsaw: 0,
  fingers: 1,
  hands: 0,
  hands: 0,
  longNails: 0,
  money: 0,
  nextPayday: 600,
  nextTax: 1200,
  sandpaper: 0,
  scratcher: 0,
  tax: 0.1,
  toothbrush: 0,
}

// settings variables
var s = {
  autoMute: 0,
  autoPause: 0,
  autoSave: 1,
  skipTitle: 0,
}

const m = Object.assign({}, d)

// Custom methods --------------------------------

Element.prototype.toggle = function() {
  this.classList.toggle('hidden');
}

Element.prototype.toggleInactive = function() {
  this.classList.toggle('inactiveCover');
}

Math.decimal = function(n, k) {
  var factor = Math.pow(10, k+1);
  n = Math.round(Math.round(n*factor)/10);
  return n/(factor/10);
}

// timers ----------------------------------------

function startTimer(dTime, display, instructions) {
  let timer = setInterval( () => {
    if (d[dTime]-- == 0) {
      instructions();
    }

    let minutes = parseInt(d[dTime] / 60, 10);
    let seconds = parseInt(d[dTime] % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

  }, 1000);
  return timer;
}

const taxPay = function() {
  let tax = Math.floor(d.tax * d.money);
  updateMoney(-tax);
  if (tax)
    setTimeout( () => { document.querySelector('#nextTax').textContent = 'paid' }, 0);
  d.nextTax = 1200;
}

const payday = function() {
  let salary = 0;
  document.querySelectorAll('.personnel > .employee').forEach(employee => {
    salary = employee.dataset.hired ? employee.dataset.wage : 0;
  });
  updateMoney(-salary)
  if (salary)
    setTimeout( () => { document.querySelector('#nextTax').textContent = 'paid' }, 0);
  d.nextPayday = 600;
}


// saves

function save(type, dict) {
  localStorage.setItem('BackScratchingSalon_' + type, JSON.stringify(dict));
  document.querySelector('.cmd').innerHTML = 'SAVED ' + type + '_';
  setTimeout(() => {
    document.querySelector('.cmd').innerHTML = '# <span>_</span>';
  }, 1000);
}

function readSave(type, dict) {
  Object.assign(dict, JSON.parse(localStorage['BackScratchingSalon_' + type]));
}

function fillData() {
  updateMoney(0);
  mute = s.autoMute;
  taxTime = d.nextTax;
  document.getElementById('nextPayday').innerHTML = '--:--';
  document.getElementById('nextTax').innerHTML = '--:--';
  document.querySelectorAll('.powerUps > .item, .equipment > .item').forEach(item => {
    item.querySelector('.amount').innerHTML = d[item.id];
  });
}

function checkForSave() {
  if (localStorage['BackScratchingSalon_data']) {
    document.getElementById('continue').classList.remove('hidden');
    document.getElementById('newGame').onclick = () => {
      document.querySelector('.newGameWarning').toggle();
    }
  }
}

function rot13Fast(str) {
  return str.split('').map(x => rot13Fast.lookup[x] || x).join('')
}
rot13Fast.input  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
rot13Fast.output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'.split('')
rot13Fast.lookup = rot13Fast.input.reduce((m,k,i) => Object.assign(m, {[k]: rot13Fast.output[i]}), {})

function export_save() {
  let exportWin = document.querySelector('.exportWin');
  exportWin.toggle();
  exportWin.querySelector('textarea').value = rot13Fast(encodeURI(JSON.stringify(d)));
}

function import_save() {
  let importWin = document.querySelector('.importWin');
  importWin.toggle();
  let ta = importWin.querySelector('textarea');
  ta.value = '';
  importWin.querySelector('#loadImported').onclick = () => {
    Object.assign(d, JSON.parse(decodeURI(rot13Fast(ta.value))));
    importWin.toggle();
    fillData();
  }
}


// toggle, change display, show window etc. ------

function toggleMute() {
  mute = mute ? 0 : 1;
  document.querySelector('.sound').innerHTML = mute ? '&#128263;' : '&#128264;';
}

function togglePause() {
  pause = pause ? 0 : 1;
  satisfyBar.toggleInactive();
  if (pause) {
    clearInterval(customerTimer);
    customerDiv.innerHTML = '';
    timerDiv.innerHTML = '--';
    satisfy = 0;
    satisfyBar.style.width = '0%';
  } else {
    createCustomer();
  }
  satisfyBar.toggle();
  document.querySelector('.backToWork').toggle();
  document.querySelector('.takeBreak').toggle();
  document.querySelector('.break').toggle();
  customerDiv.parentNode.toggleInactive();
}

function backToTitle() {
  clearInterval(autosaveTimer);
  clearInterval(customerTimer);
  clearInterval(taxTimer);
  clearInterval(paydayTimer);
  clearInterval(equipmentTimer);

  if (pause)
    togglePause();

  document.title = 'Back Scratching Salon';

  customerDiv.innerHTML = '';

  checkForSave();

  document.querySelector('.backToTitleConfirm').toggle();
  document.querySelector('.playScreen').toggle();
  document.querySelector('.titleScreen').toggle();
}


// main fun --------------------------------------

function updateMoney(howMuch) {
  d.money += howMuch;
  let money = d.money.toFixed(2);
  document.title = '$' + money + ' | Back Scratching Salon';
  document.querySelector('.money').innerHTML = money;
}

function finalize() {
  clearInterval(customerTimer);
  customerDiv.querySelector('.back').onmouseover = () => {};
  timerDiv.innerHTML = '--';

  let multiplier = 0.2;
  document.querySelectorAll('.powerUps .amount').forEach(amount => {
    let current = amount.innerHTML;
    multiplier += current * amount.dataset.worth;
  });

  updateMoney( customerTime > 0 ? Math.floor(customerTime * satisfy * multiplier / 100) : Math.floor(satisfy * multiplier / 100));

  customerDiv.style.filter = 'opacity(20%)';

  setTimeout(() => {
    customerDiv.innerHTML = '';
    createCustomer();
    satisfyBar.style.width = '0%';
  }, 1000);
}

function createBodyPart(classes, parent) {
  part = document.createElement('div');
  part.className = classes;
  parent.appendChild(part);
  return part;
}

function scratching() {
  if(satisfy < 100) {

    if (!mute && ++sound == 10) {
      sound = 0;
      with(new AudioContext)
        with(G = createGain())
          for (i in D = [16, 12])
            with(createOscillator())
              if (D[i])
                connect(G),
                  G.connect(destination),
                  start(i * .05),
                  frequency.setValueAtTime(550 * 1.06 ** (13 - D[i]), i * .05),
                  gain.setValueAtTime(0.1, i * .05),
                  gain.setTargetAtTime(.0001, i * .05 + .03, .005),
                  stop(i * .05 + .04)
    }

    satisfy += 0.325 * (d.hands+1)
    if (satisfy < 100) {
      satisfyBar.style.width = satisfy + '%';
    } else {
      satisfyBar.style.width = '100%';
      finalize();
    }
  }
}

function createCustomer() {
  satisfy = 0;

  satisfyBar.style.width = '0%';

  timerDiv.innerHTML = customerTime = 15;

  customerTimer = setInterval(() => {
    if (customerTime === 0) {
      finalize();
    } else if (!pause) {
      timerDiv.innerHTML = --customerTime >= 10 ? customerTime : '0' + customerTime;
    }
  }, 1000);

  customerDiv.style = '--skin-color: #' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);

  let head = createBodyPart('head', customerDiv);
  createBodyPart('neck', customerDiv);

  let back = createBodyPart('back', customerDiv);

  let hair = createBodyPart('hair', head);

  if (Math.floor((Math.random() * 2)))
    hair.classList.add('long');

  createBodyPart('ears', customerDiv);

  sound = 0

  back.onmousemove = () => {
    if (mouseIsDown)
      scratching();
  }
  back.addEventListener("touchmove", scratching, false);

}


// initialize ------------------------------------

if (localStorage['BackScratchingSalon_settings'])
  readSave('settings', s);

function startGame(continuation) {

  if (continuation) {
    readSave('data', d);
  } else {
    Object.assign(d, m);
    document.querySelector('.newGameWarning').classList.add('hidden');
  }

  fillData();

  taxTimer = startTimer('nextTax', document.getElementById('nextTax'), taxPay);
  paydayTimer = startTimer('nextPayday', document.getElementById('nextPayday'), payday);

  document.querySelector('.sound').innerHTML = mute ? '&#128263;' : '&#128264;';

  document.querySelector('.playScreen').toggle();
  document.querySelector('.titleScreen').toggle();

  createCustomer();

  document.querySelectorAll('.powerUps > .item, .equipment > .item').forEach(item => {
    let amount = item.querySelector('.amount');
    let priceDiv = item.querySelector('.price');
    let priceInitiator = priceDiv.dataset.initiator;
    let price = d[item.id] ? priceInitiator * d[item.id] : priceInitiator;
    let lMulti = 1.0465 + amount.dataset.worth / 100;
    price = Math.floor(priceInitiator * Math.pow(lMulti, (d[item.id]+1)));
    priceDiv.innerHTML = price;
    if(firstRun) {
      let buy = document.createElement('button');
      buy.innerHTML = 'BUY';
      buy.onclick = () => {
        if (d.money >= price) {
          amount.innerHTML = ++d[item.id];
          updateMoney(-price)
          price = Math.floor(priceInitiator * Math.pow(lMulti, (d[item.id]+1)));
          priceDiv.innerHTML = price;
        }
        if (amount.dataset.max == d[item.id]) {
          buy.toggleInactive();
          buy.onclick = () => {};
        }
      }
      item.querySelector('.bottomRow').insertBefore(buy, amount);
    }
  })

  firstRun = 0;

  equipmentTimer = setInterval( () => {
    document.querySelectorAll('.equipment > .item').forEach(item => {
      let amount = item.querySelector('.amount');
      let gain = amount.dataset.worth;
      updateMoney(gain * amount.innerHTML);
    })
  }, 1000);

  autosaveTimer = setInterval( () => {
    if (s.autoSave)
      save('data', d);
  }, 10000);

  if (s.autoPause)
    togglePause();
}

document.querySelectorAll('.settingsWin > div > label > input[type=checkbox]').forEach(checkbox => {
  checkbox.checked = s[checkbox.name];
  checkbox.onclick = () => {
    s[checkbox.name] = Number(checkbox.checked);
  }
});

document.querySelectorAll('.tabs > button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.management .current').forEach(e => {
      e.classList.remove('current');
    });
    document.querySelector(".management div." + CSS.escape(btn.className)).classList.add('current');
    btn.classList.add('current');
  }
});

checkForSave();

if (s.skipTitle)
  startGame(1);
