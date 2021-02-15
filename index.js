// const pieces = require("./pieces")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const rotatePiecesButton = document.getElementById("rotate-pieces")
const solveButton = document.getElementById("solve-button")

let board = new Array(10)
for (let i = 0; i < board.length; i++) board[i] = new Array(10).fill(null)

const pieceColors = [
  "white",
  "hotPink",
  "yellow",
  "blue",
  "green",
  "yellow",
  "blue",
  "white",
  "red",
  "green",
  "red",
  "hotPink",
]
const piecePositions = new Array(12).fill(null)
let remainingPieces = 12
const constPieces = new Array(12).fill(false)

function addPiece(piece, rotation, row, col) {
  piecePositions[piece] = [rotation, row, col]
  for (let coords of pieces[piece][rotation])
    board[row + coords[0]][col + coords[1]] = piece
  remainingPieces--
}

function canAddPiece(piece, rotation, row, col) {
  for (let coords of pieces[piece][rotation]) {
    const currRow = coords[0] + row
    const currCol = coords[1] + col
    if (currRow < 0 || currCol < 0 || currRow + currCol > 9) return false
    if (board[currRow][currCol] != null) return false
  }
  return true
}

function addConstPiece(piece, rotation, row, col) {
  constPieces[piece] = true
  addPiece(piece, rotation, row, col)
}

function removePiece(piece) {
  const [rotation, row, col] = piecePositions[piece]
  for (let coords of pieces[piece][rotation])
    board[coords[0] + row][coords[1] + col] = null
  remainingPieces++
  piecePositions[piece] = null
}

function removeConstPiece(piece) {
  constPieces[piece] = false
  removePiece(piece)
}

function solve() {
  function dfs(piece) {
    if (piece === 12) return true
    if (constPieces[piece]) {
      if (dfs(piece + 1)) return true
      return false
    }
    for (let rotation = 0; rotation < pieces[piece].length; rotation++) {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; row + col < 10; col++) {
          if (canAddPiece(piece, rotation, row, col)) {
            addPiece(piece, rotation, row, col)
            if (dfs(piece + 1)) return true
            removePiece(piece)
          }
        }
      }
    }
    return false
  }
  return dfs(0)
}

function clear() {
  for (let piece of piecePositions) if (piece) removePiece(piece)
  constPieces.fill(false)
}

const boardSettings = {}

const pieceSettings = {}

function initSettings(size) {
  pieceSettings.radius = size / 100
  pieceSettings.space = pieceSettings.radius * Math.sqrt(2.5)
  canvas.width = size
  canvas.height = size / 2
  boardSettings.size = canvas.height
}

initSettings(900)

ctx.fillRect(0, 0, boardSettings.width, boardSettings.height)

function drawPiece(piece, rotation, x, y) {
  ctx.fillStyle = pieceColors[piece]
  ctx.strokeStyle = pieceColors[piece]
  const visited = new Set()
  for (let coords of pieces[piece][rotation]) {
    ctx.beginPath()
    ctx.arc(
      x + (coords[1] - coords[0]) * pieceSettings.space,
      y + (coords[1] + coords[0]) * pieceSettings.space,
      pieceSettings.radius,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.closePath()
    const neighbors = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    for (let nbr of neighbors) {
      const currY = nbr[0] + coords[0]
      const currX = nbr[1] + coords[1]
      if (visited.has([currY, currX].join())) {
        ctx.beginPath()
        ctx.moveTo(
          x + (coords[1] - coords[0]) * pieceSettings.space,
          y + (coords[1] + coords[0]) * pieceSettings.space
        )
        ctx.lineTo(
          x + (currX - currY) * pieceSettings.space,
          y + (currY + currX) * pieceSettings.space
        )
        ctx.lineWidth = pieceSettings.radius / 2
        ctx.stroke()
        ctx.closePath()
      }
    }
    visited.add(coords.join())
  }
}

function drawBoard() {
  ctx.fillStyle = "gray"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "black"
  ctx.beginPath()
  ctx.moveTo(boardSettings.size / 2, 0.5 * boardSettings.size)
  ctx.lineTo(
    boardSettings.size - 3.5 * pieceSettings.space,
    boardSettings.size - 3.5 * pieceSettings.space
  )
  ctx.lineTo(
    3.5 * pieceSettings.space,
    boardSettings.size - 3.5 * pieceSettings.space
  )
  ctx.lineTo(boardSettings.size / 2, 0.5 * boardSettings.size)
  ctx.closePath()
  ctx.fill()
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (j + i > 9) break
      ctx.fillStyle = "gray"
      ctx.beginPath()
      ctx.arc(
        boardSettings.size / 2 + (j - i) * pieceSettings.space,
        boardSettings.size / 2 +
          2 * pieceSettings.space +
          (i + j) * pieceSettings.space,
        pieceSettings.radius,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.closePath()
    }
  }
  for (let i = 0; i < 12; i++) {
    if (piecePositions[i] == null) continue
    const [rotation, row, col] = piecePositions[i]
    const [x, y] = getBoardCoords(row, col)
    drawPiece(i, rotation, x, y)
  }
}

