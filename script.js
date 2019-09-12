// variables -------------------------------------

// flag variables
var mouseIsDown;
var firstRun = 1; // for preventing multiple creation of certain elements
var mute = 0;
var pause = 0;
var sound = 0; // it gets to be incremented to 5 and dropped to 0

var satisfy = 0;

var autosaveTimer;
var customerTimer;
var equipmentTimer;
var paydayTimer;
var taxTimer;

var customerDiv = document.querySelector('.playScreen .customer');
var satisfyBar = document.getElementById('satisfyBar');
var timerDiv = document.querySelector('.timer');

const savePrefix = 'BackScratchingSalon_';

// data variables
var d = {
  accountant: 0,
  bark: 0,
  blender: 0,
  bonus: 0,
  chainsaw: 0,
  fingers: 1,
  grinder: 0,
  hands: 0,
  hands: 0,
  janitor: 0,
  laser: 0,
  lawnMower: 0,
  longNails: 0,
  money: 0,
  nextPayday: 990,
  nextTax: 1500,
  powerWasher: 0,
  sandpaper: 0,
  scratcher: 0,
  technician: 0,
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
  let tax = Math.floor((d.accountant ? 0.01 : 0.2) * d.money);
  updateMoney(-tax);
  if (tax)
    setTimeout( () => { document.querySelector('#nextTax').textContent = 'paid' }, 0);
  d.nextTax = 1200;
}

const payday = function() {
  let salary = 0;
  document.querySelectorAll('.personnel > .item').forEach(item => {
    salary += d[item.id] * parseInt(item.querySelector('.price').innerHTML);
  });
  if (salary <= d.money) {
    updateMoney(-salary);
    if (salary)
      setTimeout( () => { document.querySelector('#nextTax').textContent = 'paid' }, 0);
  } else {
    document.querySelectorAll('.personnel > .item').forEach(item => {
      d[item.id] = 0;
      let hire = item.querySelector('button');
      hire.toggleInactive();
      hire.onclick = () => {
        ++d[item.id];
        if (item.querySelector('.amount').dataset.max == d[item.id]) {
          hire.toggleInactive();
          hire.onclick = () => {};
        }
      }
    });
  }
  if (!d.janitor) {
    updateMoney(-Math.floor(d.money * 0.45))
  }
  d.nextPayday = 600;
}


// saves

function save(type, dict) {
  localStorage.setItem(savePrefix + type, JSON.stringify(dict));
  document.querySelector('.cmd').innerHTML = 'SAVED ' + type + '_';
  setTimeout(() => {
    document.querySelector('.cmd').innerHTML = '# <span>_</span>';
  }, 1000);
}

function readSave(type, dict) {
  Object.assign(dict, JSON.parse(localStorage[savePrefix + type]));
}

function fillData() {
  updateMoney(0);
  mute = s.autoMute;
  document.getElementById('nextPayday').innerHTML = '--:--';
  document.getElementById('nextTax').innerHTML = '--:--';
  document.querySelectorAll(':not(.personnel) > .item').forEach(item => {
    item.querySelector('.amount').innerHTML = d[item.id];
  });
  if (!firstRun) {
    document.querySelectorAll('.item').forEach(item => {
      if (item.querySelector('.amount').dataset.max == d[item.id])
        item.querySelector('.bottomRow > button').classList.add('inactiveCover');
      else
        item.querySelector('.bottomRow > button').classList.remove('inactiveCover');
    })
  }
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
  input  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'.split('')
  lookup = input.reduce((m,k,i) => Object.assign(m, {[k]: output[i]}), {})
  return str.split('').map(x => lookup[x] || x).join('')
}

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

function toggleMenu(btn) {
  document.querySelectorAll('.menu > p:not(.unwindMenu)').forEach( e => {
    let disp = e.style.display;
    e.style.display = disp == 'block' ? 'none' : 'block';
  });
}

function toggleShopMobile() {
  document.querySelector('.showShop').toggle();
  document.querySelector('.playScreen .menu').toggle();
  document.querySelector('.playScreen .management').classList.toggle('hiddenMobile');
  customerDiv.parentNode.toggle();
}


// main fun --------------------------------------

function updateMoney(howMuch) {
  d.money += howMuch;
  let money = d.money.toFixed(2);
  if (howMuch < 0)
    console.log("Money decrease: $" + -howMuch.toFixed(2));
  document.title = '$' + money + ' | Back Scratching Salon';
  document.querySelector('.money').innerHTML = money;
}

