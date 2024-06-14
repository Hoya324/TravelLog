function removeTravel(id) {
  // delete 요청 보내기
  try {
    axios
      .delete("/user/list/" + id)
      .then((res) => {
        alert("여행지가 삭제되었습니다.");
        location.href = "/user/list";
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
}

function editName() {
  var newName = prompt("새 이름을 입력하세요");
  if (newName) {
    axios
      .put("/user/myinfo", { nickname: newName })
      .then(function (response) {
        alert("이름 업데이트에 성공했습니다.");
        location.href = "myinfo";
        return;
      })
      .catch(function (error) {
        console.error(error);
        alert("이름 업데이트에 실패했습니다.");
        return;
      });
  }
}

function editPassword() {
  var newPassword = prompt("새 비밀번호를 입력하세요");
  while (newPassword && newPassword.length < 8) {
    newPassword = prompt("비밀번호는 8자 이상이어야 합니다. 다시 입력하세요");
  }

  if (newPassword) {
    axios
      .put("/user/myinfo", { password: newPassword })
      .then(function (response) {
        alert("비밀번호 변경에 성공했습니다.");
        location.href = "myinfo";
        return;
      })
      .catch(function (error) {
        console.error(error);
        alert("비밀번호 변경에 실패했습니다.");
        return;
      });
  }
}

function withdraw() {
  axios.delete("/user/withdraw");
  alert("회원탈퇴가 완료되었습니다.");
  location.href = "/";
  return;
}
