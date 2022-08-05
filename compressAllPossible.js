const fs = require("fs")
const allPossible = require("./allPossible2.js")

const compressed = []
for (const pos of allPossible) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      compressed.push(pos[r][c])
    }
  }
}

fs.writeFileSync(
  "compressedAllPossible.js",
  "module.exports = new Uint8Array(" + JSON.stringify(compressed) + ")"
)
