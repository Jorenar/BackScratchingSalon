// flag variables
var mouseIsDown = 0
var firstRun = 1 // there is no need to generate some things again
var mute = 0
var pause = 0

var satisfy = 0

var customerTime
var taxTime

var customerTimer
var taxTimer

var cookiePrefix = "BackScratchingSalon_"

var multiplier = 1

var customerDiv = document.querySelector('.customer')
var moneyDiv = document.getElementById('money')
var satisfyBar = document.getElementById('satisfyBar')
var timerDiv = document.getElementById('timer')

// data variables
var d = {
  chainsaw: 0,
  fingers: 1,
  hands: 0,
  nextTax: 3600,
  hands: 0,
  longNails: 0,
  money: 0,
  sandpaper: 0,
  scratcher: 0,
}

// settings variables
var s = {
  autoMute: 0,
  autoSave: 1,
  autoPause: 0,
  skipTitle: 0,
  disableCookieMsg: 0,
}

// default parameters of previous dictionaries
const m = Object.assign({}, d)
const n = Object.assign({}, s)

Element.prototype.toggle = function() {
  this.classList.toggle('hidden')
}

Element.prototype.toggleInactive = function() {
  this.classList.toggle('inactiveCover')
}

function startTimer(duration, display, instructions) {
    let time = duration
    let timer = setInterval( () => {
        let minutes = parseInt(time / 60, 10);
        let seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--time < 0) {
            time = duration;
        }
    }, 1000);
  return timer
}

function save(type, dict) {
  let variables = ''
  for (let key in dict)
    variables += dict[key] + '|'
  document.cookie = cookiePrefix + type + 'Save=' + encodeURI(variables) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
  document.getElementById('cmd').innerHTML = 'SAVED ' + type + '_'
  setTimeout(() => {
    document.getElementById('cmd').innerHTML = '# <span>_</span>'
  }, 1000)
}

function getCookie(name) {
  var dc = document.cookie
  var prefix = name + "="
  var begin = dc.indexOf("; " + prefix)
  if (begin == -1) {
    begin = dc.indexOf(prefix)
    if (begin != 0) return null
  } else {
    begin += 2
    var end = document.cookie.indexOf(";", begin)
    if (end == -1) {
      end = dc.length
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end))
  return decodeURI(dc.substring(begin + prefix.length, end))
}

function readSave(type, dict) {
  let variables = getCookie(cookiePrefix + type + 'Save')
  if (variables) {
    variables = variables.split('|')
    let i = 0
    for (let key in dict)
      dict[key] = Number(variables[i++])
  }
}

function fillData() {
  document.title = '$' + d.money + ' | Back Scratching Salon'
  moneyDiv.innerHTML = d.money
  mute = s.autoMute
  document.querySelectorAll('.powerUps > .item').forEach(item => {
    item.querySelector('.amount').innerHTML = d[item.id]
  })
}

function sound() {
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

function whenMouseUp() {
  mouseIsDown = 0
  document.querySelectorAll('.scratched').forEach(spotScratched => {
    spotScratched.classList.remove('scratched')
  })
}

function recalculateMultiplier() {
  multiplier = 0.2
  document.querySelectorAll('.amount').forEach(amount => {
    let current = amount.innerHTML
    //multiplier *= current > 0 ? current * (1 + amount.dataset.worth / 1000) : 1
    multiplier += current * amount.dataset.worth
  })
}

function toggleMute() {
  mute = mute ? 0 : 1
  document.querySelector('.sound').innerHTML = mute ? '&#128263;' : '&#128264;'
}

function finalize() {
  clearInterval(customerTimer)
  document.querySelector('.back').innerHTML = ''
  timerDiv.innerHTML = '--'

  satisfyBar.style.width = satisfy + '%'

  recalculateMultiplier()

  d.money += customerTime > 0 ? Math.floor(customerTime * satisfy * multiplier / 100) : Math.floor(satisfy * multiplier / 100)

  customerDiv.style.filter = 'opacity(20%)'

  document.title = '$' + d.money + ' | Back Scratching Salon'
  moneyDiv.innerHTML = d.money

  setTimeout(() => {
    customerDiv.innerHTML = ''
    createCustomer()
  }, 1000)
}

function createBodyPart(classes, parent) {
  part = document.createElement('div')
  part.className = classes
  parent.appendChild(part)
  return part
}

function createCustomer() {
  satisfy = 0

  satisfyBar.style.width = '0%'

  customerTime = 15

  timerDiv.innerHTML = customerTime

  customerTimer = setInterval(() => {
    if (customerTime === 0) {
      finalize()
    } else if (!pause) {
      timerDiv.innerHTML = --customerTime >= 10 ? customerTime : '0' + customerTime
    }
  }, 1000)

  customerDiv.style = '--skin-color: #' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6)

  let head = createBodyPart('head', customerDiv)
  createBodyPart('neck', customerDiv)

  let back = createBodyPart('back', customerDiv)

  let hair = createBodyPart('hair', head)

  if (Math.floor((Math.random() * 2)))
    hair.classList.add('long')

  createBodyPart('ears', customerDiv)

  for (let i = 0; i < 13; ++i) {
    for (let j = 0; j < 12; ++j) {
      let spot = document.createElement('div')
      spot.className = 'spot'
      spot.onmouseover = () => {
        if (mouseIsDown && !pause) {
          spot.classList.add('scratched')

          let scratched = document.querySelectorAll('.scratched')

          if (scratched.length >= 5) {
            scratched.forEach(spotScratched => {
              spotScratched.classList.remove('scratched')
            })

            if (!mute)
              sound()

            satisfy += 5
            if (satisfy < 100)
              document.getElementById('satisfyBar').style.width = satisfy + '%'
            else
              finalize()
          }
        }
      }
      back.appendChild(spot)
    }
  }
  back.insertAdjacentHTML('beforeend', '<div style="font-size: 70px; color: red; background: black">' + atob('Q0VOU1VSRQ') + '</div>')
}

