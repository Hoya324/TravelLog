const router = require("express").Router();
const { isLoggedIn } = require("./auth");
const { Travel, Record } = require("../models");

// 기록 작성 페이지로 이동
router.get('/:travelId', isLoggedIn, async (req, res, next) => {
	try {
		const travel = await Travel.findByPk(req.params.travelId);
		if (!travel) {
			return res.status(404).send('Travel not found');
		}
		const record = await Record.findOne({
			where: {
				travelId: req.params.travelId,
				userId: req.user.id
			}
		});

		if (!record) {
			res.render('record', {
				travel,
				user: req.user,
				record,
				createdAt: record ? formatDate(record.createdAt.toString()) : null,
				updatedAt: record ? formatDate(record.updatedAt.toString()) : null,
				withWhom: record ? record.with : null
			});
		} else {
			res.render('edit_record', {
				travel,
				user: req.user,
				record,
				createdAt: record ? formatDate(record.createdAt.toString()) : null,
				updatedAt: record ? formatDate(record.updatedAt.toString()) : null,
				withWhom: record ? record.with : null
			});
		}

	} catch (err) {
		next(err);
	}
});

// 기록 저장
router.post('/:travelId', isLoggedIn, async (req, res, next) => {
	try {
		const { content, withWhom } = req.body;
		const userId = req.user.id;
		const travelId = req.params.travelId;

		let record = await Record.findOne({
			where: {
				userId,
				travelId
			}
		});

		if (record) {
			await record.update({ content, with: withWhom });
		} else {
			await Record.create({ content, userId, travelId, with: withWhom });
		}

		res.redirect(`/record/${travelId}/edit`);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

// 저장된 기록 페이지로 이동
router.get('/:travelId/rewrite', isLoggedIn, async (req, res, next) => {
	try {
		const travel = await Travel.findByPk(req.params.travelId);
		if (!travel) {
			return res.status(404).send('Travel not found');
		}
		const record = await Record.findOne({
			where: {
				travelId: req.params.travelId,
				userId: req.user.id
			}
		});

		res.render('record', {
			travel,
			user: req.user,
			record,
			createdAt: record ? formatDate(record.createdAt.toString()) : null,
			updatedAt: record ? formatDate(record.updatedAt.toString()) : null,
			withWhom: record ? record.with : null
		});
	} catch (err) {
		next(err);
	}
});

// 기록 편집 페이지로 이동
router.get('/:travelId/edit', isLoggedIn, async (req, res, next) => {
	try {
		const travel = await Travel.findByPk(req.params.travelId);
		if (!travel) {
			return res.status(404).send('Travel not found');
		}
		const record = await Record.findOne({
			where: {
				travelId: req.params.travelId,
				userId: req.user.id
			}
		});

		if (!record) {
			res.render('record', {
				travel,
				user: req.user,
				record,
				createdAt: record ? formatDate(record.createdAt.toString()) : null,
				updatedAt: record ? formatDate(record.updatedAt.toString()) : null,
				withWhom: record ? record.with : null
			});
		} else {
			res.render('edit_record', {
				travel,
				user: req.user,
				record,
				createdAt: record ? formatDate(record.createdAt.toString()) : null,
				updatedAt: record ? formatDate(record.updatedAt.toString()) : null,
				withWhom: record ? record.with : null
			});
		}

	} catch (err) {
		next(err);
	}
});

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}, ${date.getHours()}시 ${date.getMinutes()}분`;
};

module.exports = router;
