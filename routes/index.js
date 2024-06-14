const router = require("express").Router();
const sequelize = require("sequelize");
const { User, List, Travel } = require("../models");

router.get("/", async (req, res, next) => {
  try {
    const user = req.user ? req.user : null; // 회원 정보
    res.render("search", {
      jsAppKey: process.env.jsAppKey,
      user: user,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const user = req.user ? req.user : null; // 회원 정보

    // 가입 시기
    if (user) {
      const createdAtDate = new Date(user.createdAt);
      
      const formattedCreatedAt = createdAtDate.toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      console.log(formattedCreatedAt + "에 가입");
    }
    res.render("search", {
      jsAppKey: process.env.jsAppKey,
      user: user,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
