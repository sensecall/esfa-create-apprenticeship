const express = require('express')
const router = new express.Router()

// Home page redirect
router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/start`)
})

// Know date
router.post('/know-date', (req, res) => {
	if (req.session.data['know-date'] == 'date-specific' ) {
		res.redirect(`specific-date`)
	} else {
		if (req.session.data['know-date'] == 'date-estimate' ) {
			res.redirect(`estimate-date`)
		} else {
			res.redirect(`date-message`)
		}
	}
})

// Have account
router.get('/have-account', (req, res) => {
	req.session.data['have-account'] = ''
	res.render(`${req.feature}/have-account`)
})

router.post('/have-account', (req, res) => {
	if (req.session.data['have-account'] == 'yes' ) {
		res.redirect(`login`)
	} else {
		req.session.data['loggedIn'] = 'false'
		res.redirect(`know-provider`)
	}
})

// Know apprenticeship
router.get('/know-apprenticeship', (req, res) => {
	if (req.session.data['know-provider'] == 'yes' ) {
		res.render(`${req.feature}/know-apprenticeship`)
	} else {
		res.redirect(`know-details`)
	}
})

router.post('/know-apprenticeship', (req, res) => {
	if (req.session.data['know-apprenticeship'] == 'yes' ) {
		res.redirect(`choose-course`)
	} else {
		res.redirect(`know-details`)
	}
})

// Check permission
router.post('/check-permissions', (req, res) => {
	if (req.session.data['give-permission'] == 'yes' ) {
		res.redirect(`permission-confirm`)
	} else {
		res.redirect(`know-date`)
	}
})

// Know provider
router.post('/know-provider', (req, res) => {
	if (req.session.data['know-provider'] == 'yes' ) {
		res.redirect(`choose-provider`)
	} else {
		res.redirect(`know-date`)
	}
})

router.post('/know-details', (req, res) => {
	if (req.session.data['know-details'] == 'yes' ) {
		res.redirect(`apprentice-details`)
	} else {
		res.redirect(`mya-task-list`)
	}
})

// Reserve confirm
router.post('/reserve-confirm', (req, res) => {
	if (req.session.data['create-account']) {
		if (req.session.data['create-account'] == 'yes' ) {
			req.session.data['redirectUrl'] = 'reserve-confirm'
			res.redirect(`registration`)
		} else {
			res.render(`${req.feature}/reserve-confirm`)
		}
	} else {
		res.redirect(`know-apprenticeship`)
	}
})

module.exports = router