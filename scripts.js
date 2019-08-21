var mouseIsDown = 0;
var points = 0;
var time;

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

  for (let i = 0; i < 156; ++i) {
    let spot = document.createElement('div');
    spot.className = "spot";
    spot.onmouseover = () => {
      if (mouseIsDown) {
        spot.classList.add('scratched');

        let scratched = document.querySelectorAll('.scratched');

        if (scratched.length >= 10) {
          document.getElementById('points').innerText = Math.floor(++points);
          scratched.forEach(spotScratched => {
            spotScratched.classList.remove('scratched')
          });
        }
      }
    }
    back.appendChild(spot);
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

setInterval(() => {
  if (time === 0) {
    nextCustomer();
  } else {
    document.getElementById("timer").innerHTML = --time;
  }
}, 1000);
