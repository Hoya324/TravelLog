document.getElementById("find_form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = prompt("가입하신 이메일을 입력해주세요.");
  if (!email) {
    return;
  }
  try {
    await axios.post("/user/find/password", { email });
  } catch (err) {
    console.error(err);
  }
});
