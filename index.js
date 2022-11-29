const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const tileSize = 48
const offset = {
    x: -785,
    y: -650
}

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}


const movables = []

const mapImage = new Image()
mapImage.src = './img/mapd.png'

const playerImage = new Image()
playerImage.src = './img/playerDown.png'

class Boundary {
    static width = tileSize
    static height = tileSize

    constructor({ position, s }) {
        this.s = s
        this.position = position
        this.width = tileSize
        this.height = tileSize
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x + 1, this.position.y, this.width, this.height)
    }
}



class Sprite {
    constructor({ image, position, frames = { max: 1 } }) {
        this.position = position
        this.image = image
        this.frames = frames

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            this.coliderBox = {
                width: this.position.x + this.width
            }
        }

    }

    draw() {
        c.drawImage(
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height)
    }
}

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerImage,
    frames: {
        max: 4
    }

})

const boundaries = []

collisionsMap.forEach((row, rowIndex) => {
    row.forEach((symbol, symbolIndex) => {
        if (symbol === 1025) {
            boundaries.push(new Boundary({
                position: {
                    x: symbolIndex * Boundary.width + offset.x,
                    y: rowIndex * Boundary.height + offset.y
                }
            }))
        }
    })
})


const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: mapImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },

}

const vel = 3

const retangularCollision = (retangular1, retangular2) => {
    return (retangular1.position.x + retangular1.width >= retangular2.position.x
        && retangular1.position.x <= retangular2.position.x + retangular2.width
        && retangular1.position.y + retangular1.height >= retangular2.position.y
        && retangular1.position.y <= retangular2.position.y + retangular2.height
    )
}

const animate = () => {
    window.requestAnimationFrame(animate)

    background.draw()
    boundaries.forEach(x => x.draw())
    player.draw()

    let moving = true

    if (keys.w.pressed) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];

            if (retangularCollision(
                player,
                {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 2 
                    }
                }
            )) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => movable.position.y += 1 * vel)
    }

    if (keys.a.pressed) {

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];

            if (retangularCollision(
                player,
                {
                    ...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            )) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => movable.position.x += 1 * vel)
    }

    if (keys.s.pressed) {

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];

            if (retangularCollision(
                player,
                {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            )) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => movable.position.y -= 1 * vel)
    }

    if (keys.d.pressed) {

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];

            if (retangularCollision(
                player,
                {
                    ...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            )) {
                moving = false
                break
            }
        }
        if (moving)
            movables.forEach(movable => movable.position.x -= 1 * vel)
    }


}

movables.push(background)
boundaries.forEach(x => movables.push(x))

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = true
            break;
        case 'a':
            keys.a.pressed = true
            break;
        case 's':
            keys.s.pressed = true
            break;
        case 'd':
            keys.d.pressed = true
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
    }
})