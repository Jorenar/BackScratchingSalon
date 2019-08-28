var mouseIsDown = 0

var satisfy = 0

var time
var timer

var multiplier = 1

var customerDiv = document.querySelector('.customer')
var moneyDiv = document.getElementById('money')
var satisfyBar = document.getElementById('satisfyBar')
var timerDiv = document.getElementById('timer')

var m = {
  autosave: 1,
  chainsaw: 0,
  fingers: 1,
  hands: 0,
  hands: 0,
  longNails: 0,
  money: 0,
  mute: 0,
  pause: 0,
  sandpaper: 0,
  scratcher: 0,
  skipStart: 0,
}

const n = Object.assign({}, m)

function save() {
  let variables = ''
  for (let key in m)
    variables += m[key] + '|'
  document.cookie = 'BackScratchingSalonSave=' + encodeURI(variables) + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

function readSave() {
  let variables = getCookie('BackScratchingSalonSave')
  if (variables) {
    variables = variables.split('|')
    let i = 0;
    for (let key in m)
      m[key] = Number(variables[i++])
  }
}

function fillData() {
  document.title = '$' + m.money + ' | Back Scratching Salon'
  moneyDiv.innerHTML = m.money
  document.querySelectorAll('.powerUps > .item').forEach(item => {
    item.querySelector('.amount').innerHTML = m[item.id]
  });
}

Element.prototype.toggle = function() {
  this.classList.toggle('hidden')
}

Element.prototype.toggleInactive = function() {
  this.classList.toggle('inactiveCover')
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
  multiplier = 1
  document.querySelectorAll('.amount').forEach(amount => {
    let current = amount.innerHTML
    multiplier *= current > 0 ? current * amount.dataset.worth : 1
  });
}

function finalize() {
  clearInterval(timer)
  document.querySelector('.back').innerHTML = ''
  timerDiv.innerHTML = '--'

  satisfyBar.style.width = satisfy + '%'

  recalculateMultiplier()

  m.money += time > 0 ? Math.floor(time * satisfy * multiplier / 100) : Math.floor(satisfy * multiplier / 100)

  customerDiv.style.filter = 'opacity(20%)'

  document.title = '$' + m.money + ' | Back Scratching Salon'
  moneyDiv.innerHTML = m.money

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

  time = 15

  timerDiv.innerHTML = time

  timer = setInterval(() => {
    if (time === 0) {
      finalize()
    } else if (!m.pause) {
      timerDiv.innerHTML = --time >= 10 ? time : '0' + time
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
        if (mouseIsDown && !m.pause) {
          spot.classList.add('scratched')

          let scratched = document.querySelectorAll('.scratched')

          if (scratched.length >= 5) {
            scratched.forEach(spotScratched => {
              spotScratched.classList.remove('scratched')
            })

            if (!m.mute)
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

function startGame(continuation) {
  if (continuation) {
    readSave()
    fillData()
  } else {
    Object.assign(m, n)
    fillData()
  }
  document.querySelector('.playScreen').toggle()
  document.querySelector('.titleScreen').toggle()
  if (m.mute)
    document.querySelector('.mute').toggle
  createCustomer()
  recalculateMultiplier();

  document.querySelectorAll('.powerUps > .item').forEach(item => {
    let amount = item.querySelector('.amount')
    let price = item.querySelector('.price').innerHTML
    let buy = document.createElement('button')
    buy.innerHTML = 'BUY'
    buy.onclick = () => {
      if (m.money >= price) {
        amount.innerHTML = ++m[item.id]
        m.money -= price
        moneyDiv.innerHTML = m.money
      }
    }
    item.querySelector('.bottomRow').insertBefore(buy, amount)
  });

}

function togglePause() {
  m.pause = m.pause ? 0 : 1
  timerDiv.toggleInactive();
  satisfyBar.toggleInactive();
  document.querySelector('.customerContainer').toggleInactive();
  document.querySelector('.pausePlay').toggleInactive();
}

function toggleMute() {
  m.mute = m.mute ? 0 : 1
  document.querySelector('.sound').innerHTML = m.mute ? '&#128263;' : '&#128264;'
}

document.querySelectorAll('.tabs > button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.management .current').forEach(e => {
      e.classList.remove('current')
    })
    document.querySelector(".management div." + CSS.escape(btn.className)).classList.add('current')
    btn.classList.add('current')
  }
})

function backToTitle() {
  clearInterval(timer)
  customerDiv.innerHTML = ''
  document.querySelector('.playScreen').toggle()
  document.querySelector('.titleScreen').toggle()
}

if (m.skipStart)
  startGame(1)
