const express = require("express")
const app = express()
const PORT = 5000
const db = require("./db")
const cors = require("cors")
const cookieparser = require("cookie-parser")
app.get("/", (req, res)=>{
    res.json("hello this is coupan distribution")
})
app.use(cors({
    origin: "http://localhost:3000", // Replace with frontend URL
    credentials: true,
  }));

app.use(express.json());
app.use(cookieparser());
app.use("/api", require("./routes/adminRoutes"))


app.listen(PORT, (req, res)=>{
    console.log(`App listening on port ${PORT}`)
})