const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new kakaoStrategy(
      {
        clientID: process.env.KAKAO_AppKey,
        callbackURL: "/user/login/kakao/cb",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile", profile);

          const kakaoUser = await User.findOne({
            where: {
              provider: "kakao",
              email: profile._json.kakao_account.email,
            },
          });
          if (kakaoUser) {
            // 기존 회원일 경우
            done(null, kakaoUser);
          } else {
            // 새로운 회원일 경우
            const newUser = await User.create({
              nickname: profile.username,
              provider: "kakao",
              email: profile._json.kakao_account.email,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
