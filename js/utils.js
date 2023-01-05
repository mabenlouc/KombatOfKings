function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
  }

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayResult').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayResult').innerHTML = 'Tie'
    }else if (player.health > enemy.health) {
        document.querySelector('#displayResult').innerHTML = 'King Arthur wins'
    }else if (player.health < enemy.health) {
        document.querySelector('#displayResult').innerHTML = 'King Charles wins'
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
        
    }
}

//new game button functionality
function refreshPage(){
  window.location.reload();
} 

//preventing page from scrolling when controlling King Charles
window.addEventListener("keydown", function(e) {
  if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
  }
}, false);