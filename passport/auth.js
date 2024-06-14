// 로그인이 되었는지 판별
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(403)
      .send(
        "<script>alert('로그인이 필요합니다.');location.href='/user/login'</script>"
      ); // 로그인 페이지로 이동
  }
};

// 로그인 안 했는지 판별
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res
      .status(403)
      .send(
        "<script>alert('이미 로그인한 상태입니다.');history.back();</script>"
      ); // 이전 페이지로 이동
  }
};
