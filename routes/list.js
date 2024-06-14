const router = require("express").Router();
const { isLoggedIn } = require("./auth");
const { List, Travel } = require("../models");

// 여행지 리스트 페이지
router.get("/", isLoggedIn, async (req, res) => {
	const user = req.user ? req.user : null;
	try {
		const UserId = req.user.id;
		const list = await List.findAll({ where: { UserId } });
		console.log(list);
		res.render("list", { user, list });
	} catch (err) {
		console.error(err);
	}
});

// 여행지 추가
router.post("/", isLoggedIn, async (req, res) => {
	try {
		const { name, address, phone } = req.body;
		await Travel.create({ name, address, phone });
		const travel = await Travel.findOne({ where: { name, address, phone } });
		await List.create({ name, address, phone, UserId: req.user.id, TravelId: travel.id });
		return res.send("<script>alert('여행지가 저장되었습니다.');location.href='/search';</script>");
	} catch (err) {
		console.error(err);
		return res.send("<script>alert('여행지 저장에 실패하였습니다.');location.href='/search';</script>");
	}
});

// 여행지 삭제
router.delete("/:id", isLoggedIn, async (req, res) => {
	const travelId = req.params.id;
	try {
		await List.destroy({ where: { TravelId: travelId } });
		return res.send("<script>alert('삭제되었습니다.');location.href='/user/list';</script>");
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

module.exports = router;
