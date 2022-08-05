const fs = require("fs")

const pieces = [
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 0],
    [2, 1],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 0],
    [2, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [3, 1],
  ],
  [
    [0, 0],
    [1, -1],
    [1, 0],
    [1, 1],
    [2, 0],
  ],
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 0],
    [3, 0],
  ],
]

function flipX(coords) {
  let maxX = 0
  for (let i = 0; coords[i] && !coords[i][0]; i++)
    maxX = Math.max(maxX, coords[i][1])
  for (let i = 0; i < coords.length; i++) coords[i][1] = -coords[i][1] + maxX
  coords.sort((a, b) => {
    if (a[0] < b[0]) return -1
    if (a[0] > b[0]) return 1
    return a[1] - b[1]
  })
}

function flipY(coords) {
  let maxY = coords[coords.length - 1][0],
    minX = Infinity
  for (let i = coords.length - 1; coords[i] && coords[i][0] === maxY; i--)
    minX = Math.min(minX, coords[i][1])
  for (let i = 0; i < coords.length; i++) {
    coords[i][0] = maxY - coords[i][0]
    coords[i][1] -= minX
  }
  coords.sort((a, b) => {
    if (a[0] < b[0]) return -1
    if (a[0] > b[0]) return 1
    return a[1] - b[1]
  })
}

function rotate(coords) {
  let startX = 0,
    startY = 0
  for (let coord of coords) {
    if (coord[1] < startX) {
      startX = coord[1]
      startY = coord[0]
    }
    if (coord[1] === startX) startY = Math.max(startY, coord[0])
  }
  for (let coord of coords) {
    const currY = coord[0]
    coord[0] = coord[1] - startX
    coord[1] = startY - currY
  }
  coords.sort((a, b) => {
    if (a[0] < b[0]) return -1
    if (a[0] > b[0]) return 1
    return a[1] - b[1]
  })
  return coords
}

function getAllRotations(coords) {
  const rotations = new Set()
  rotations.add(JSON.stringify(coords))
  rotate(coords)
  rotations.add(JSON.stringify(coords))
  rotate(coords)
  rotations.add(JSON.stringify(coords))
  rotate(coords)
  rotations.add(JSON.stringify(coords))
  flipX(coords)
  rotations.add(JSON.stringify(coords))
  rotate(coords)
  rotations.add(JSON.stringify(coords))
  rotate(coords)
  rotations.add(JSON.stringify(coords))
  rotate(coords)
  rotations.add(JSON.stringify(coords))

  return [...rotations].map((r) => JSON.parse(r))
}

const allPieces = []
for (let piece of pieces) {
  allPieces.push(getAllRotations(piece))
}

// console.log("first piece:", allPieces[0][0])

// // console.log("pieces:", JSON.stringify(allPieces))

// allPieces.sort((a, b) => b[0].length - a[0].length)

// console.log("pieces after sorting:", JSON.stringify(allPieces))

fs.writeFile(
  __dirname + "/madePieces.js",
  "module.export = " + JSON.stringify(allPieces),
  (err) => {
    if (err) console.log("Error Occurred:", err)
    else console.log("successfully wrote to file")
  }
)
