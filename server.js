const express = require("express")
const app = express()
const morgan = require("morgan")
const PORT = 3000

app.use(morgan("dev"))

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"))
app.use(express.static(__dirname))

app.listen(PORT, () => console.log("serving on port:", PORT))
