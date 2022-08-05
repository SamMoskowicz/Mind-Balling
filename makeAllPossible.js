const fs = require("fs")
const allPossible = JSON.parse(
  fs
    .readFileSync("./utility_functions/cpp/res")
    .toString()
    .replace(/\{/g, "[")
    .replace(/\}/g, "]")
)

const compressed = []

for (let i = 0; i < allPossible.length; i++) {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      compressed.push(allPossible[i][r][c])
    }
  }
}

fs.writeFileSync(
  "allPossible.js",
  "const allPossible = new Int8Array(" + JSON.stringify(compressed) + ")"
)
