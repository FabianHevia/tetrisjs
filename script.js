const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const $score = document.querySelector('span')

const BLOCK_SIZE = 25;
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 25;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

let score = 0

const board = Array.from({length: BOARD_HEIGHT}, () => Array(BOARD_WIDTH).fill(0));

const piece = {
    position: { x: 6, y: 1 },
    shape: [
        [1, 1],
        [1, 1]
    ]
};

const PIECES = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 0]
    ],
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ]
]

let dropCounter = 0
let lastTime = 0

function update(time = 0) {
    const deltaTime = time - lastTime
    lastTime = time

    dropCounter += deltaTime

    if(dropCounter > 500) {
        piece.position.y++
        dropCounter = 0

        if (checkCollision()) {
            piece.position.y --
            solidifyPiece()
            removeRows ()
        }
    }

    draw();
    window.requestAnimationFrame(update);
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = 'white';
                context.fillRect(x, y, 1, 1);
            }
        });
    });

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'red';
                context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
            }
        });
    });
    $score.innerText = score
}

function checkCollision() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] && (board[y + piece.position.y] && board[y + piece.position.y][x + piece.position.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function movePiece(dx, dy) {
    piece.position.x += dx;
    piece.position.y += dy;
    if (checkCollision()) {
        piece.position.x -= dx;
        piece.position.y -= dy;
        if (dy === 1) {
            solidifyPiece();
            removeRows ();
        }
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        movePiece(-1, 0);
    } else if (event.key === 'ArrowRight') {
        movePiece(1, 0);
    } else if (event.key === 'ArrowDown') {
        movePiece(0, 1);
    }  else if (event.key === 'ArrowUp') {
        rotatePiece(piece);
    }
});

function solidifyPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value == 1) {
                board[y + piece.position.y][x + piece.position.x] = 1
            }
        })
    })

    piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

    piece.position.x = Math.floor(BOARD_WIDTH / 2 - 1)
    piece.position.y = 1

    if (checkCollision()) {
        window.alert('Game Over')
        board.forEach((row) => row.fill(0))
    }
}

function rotatePiece(piece) {
    const originalPiece = JSON.parse(JSON.stringify(piece));
    const rotated = []

    for (let i = 0; i < piece.shape[0].length; i++) {
        const row = []

        for (let j = piece.shape.length - 1; j>= 0; j--) {
            row.push(piece.shape[j][i])
        }
        rotated.push(row)
    }
    piece.shape = rotated

    if (checkCollision()) {
        piece.shape = originalPiece.shape;
    }
}

function removeRows () {
    const rowsToRemove = []

    board.forEach((row, y) => {
        if (row.every(value => value == 1)) {
            rowsToRemove.push(y)
        }
    })

    rowsToRemove.forEach(y => {
        board.splice(y, 1)
        const newRow = Array(BOARD_WIDTH).fill(0)
        board.unshift(newRow)
        score += 1
    })
}



update();
