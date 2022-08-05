const pieces = require("./pieces.js")
console.log("pieces:", JSON.stringify(pieces))
const fs = require("fs")

const cppPieces = []
for (let i = 0; i < 12; i++) {
  cppPieces[i] = []
  for (let j = 0; j < 8; j++) {
    cppPieces[i][j] = []
    for (let k = 0; k < 5; k++) {
      cppPieces[i][j][k] = [-1, -1]
    }
  }
}

const pieceLens = []
for (let i = 0; i < 12; i++) pieceLens.push(pieces[i][0].length)

console.log("piece lengths:", pieceLens.join())

for (let piece = 0; piece < 12; piece++) {
  for (let rot = 0; rot < 8; rot++) {
    if (pieces[piece].length <= rot) break
    for (let coord = 0; coord < 5; coord++) {
      if (pieces[piece][rot].length <= coord) break
      cppPieces[piece][rot][coord] = pieces[piece][rot][coord]
    }
  }
}

fs.writeFileSync(
  "cppPieces",
  JSON.stringify(cppPieces).replace(/\[/g, "{").replace(/\]/g, "}")
)
