const express = require("express")
const app = express()
const PORT = 5000
const db = require("./db")
const cors = require("cors")
const cookieparser = require("cookie-parser")
app.get("/", (req, res)=>{
    res.json("hello this is coupan distribution")
})
const allowedOrigins = [
  "http://localhost:3000",  // Local development
  "https://frontend-coupondist.onrender.com"  // Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieparser());
app.use("/api", require("./routes/adminRoutes"))


app.listen(PORT, (req, res)=>{
    console.log(`App listening on port ${PORT}`)
})
