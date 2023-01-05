const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/RedKing/Idle.png',
    framesMax: 6,
    scale: 1.8,
    offset: {
        x: 60,
        y: 58
    }, 
    sprites: {
        idle: {
            imageSrc: './img/RedKing/Idle.png',
            framesMax: 6
        },
        run: {
            imageSrc: './img/RedKing/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/RedKing/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/RedKing/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/RedKing/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/RedKing/Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/RedKing/Death.png',
            framesMax: 11
        }
    },
    attackBox: {
        offset: {
            x: -10,
            y: 30
        },
        width: 95,
        height: 100
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }, 
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    imageSrc: './img/BlueKing/Idle.png',
    framesMax: 8,
    scale: 2.7,
    offset: {
        x: 60,
        y: 134
    }, 
    sprites: {
        idle: {
            imageSrc: './img/BlueKing/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/BlueKing/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/BlueKing/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/BlueKing/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/BlueKing/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/BlueKing/Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/BlueKing/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: -75,
            y: 30
        },
        width: 90,
        height: 70
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
      } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
      } else {
        player.switchSprite('idle')
      }

    // player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect a hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 1

    ) {
        enemy.takeHit()
        player.isAttacking = false

        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 1) {
        player.isAttacking = false
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2

    ) {
        player.takeHit()
        enemy.isAttacking = false

        //document.querySelector('#playerHealth').style.width = player.health + '%'

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    if (enemy.health <= 0 || player.health <=0) {
        determineWinner({ player, enemy, timerId })
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
    console.log(event.key)
})


window.addEventListener('keyup', (event) => {
    //player keys
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})