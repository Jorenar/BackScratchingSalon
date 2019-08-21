var down = 0;
var points = 0;
var time;

randomColor = () => {
  return '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6)
}

createCustomer = () => {
  time = Math.floor((Math.random() * 20) + 10);
  customer = document.querySelector('.customer')
  customer.innerHTML = "";
  customer.className = 'customer squareHead';
  customer.style = "--skin-color: " + randomColor() +
    "; --hair-color: " + randomColor();

  head = document.createElement('div')
  head.className = 'head';
  customer.appendChild(head);

  hair = document.createElement('div')
  hair.className = 'hair';
  head.appendChild(hair);

  ears = document.createElement('div')
  ears.className = 'ears';
  customer.appendChild(ears);

  earLeft = document.createElement('div')
  earLeft.className = 'ear';
  ears.appendChild(earLeft);

  earRight = document.createElement('div')
  earRight.className = 'ear earRight';
  ears.appendChild(earRight);

  neck = document.createElement('div')
  neck.className = 'neck';
  customer.appendChild(neck);

  back = document.createElement('div')
  back.className = 'back';
  customer.appendChild(back);

  for (let i = 0; i < 156; ++i) {
    let spot = document.createElement('div');
    spot.className = "spot";
    spot.onmouseover = () => {
      if (down) {
        spot.classList.add('scratched');

        let scratched = document.querySelectorAll('.scratched');

        if (scratched.length >= 10) {
          document.getElementById('points').innerText = ++points;
          scratched.forEach(spotScratched => {
            spotScratched.classList.remove('scratched')
          });
        }
      }
    }
    back.appendChild(spot);
  }

  for (let spot of document.getElementsByClassName('spot')) {
    if (Math.floor((Math.random() * 2000) + 1) % 13 === 0 &&
      Math.floor((Math.random() * 2000) + 1) % 5 === 0) {
      spot.className = "spot itchy";
      break;
    }
  }

  document.querySelectorAll('.unpleasant, .unpleasant *').forEach(item => {
    item.onmousemove = () => {
      if (down) {
        alert("Auch!");
      }
    }
  });

  document.querySelectorAll('.itchy').forEach(item => {
    item.onmousemove = () => {
      if (down) {
        document.getElementById('points').innerText = points += 1;
      }
    }
  });

  document.getElementById("timer").innerHTML = time;
}

let timer = setInterval(() => {
  if (time === 0) {
    createCustomer()
  } else {
    document.getElementById("timer").innerHTML = --time;
  }
}, 1000);

createCustomer();
