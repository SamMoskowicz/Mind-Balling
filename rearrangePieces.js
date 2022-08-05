const pieces = require("./madePieces.js")
console.log("madePieces:", JSON.stringify(pieces))
const fs = require("fs")
const colors = [
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

const rearrangedPieces = new Array(12).fill(0)
const rearrangedColors = new Array(12).fill(0)

const order = [8, 3, 11, 7, 6, 2, 1, 5, 0, 4, 10, 9]

for (let i = 0; i < 12; i++) {
  rearrangedPieces[i] = pieces[order[i]]
  rearrangedColors[i] = colors[order[i]]
}

const output = { colors: rearrangedColors, pieces: rearrangedPieces }

fs.writeFileSync("rearranged.js", JSON.stringify(output))
