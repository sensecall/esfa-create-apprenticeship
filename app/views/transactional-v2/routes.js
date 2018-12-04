const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/start`)
})

router.post('/know-date', (req, res) => {
	if (req.session.data['planned-start-date'] == 'date-specific' ) {
		res.redirect(`specific-date`)
	} else {
		if (req.session.data['planned-start-date'] == 'date-estimate' ) {
			res.redirect(`estimate-date`)
		} else {
			res.redirect(`date-message`)
		}
	}
})

router.post('/have-account', (req, res) => {
	if (req.session.data['have-account'] == 'yes' ) {
		res.redirect(`login`)
	} else {
		res.redirect(`know-date`)
	}
})

router.post('/know-apprenticeship', (req, res) => {
	if (req.session.data['know-apprenticeship'] == 'yes' ) {
		res.redirect(`choose-course`)
	} else {
		res.redirect(`know-provider`)
	}
})

router.post('/know-provider', (req, res) => {
	if (req.session.data['know-provider'] == 'yes' ) {
		res.redirect(`choose-provider`)
	} else {
		res.redirect(`know-details`)
	}
})

router.post('/know-details', (req, res) => {
	if (req.session.data['know-details'] == 'yes' ) {
		res.redirect(`apprentice-details`)
	} else {
		res.redirect(`mya-task-list`)
	}
})

module.exports = router