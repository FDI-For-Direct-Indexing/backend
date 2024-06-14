var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var errorHandler = require("./common/error/ErrorHandler");
var indexRouter = require("./routes/index");
var stocksRouter = require("./routes/stocks");
const clusterRouter = require("./routes/cluster");
const corporateRouter = require("./routes/corporates");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

require("dotenv").config();

const { MONGO_URI, CLIENT_URL } = process.env;

const whitelist = ["http://localhost:3000", CLIENT_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not Allowed Origin!`));
    }
  },
};

const mongoose = require("mongoose");
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "MonkeyRanking",
  })
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((e) => console.log(e));

var app = express();
app.use(cors(corsOptions));
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "몽키랭키 API",
      version: "1.0.0",
      description: "오공의 몽키랭키 API 문서입니다.",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  apis: ["./models/*.js", "./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api", indexRouter);
app.use("/api/stocks", stocksRouter);
app.use("/api/cluster", clusterRouter);
app.use("/api/corporates", corporateRouter);
app.use(errorHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error message as JSON
  res.status(err.status || 500).json({
    error: err.message,
  });
});

module.exports = app;
