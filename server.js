const express=require("express")
const dotenv = require("dotenv");
const cookieParser=require("cookie-parser");
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const connectDB=require("./config/db")
const errorHandler= require("./middleware/error")

dotenv.config({
    path: "./config/config.env",
  });

require("colors")

// Connect DB
connectDB()  


// Routes
const users = require("./routes/users");
const posts = require("./routes/posts");


const app=express()

//Body Parser
app.use(express.json());

// cookie-parser
app.use(cookieParser())

app.use(fileupload());


// dev logging middleware
if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
  }
  

// Routing Paths
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(
  PORT,
  console.log(
    `Server Running in ${process.env.NODE_ENV} mode on PORT ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close Server and exit process
  server.close(() => process.exit(1));
});