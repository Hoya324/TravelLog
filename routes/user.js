const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("../passport/auth");

// 로그인
router.route("/login")
  .get(isNotLoggedIn, (req, res) => {
    res.render("login", { user: null });
  })
  .post(isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.send("<script>alert('이메일 또는 비밀번호가 일치하지 않습니다.');location.href='/user/login';</script>");
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect("/search");
      });
    })(req, res, next);
  });

// 카카오 로그인
router.get("/login/kakao", isNotLoggedIn, passport.authenticate("kakao"));
router.get("/login/kakao/cb", passport.authenticate("kakao", { failureRedirect: "/user/login" }), (req, res) => {
  res.redirect("/");
});

// 로그아웃
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect("/");
  });
});

// 회원가입
router.route("/signup")
  .get((req, res) => {
    res.render("signup", { user: null });
  })
  .post(isNotLoggedIn, async (req, res, next) => {
    const { email, password, nickname } = req.body;
    try {
      const hash = await bcrypt.hash(password, 12);
      await User.create({ email, password: hash, nickname });
      return res.send("<script>alert('회원가입이 완료되었습니다.');location.href='/user/login';</script>");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

// 내정보
router.route("/myinfo")
  .get((req, res) => {
    const user = req.user ? req.user : null;
    res.render("myinfo", { user });
  })
  .put(isLoggedIn, async (req, res) => {
    const { nickname, password } = req.body;
    try {
      if (password) {
        const hash = await bcrypt.hash(password, 12);
        await User.update({ password: hash }, { where: { id: req.user.id } });
      } else {
        await User.update({ nickname }, { where: { id: req.user.id } });
      }
      return res.send("<script>alert('이름이 수정되었습니다.');location.href='/user/myinfo';</script>");
    } catch (err) {
      console.log(err);
    }
  });

// 회원탈퇴
router.delete("/withdraw", isLoggedIn, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.dataValues.id } });
    return res.send("<script>alert('회원탈퇴가 완료되었습니다.');location.href='/';</script>");
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