const unusedPieces = new Array(12).fill(0)
function drawUnusedPieces() {
  ctx.fillStyle = "gray"
  ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (unusedPieces[i * 4 + j] == null) continue
      drawPiece(
        i * 4 + j,
        unusedPieces[i * 4 + j],
        canvas.width / 2 + (j * canvas.width) / 8 + canvas.width / 16,
        (i * canvas.height) / 3 + pieceSettings.radius * 5
      )
    }
  }
}

drawBoard()
drawUnusedPieces()

function isInBoard(x, y) {
  return (
    y < boardSettings.size - pieceSettings.space * 4 &&
    y > boardSettings.size / 2 + 1.5 * pieceSettings.space &&
    (x - boardSettings.size / 2 === 0 ||
      (y - boardSettings.size / 2 + 1.5 * pieceSettings.space) /
        Math.abs(x - boardSettings.size / 2) >
        1)
  )
}

function getBoardDimensions(x, y) {
  const row = Math.round(
    (y - boardSettings.size / 2 - pieceSettings.space * 2) /
      pieceSettings.space /
      2 -
      (x - boardSettings.size / 2) / pieceSettings.space / 2
  )
  const col = Math.round(
    (y - boardSettings.size / 2 - pieceSettings.space * 2) /
      pieceSettings.space /
      2 +
      (x - boardSettings.size / 2) / pieceSettings.space / 2
  )
  return [row, col]
}

function getBoardCoords(row, col) {
  const x = boardSettings.size / 2 + (col - row) * pieceSettings.space
  const y =
    boardSettings.size / 2 +
    2 * pieceSettings.space +
    (row + col) * pieceSettings.space
  return [x, y]
}

