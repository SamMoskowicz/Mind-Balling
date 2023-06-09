// const pieces = require("./pieces")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const rotatePiecesButton = document.getElementById("rotate-pieces")
const solveButton = document.getElementById("solve-button")
const newGameButton = document.getElementById("new-game-button")
const shapeInput = document.getElementById("shape")

let shape = shapeInput.value

let board = new Array(10)
for (let i = 0; i < board.length; i++) board[i] = new Array(11).fill(null)

// const pieceColors = [
//   "white",
//   "hotPink",
//   "yellow",
//   "blue",
//   "green",
//   "yellow",
//   "blue",
//   "white",
//   "red",
//   "green",
//   "red",
//   "hotPink",
// ]
const pieceColors = [
  "#fd9722",
  "#db1a1b",
  "#107faa",
  "#fdd6d1",
  "#008746",
  "#fefefe",
  "#cae6f5",
  "#f07aad",
  "#fff018",
  "#9e0a71",
  "#b6d75b",
  "#bdbdbf",
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
  if (shape === "rectangle") {
    for (let coords of pieces[piece][rotation]) {
      const currRow = coords[0] + row
      const currCol = coords[1] + col
      if (currRow < 0 || currRow >= 5 || currCol < 0 || currCol >= 11)
        return false
      if (board[currRow][currCol] != null) return false
    }
  } else {
    for (let coords of pieces[piece][rotation]) {
      const currRow = coords[0] + row
      const currCol = coords[1] + col
      if (currRow < 0 || currCol < 0 || currRow + currCol > 9) return false
      if (board[currRow][currCol] != null) return false
    }
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

// function getBestPos() {
//   const visited = []
//   let best = 100
//   let res = [10, 10]
//   for (let i = 0; i < 9; i++) visited[i] = new Array(9).fill(false)
//   for (let r = 0; r < 9; r++) {
//     for (let c = 0; c + r < 9; c++) {
//       if (board[r][c] !== null) continue
//       if (visited[r][c]) continue
//       let curr = 0
//       outer: while (curr + r <= 9 && curr + c <= 9) {
//         // console.log("curr:", curr)
//         for (let currRow = r; currRow <= r + curr; currRow++) {
//           const currCol = c + curr
//           if (currRow + currCol > 9) break outer
//           if (board[currRow][currCol] !== null) break outer
//         }
//         for (let currCol = c; currCol < c + curr; currCol++) {
//           const currRow = r + curr
//           if (currRow + currCol > 9) break outer
//           if (board[currRow][currCol] !== null) break outer
//         }
//         for (let currRow = r; currRow <= r + curr; currRow++) {
//           const currCol = c + curr
//           visited[currRow][currCol] = true
//         }
//         for (let currCol = c; currCol < c + curr; currCol++) {
//           const currRow = r + curr
//           visited[currRow][currCol] = true
//         }
//         curr++
//       }
//       // console.log("r:", r, "c:", c, "curr:", curr)
//       if (curr < best) {
//         best = curr
//         res = [r, c]
//       }
//     }
//   }
//   return res
// }

// let cnt = 0
// const backtrack = []
// const startTime = Date.now()
// function countWays() {
//   if (remainingPieces <= 0) {
//     console.log("curr count", ++cnt)
//     console.log("time since start:", (Date.now() - startTime) / 1000)
//     console.log("backtrack:", backtrack)
//     console.log(
//       "average ways per second:",
//       (cnt / (Date.now() - startTime)) * 1000
//     )
//     // console.log("piece positions:", piecePositions)
//     // console.log("board:", board)
//   }
//   if (!remainingPieces) return 1
//   const [row, col] = getBestPos()
//   // console.log("row:", row, "col:", col)
//   let res = 0
//   for (let piece = 0; piece < 12; piece++) {
//     if (piecePositions[piece]) continue
//     for (let rotation = 0; rotation < pieces[piece].length; rotation++) {
//       for (let coords = 0; coords < pieces[piece][rotation].length; coords++) {
//         if (remainingPieces === 12) {
//           const pieceCount = 12
//           const rotationCount = pieces[piece].length * pieceCount
//           const coordsCount = pieces[piece][rotation].length * rotationCount
//           console.log(
//             (piece / pieceCount) * 100 +
//               (rotation / rotationCount) * 100 +
//               (coords / coordsCount) * 100
//           )
//         }
//         const currRow = row - pieces[piece][rotation][coords][0]
//         const currCol = col - pieces[piece][rotation][coords][1]
//         if (!canAddPiece(piece, rotation, currRow, currCol)) continue
//         backtrack[12 - remainingPieces] = [piece, rotation, coords]
//         addPiece(piece, rotation, currRow, currCol)
//         res += countWays()
//         removePiece(piece, rotation, currRow, currCol)
//       }
//     }
//   }
//   return res
// }

// console.log(countWays())

// function solve() {
//   function dfs(piece) {
//     if (piece === 12) return true
//     if (constPieces[piece]) {
//       if (dfs(piece + 1)) return true
//       return false
//     }
//     for (let rotation = 0; rotation < pieces[piece].length; rotation++) {
//       for (let row = 0; row < 10; row++) {
//         for (let col = 0; row + col < 10; col++) {
//           if (canAddPiece(piece, rotation, row, col)) {
//             addPiece(piece, rotation, row, col)
//             if (dfs(piece + 1)) return true
//             removePiece(piece)
//           }
//         }
//       }
//     }
//     return false
//   }
//   return dfs(0)
// }

function findAllMatches() {
  const res = []
  if (shape === "rectangle") {
    for (let i = 0; i < allPossible2.length; i += 55) {
      let j = i
      for (; j < i + 55; j++) {
        const r = Math.floor((j - i) / 11)
        const c = (j - i) % 11
        if (board[r][c] === null || board[r][c] === -1) continue
        if (board[r][c] !== allPossible2[j]) break
      }
      if (j === i + 55) res.push(i)
    }
  } else {
    for (let i = 0; i < allPossible.length; i += 100) {
      let j = i
      for (; j < i + 100; j++) {
        const r = Math.floor((j - i) / 10)
        const c = j % 10
        if (r + c >= 10) continue
        if (board[r][c] === null || board[r][c] === -1) continue
        // console.log("r:", r, "c:", c)
        if (board[r][c] !== allPossible[j]) break
      }
      if (j === i + 100) res.push(i)
    }
  }
  return res
}

function clear() {
  for (let piece of piecePositions) if (piece) removePiece(piece)
  constPieces.fill(false)
}

const boardSettings = {}

const pieceSettings = {}

function initSettings(size) {
  pieceSettings.radius = size / 100
  pieceSettings.space = pieceSettings.radius * Math.sqrt(2.5) * Math.sqrt(2)
  canvas.width = size
  canvas.height = size / 2
  boardSettings.size = canvas.height
}

initSettings(900)

ctx.fillRect(0, 0, boardSettings.width, boardSettings.height)

function drawPiece(piece, rotation, x, y) {
  if (shape === "rectangle") {
    const sqrt2 = Math.sqrt(2)
    ctx.fillStyle = pieceColors[piece]
    ctx.strokeStyle = pieceColors[piece]
    const visited = new Set()
    for (let coords of pieces[piece][rotation]) {
      ctx.beginPath()
      ctx.arc(
        x + coords[1] * pieceSettings.space,
        y + coords[0] * pieceSettings.space,
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
            x + coords[1] * pieceSettings.space,
            y + coords[0] * pieceSettings.space
          )
          ctx.lineTo(
            x + currX * pieceSettings.space,
            y + currY * pieceSettings.space
          )
          ctx.lineWidth = pieceSettings.radius / 2
          ctx.stroke()
          ctx.closePath()
        }
      }
      visited.add(coords.join())
    }
  } else {
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
}

function drawBoard() {
  if (shape === "rectangle") {
    ctx.fillStyle = "gray"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "black"
    const boardX = boardSettings.size / 2 - pieceSettings.space * 6
    const boardY = boardSettings.size / 2 - pieceSettings.space * 3
    ctx.fillRect(
      boardX,
      boardY,
      pieceSettings.space * 12,
      pieceSettings.space * 6
    )
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 11; j++) {
        ctx.fillStyle = "gray"
        ctx.beginPath()
        ctx.arc(
          boardX + (j + 1) * pieceSettings.space,
          boardY + (i + 1) * pieceSettings.space,
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
  } else {
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
  if (shape === "rectangle") {
    if (y < boardSettings.size / 2 - pieceSettings.space * 2.5) return false
    if (y > boardSettings.size / 2 + pieceSettings.space * 2.5) return false
    if (x < boardSettings.size / 2 - pieceSettings.space * 5.5) return false
    if (x > boardSettings.size / 2 + pieceSettings.space * 5.5) return false
    console.log("is in board")
    return true
  }
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
  if (shape === "rectangle") {
    const xStart = boardSettings.size / 2 - pieceSettings.space * 5.5
    const yStart = boardSettings.size / 2 - pieceSettings.space * 2.5
    const row = Math.floor((y - yStart) / pieceSettings.space)
    const col = Math.floor((x - xStart) / pieceSettings.space)
    console.log({ row, col })
    return [row, col]
  } else {
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
    console.log({ row, col })
    return [row, col]
  }
}

function getBoardCoords(row, col) {
  if (shape === "rectangle") {
    const x =
      boardSettings.size / 2 -
      pieceSettings.space * 5 +
      col * pieceSettings.space
    const y =
      boardSettings.size / 2 -
      pieceSettings.space * 2 +
      row * pieceSettings.space
    return [x, y]
  } else {
    const x = boardSettings.size / 2 + (col - row) * pieceSettings.space
    const y =
      boardSettings.size / 2 +
      2 * pieceSettings.space +
      (row + col) * pieceSettings.space
    return [x, y]
  }
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
    if (piece == null) return
    const [rotation, pieceRow, pieceCol] = piecePositions[piece]
    selectedPiece.piece = piece
    selectedPiece.rotation = rotation
    const [pieceX, pieceY] = getBoardCoords(pieceRow, pieceCol)
    const xDiff = x - pieceX,
      yDiff = y - pieceY
    selectedPiece.xDiff = xDiff
    selectedPiece.yDiff = yDiff
    selectedPiece.fromBoard = true
    const origin = piecePositions[piece]
    removeConstPiece(selectedPiece.piece)
    piecePositions[piece] = null
    canvas.addEventListener("mousemove", drawSelectedPiece)
    canvas.addEventListener(
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

function findRotation(board, row, col) {
  if (shape === "rectangle") {
    const piece = board[row][col]
    for (let rot = 0; rot < pieces[piece].length; rot++) {
      let i = 0
      for (; i < pieces[piece][rot].length; i++) {
        const r = row + pieces[piece][rot][i][0]
        const c = col + pieces[piece][rot][i][1]
        if (r < 0 || c < 0 || r >= 5 || c >= 11) break
        if (board[r][c] !== board[row][col]) break
      }
      if (i === pieces[piece][rot].length) return rot
    }
    return -1
  } else {
    const piece = board[row][col]
    for (let rot = 0; rot < pieces[piece].length; rot++) {
      let i = 0
      for (; i < pieces[piece][rot].length; i++) {
        const r = row + pieces[piece][rot][i][0]
        const c = col + pieces[piece][rot][i][1]
        if (r < 0 || c < 0 || r + c >= 10) break
        if (board[r][c] !== board[row][col]) break
      }
      if (i === pieces[piece][rot].length) return rot
    }
    return -1
  }
}

function makeBoardFromPossible(i) {
  if (shape === "rectangle") {
    const res = []
    for (let r = 0; r < 5; r++) {
      res.push([])
      for (let c = 0; c < 11; c++) {
        res[r].push(allPossible2[i + r * 11 + c])
      }
    }
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 11; c++) {
        if (!piecePositions[res[r][c]]) {
          const rotation = findRotation(res, r, c)
          if (rotation > -1) piecePositions[res[r][c]] = [rotation, r, c]
        }
      }
    }
    return res
  } else {
    const res = []
    for (let r = 0; r < 10; r++) {
      res.push([])
      for (let c = 0; c < 10; c++) {
        res[r][c] = allPossible[i + r * 10 + c]
      }
    }
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (r + c >= 10) continue
        if (!piecePositions[res[r][c]]) {
          const rotation = findRotation(res, r, c)
          if (rotation > -1) piecePositions[res[r][c]] = [rotation, r, c]
        }
      }
    }
    return res
  }
}

function shuffle(arr) {
  for (let i = 1; i < arr.length; i++) {
    const rand = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[rand]
    arr[rand] = temp
  }
}

solveButton.addEventListener("click", () => {
  // console.log("Solving...")
  // const solved = solve()
  // console.log("solved?", solved)
  const matches = findAllMatches()
  shuffle(matches)
  if (!matches.length) {
    ctx.textAlign = "center"
    drawBoard()
    drawUnusedPieces()
    for (let i = 0; i < 12; i++) {
      if (!constPieces[i]) {
        if (piecePositions[i]) removePiece(i)
        unusedPieces[i] = 0
      }
    }
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.font = "30px Arial"
    ctx.fillText("Not Solvable!", canvas.width / 4, canvas.height / 5)
  } else {
    unusedPieces.fill(null)
    board = makeBoardFromPossible(matches[0])
    drawBoard()
    drawUnusedPieces()
  }
})

newGameButton.addEventListener("click", () => {
  for (let row of board) for (let i = 0; i < row.length; i++) row[i] = null
  for (let i = 0; i < 12; i++) {
    piecePositions[i] = null
    unusedPieces[i] = 0
    constPieces[i] = null
  }
  drawBoard()
  drawUnusedPieces()
})

shapeInput.addEventListener("change", (e) => {
  shape = shapeInput.value
  if (shape === "triangle") {
    pieceSettings.space /= Math.sqrt(2)
    board = new Array(10)
    for (let i = 0; i < 10; i++) board[i] = new Array(10).fill(null)
  } else {
    pieceSettings.space *= Math.sqrt(2)
    board = new Array(5)
    for (let i = 0; i < 5; i++) board[i] = new Array(11).fill(null)
  }
  console.log(e)
  console.log(shape)
  drawBoard()
  drawUnusedPieces()
})
