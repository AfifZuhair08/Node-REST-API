// SERVER CORE //
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

dotenv.config();

// DB CONNECT //
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true},()=>{
    console.log("🧲 MongoDB successfully connected");
});

// PACKAGE USE
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// ROUTES //
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

// LISTENER
app.listen(3000, ()=>{
    console.log("🚀 Backend server is running on port 3000");
})