const mouseSettings = {}
let selectedPiece = {}
canvas.addEventListener("mousedown", (e) => {
  const { top, left } = canvas.getBoundingClientRect()
  const x = e.clientX - left,
    y = e.clientY - top
  if (e.clientX - left > boardSettings.size) {
    const col = Math.floor(
      (e.clientX - left - canvas.width / 2) / (canvas.width / 8)
    )
    const row = Math.floor(y / (canvas.height / 3))
    const xDiff = (e.clientX - left) % (canvas.width / 8)
    const yDiff = y % (canvas.height / 3)
    selectedPiece.piece = row * 4 + col
    selectedPiece.rotation = unusedPieces[selectedPiece.piece]
    selectedPiece.xDiff = xDiff
    selectedPiece.yDiff = yDiff
    unusedPieces[selectedPiece.piece] = null
    canvas.addEventListener("mousemove", drawSelectedPiece)
    canvas.addEventListener(
      "mouseup",
      (e) => {
        const x = e.clientX - left,
          y = e.clientY - top
        if (!isInBoard(x, y)) {
          unusedPieces[selectedPiece.piece] = selectedPiece.rotation
          selectedPiece = {}
          drawBoard()
          drawUnusedPieces()
          canvas.removeEventListener("mousemove", drawSelectedPiece)
          return
        }
        const pieceX = x - selectedPiece.xDiff + canvas.width / 16
        const pieceY = y - selectedPiece.yDiff + pieceSettings.radius * 5
        const [row, col] = getBoardDimensions(pieceX, pieceY)
        console.log({ row, col })
        console.log({ pieceX, pieceY })
        if (canAddPiece(selectedPiece.piece, selectedPiece.rotation, row, col))
          addConstPiece(selectedPiece.piece, selectedPiece.rotation, row, col)
        else unusedPieces[selectedPiece.piece] = selectedPiece.rotation
        selectedPiece = {}
        drawBoard()
        drawUnusedPieces()
        canvas.removeEventListener("mousemove", drawSelectedPiece)
      },
      { once: true }
    )
  } else if (isInBoard(x, y)) {
    const [row, col] = getBoardDimensions(x, y)
    const piece = board[row][col]
    const [rotation, pieceRow, pieceCol] = piecePositions[piece]
    selectedPiece.piece = piece
    selectedPiece.rotation = rotation
    const [pieceX, pieceY] = getBoardCoords(pieceRow, pieceCol)
    const xDiff = x - pieceX + pieceSettings.radius / 2,
      yDiff = y - pieceY + pieceSettings.radius / 2
    selectedPiece.xDiff = xDiff
    selectedPiece.yDiff = yDiff
    selectedPiece.fromBoard = true
    const origin = piecePositions[piece]
    removeConstPiece(selectedPiece.piece)
    piecePositions[piece] = null
    canvas.addEventListener("mousemove", drawSelectedPiece)
    addEventListener(
      "mouseup",
      (e) => {
        const x = e.clientX - left,
          y = e.clientY - top
        if (!isInBoard(x, y)) {
          unusedPieces[selectedPiece.piece] = selectedPiece.rotation
          drawBoard()
          drawUnusedPieces()
          selectedPiece = {}
          canvas.removeEventListener("mousemove", drawSelectedPiece)
          return
        }
        const [row, col] = getBoardDimensions(
          x - selectedPiece.xDiff,
          y - selectedPiece.yDiff
        )
        if (
          canAddPiece(selectedPiece.piece, selectedPiece.rotation, row, col)
        ) {
          addConstPiece(selectedPiece.piece, selectedPiece.rotation, row, col)
        } else addConstPiece(selectedPiece.piece, ...origin)
        drawBoard()
        drawUnusedPieces()
        selectedPiece = {}
        canvas.removeEventListener("mousemove", drawSelectedPiece)
      },
      { once: true }
    )
  }
})

function drawSelectedPiece(e) {
  if (!Object.keys(selectedPiece).length)
    return console.log("no selected piece")
  drawBoard()
  drawUnusedPieces()
  const { top, left } = canvas.getBoundingClientRect()
  drawPiece(
    selectedPiece.piece,
    selectedPiece.rotation,
    e.clientX -
      left -
      selectedPiece.xDiff +
      (selectedPiece.fromBoard ? 0 : canvas.width / 16),
    e.clientY -
      top -
      selectedPiece.yDiff +
      (selectedPiece.fromBoard ? 0 : pieceSettings.radius * 5)
  )
}

// addEventListener("mouseup", (e) => {
//   unusedPieces[selectedPiece.piece] = selectedPiece.rotation
//   selectedPiece = {}
//   drawBoard()
//   drawUnusedPieces()
//   canvas.removeEventListener("mousemove", drawSelectedPiece)
// })

rotatePiecesButton.addEventListener("click", () => {
  for (let i = 0; i < 12; i++) {
    if (unusedPieces[i] == null) continue
    unusedPieces[i] = (unusedPieces[i] + 1) % pieces[i].length
  }
  drawUnusedPieces()
})

solveButton.addEventListener("click", () => {
  ctx.texAlign = "center"
  ctx.fillText("Not Solvable!", canvas.height / 5, canvas.width / 2)
  const solved = solve()
  console.log({ solved })
  if (!solved) return
  unusedPieces.fill(null)
  drawBoard()
  drawUnusedPieces()
})