function finalize(time) {
  clearInterval(customerTimer);
  customerDiv.querySelector('.back').onmousemove = () => {};
  timerDiv.innerHTML = '--';

  if (satisfy) {
    let multiplier = 0.2;
    document.querySelectorAll('.powerUps .amount').forEach(amount => {
      let current = amount.innerHTML;
      multiplier += current * amount.dataset.worth;
    });

    updateMoney( time > 0 ? Math.floor(time * satisfy * multiplier / 100) : Math.floor(satisfy * multiplier / 100));
  } else {
    updateMoney(-0.1 * d.money);
  }

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

function scratching(time) {
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
      finalize(time);
    }
  }
}

function createCustomer() {

  // to prevent creation of new customer when player press "take break" too quickly
  if (pause)
    return;

  satisfy = 0;

  satisfyBar.style.width = '0%';

  let time = 15;
  timerDiv.innerHTML = time;

  customerTimer = setInterval(() => {
    if (time === 0) {
      finalize(0);
    } else if (!pause) {
      timerDiv.innerHTML = --time >= 10 ? time : '0' + time;
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
      scratching(time);
  }
  back.addEventListener("touchmove", () => {scratching(time)}, false);

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

  if (!d.bonus) {
    if (document.monetization && document.monetization.state === 'started') {
      let coilBonus = document.createElement('div');
      coilBonus.className = 'hud item bonus';
      coilBonus.innerHTML = '<h1>COIL BONUS</h1><p>Claim your Coil subscriber bonus: +$100</p><div class="bottomRow"><button onclick="updateMoney(100); this.parentNode.parentNode.remove()">CLAIM</button></div>'
      document.querySelector('div.powerUps').prepend(coilBonus);
    }
  }

  document.querySelectorAll(':not(.personnel) > .item:not(.bonus)').forEach(item => {
    let amount = item.querySelector('.amount');
    let priceDiv = item.querySelector('.price');
    let priceInitiator = priceDiv.dataset.initiator;
    let lMulti = 1.1985 + amount.dataset.worth / 100;
    let price = Math.floor(priceInitiator * Math.pow(lMulti, (d[item.id]+1)));
    priceDiv.innerHTML = price;
    if(firstRun) {
      let buy = document.createElement('button');
      buy.innerHTML = 'BUY';
      if (amount.dataset.max == d[item.id]) {
        buy.toggleInactive();
      } else {
        buy.onclick = () => {
          if (d.money >= price) {
            amount.innerHTML = ++d[item.id];
            updateMoney(-price);
            priceDiv.innerHTML = price = Math.floor(priceInitiator * Math.pow(lMulti, (d[item.id]+1)));
          }
          if (amount.dataset.max == d[item.id]) {
            buy.toggleInactive();
            buy.onclick = () => {};
          }
        }
      }
      item.querySelector('.bottomRow').insertBefore(buy, amount);
    }
  })

  document.querySelectorAll('.personnel > .item').forEach(item => {
    if(firstRun) {
      let amount = item.querySelector('.amount');
      let hire = document.createElement('button');
      hire.innerHTML = 'HIRE'
      if (amount.dataset.max == d[item.id]) {
        hire.toggleInactive();
      } else {
        hire.onclick = () => {
          //amount.innerHTML = ++d[item.id];
          ++d[item.id];
          if (amount.dataset.max == d[item.id]) {
            hire.toggleInactive();
            hire.onclick = () => {};
          }
        }
      }
      item.querySelector('.bottomRow').insertBefore(hire, amount);
    }
  })

  firstRun = 0;

  equipmentTimer = setInterval( () => {
    document.querySelectorAll('.equipment > .item').forEach(item => {
      let amount = item.querySelector('.amount');
      let gain = amount.dataset.worth;
      gain *= d.technician + 1;
      gain *= 1 - (pause * 0.15);
      updateMoney(gain * amount.innerHTML);
    })
  }, 1100);

  autosaveTimer = setInterval( () => {
    if (s.autoSave)
      save('data', d);
  }, 60000);

  if (s.autoPause)
    togglePause();
}

document.querySelectorAll('.settingsWin > div > label > input[type=checkbox]').forEach(checkbox => {
  checkbox.checked = s[checkbox.name];
  checkbox.onclick = () => {
    s[checkbox.name] = Number(checkbox.checked);
  }
});

document.querySelectorAll('.tabs > button:not(.close)').forEach(btn => {
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
