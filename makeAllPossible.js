const fs = require("fs")
const allPossible = JSON.parse(
  fs
    .readFileSync("./utility_functions/cpp/res")
    .toString()
    .replace(/\{/g, "[")
    .replace(/\}/g, "]")
)

const mp = [11, 7, 3, 4, 8, 2, 1, 6, 0, 9, 5, 10]

const compressed = []

for (let i = 0; i < allPossible.length; i++) {
  compressed.push(" ")
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (allPossible[i][r][c] === -1) compressed.push(-1)
      else compressed.push(mp[allPossible[i][r][c]])
      if (i === allPossible.length - 1 && r === 4 && c === 10) continue
      compressed.push(",")
    }
  }
  compressed.push("\n")
}

fs.writeFileSync(
  "allPossible.js",
  "const allPossible = new Int8Array([\n" + compressed.join("") + "])\n"
)
