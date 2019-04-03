const express = require('express')
const router = new express.Router()

// Home page redirect
router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/start`)
})

// Know date
router.post('/know-date', (req, res) => {
	if (req.session.data['know-date'] == 'date-estimate' ) {
		res.redirect(`estimate-date`)
	} else {
		res.redirect(`date-message`)
	}
})

// Have account
router.get('/have-account', (req, res) => {
	req.session.data['have-account'] = ''
	res.render(`${req.feature}/have-account`)
})

router.post('/have-account', (req, res) => {
	if (req.session.data['have-account'] == 'yes' ) {
		req.session.data['redirectUrl'] = 'know-provider'
		res.redirect(`login`)
	} else {
		req.session.data['loggedIn'] = 'false'
		res.redirect(`registration-message`)
	}
})

router.post('/registration-message', (req, res) => {
	if (req.session.data['register-now'] == 'yes' ) {
		res.redirect(`registration`)
	} else {
		req.session.data['registered'] = 'false'
		res.redirect(`know-provider`)
	}
})

// Know apprenticeship
router.post('/choose-apprenticeship', (req, res) => {
	res.redirect(`know-date`)
})

// Check permission
router.post('/check-permissions', (req, res) => {
	if (req.session.data['give-permission'] == 'yes' ) {
		if(req.session.data['registered'] == 'false'){
			res.redirect(`must-register`)
		} else {
			res.redirect('permission-confirm')
		}
	} else {
		res.redirect(`know-apprenticeship`)
	}
})

// Know provider
router.post('/know-provider', (req, res) => {
	if (req.session.data['know-provider'] == 'yes' ) {
		if (req.session.data['loggedIn'] == 'true' ) {
			res.redirect('use-existing-provider')
		} else {
			res.redirect('choose-provider')
		}
	} else {
		res.redirect(`know-apprenticeship`)
	}
})

// use existing provider
router.post('/use-existing-provider', (req, res) => {
	if (req.session.data['choose-provider'] == 'new' ) {
		req.session.data['provider-name'] = req.session.data['new-provider-name']
	} else {
		req.session.data['provider-name'] = req.session.data['choose-provider']
	}
	
	res.redirect('confirm-provider')
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
		res.redirect(`funding-secured`)
	}
})

// Reserve confirm
router.post('/funding-secured', (req, res) => {
	if (req.session.data['add-apprentice-now'] == 'yes') {
		
	} else {
		res.redirect('account-home')
	}
})

module.exports = router