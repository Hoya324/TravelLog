const passport = require("passport");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email", // 이메일
        passwordField: "password", // 비밀번호
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({
            where: {
              email,
              provider: "local",
            },
          });
          if (exUser) {
            // 이메일 확인
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              // 비밀번호 확인
              done(null, exUser);
            } else {
              done(null, false);
            }
          } else {
            done(null, false);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
