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
