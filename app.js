const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const index_router = require("./routes/index");
const user_router = require("./routes/user");
const record_router = require("./routes/record");
const list_router = require("./routes/list");
dotenv.config();
const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();

// 기본 설정
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// sequelize 설정
sequelize
  .sync({
    force: false,
  })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
passportConfig();

// 미들웨어 설정
app.get("/favicon.ico", (req, res) => res.status(204)); // favicon 요청 무시
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  // 세션 설정
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", index_router);
app.use("/user", user_router);
app.use("/record", record_router);
app.use("/user/list", list_router);

// 404 에러
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 나머지 에러
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500);
  res.send("error");
});

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
