$(document).ready(function () {
  const pw = $("#password");
  const pwCheck = $("#pw_check");
  const button = $("#signup_button");

  const check = () => {
    if (pw.val() != "" && pwCheck.val() != "") {
      if (pw.val() == pwCheck.val() && pw.val().length >= 8) {
        $("#check_text").text("").css("color", "mediumblue");
        button.prop("disabled", false);
      } else if (pw.val().length < 8) {
        $("#check_text")
          .text("비밀번호는 8자리 이상 입력해주세요.")
          .css("color", "red");
        button.prop("disabled", true);
      } else {
        $("#check_text")
          .text("비밀번호가 일치하지 않습니다")
          .css("color", "red");
        button.prop("disabled", true);
      }
    } else {
      $("#check_text").text("비밀번호가 일치하지 않습니다").css("color", "red");
    }
  };

  pw.keyup(check);
  pwCheck.keyup(check);
});