function settings() {
  document.querySelector('.settingsWin').classList.remove('hidden')
}

function togglePause() {
  pause = pause ? 0 : 1
  satisfyBar.toggleInactive()
  if (pause) {
    clearInterval(customerTimer)
    customerDiv.innerHTML = ''
    timerDiv.innerHTML = '--'
    satisfy = 0
    satisfyBar.style.width = '0%'
  } else {
    createCustomer()
  }
  satisfyBar.toggle()
  document.querySelector('.backToWork').toggle()
  document.querySelector('.takeBreak').toggle()
  document.querySelector('.break').toggle()
  document.querySelector('.customerContainer').toggleInactive()
}

const taxFunc = () => {

}

function checkForSave() {
  if (document.cookie.includes('BackScratchingSalon_DataSave')) {
    document.getElementById('continue').classList.remove('hidden')
    document.getElementById('newGame').onclick = () => {
      document.querySelector('.newGameWarning').toggle()
    }
  }
}

function backToTitle() {
  document.title = 'Back Scratching Salon'
  if (pause)
    togglePause()
  clearInterval(customerTimer)
  customerDiv.innerHTML = ''

  document.querySelector('.backToTitleConfirm').toggle()
  document.querySelector('.playScreen').toggle()
  checkForSave()
  document.querySelector('.titleScreen').toggle()
}

readSave('Settings', s)

function startGame(continuation) {

  if (continuation) {
    readSave('Data', d)
  } else {
    Object.assign(d, m)
    document.querySelector('.newGameWarning').classList.add('hidden')
  }

  fillData()

  taxTimer = startTaxTimer(60*60, document.getElementById('nextTax'), 'te')

  document.querySelector('.sound').innerHTML = mute ? '&#128263;' : '&#128264;'

  document.querySelector('.playScreen').toggle()
  document.querySelector('.titleScreen').toggle()

  createCustomer()

  document.querySelectorAll('.powerUps > .item, .equipment > .item').forEach(item => {
    let amount = item.querySelector('.amount')
    let priceDiv = item.querySelector('.price')
    let priceInitiator = priceDiv.dataset.initiator
    let price = d[item.id] ? priceInitiator * d[item.id] : priceInitiator
    let lMulti = 1.0465 + amount.dataset.worth / 100
    price = Math.floor(priceInitiator * Math.pow(lMulti, (d[item.id]+1)))
    priceDiv.innerHTML = price
    if(firstRun) {
      let buy = document.createElement('button')
      buy.innerHTML = 'BUY'
      buy.onclick = () => {
        if (d.money >= price) {
          amount.innerHTML = ++d[item.id]
          d.money -= price
          moneyDiv.innerHTML = d.money
          price = Math.floor(priceInitiator * Math.pow(lMulti, (d[item.id]+1)))
          priceDiv.innerHTML = price
        }
      }
      item.querySelector('.bottomRow').insertBefore(buy, amount)
    }
  })

  recalculateMultiplier()

  firstRun = 0

  if (s.autoPause)
    togglePause()
}

document.querySelectorAll('.settingsWin > div > label > input[type=checkbox]').forEach(checkbox => {
  checkbox.checked = s[checkbox.name]
  checkbox.onclick = () => {
    s[checkbox.name] = Number(checkbox.checked)
  }
})

document.querySelectorAll('.tabs > button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.management .current').forEach(e => {
      e.classList.remove('current')
    })
    document.querySelector(".management div." + CSS.escape(btn.className)).classList.add('current')
    btn.classList.add('current')
  }
})

checkForSave()

if (s.disableCookieMsg)
  document.getElementById('feedBrowser').toggle()

if (s.skipTitle)
  startGame(1)
