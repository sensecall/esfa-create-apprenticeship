const express = require('express')
const router = new express.Router()

// Home page redirect
router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/account-home`)
})

// Confirm employer
router.post('/confirm-employer', (req, res) => {
	if (req.session.data['confirm-employer'] == 'yes' ) {
		res.redirect(`choose-reservation`)
	} else {
		req.session.data['employer'] = ''
		res.redirect(`choose-employer`)
	}
})

// have account
router.post('/have-account', (req, res) => {
	if (req.session.data['have-account'] == 'yes' ) {
		res.redirect(`login`)
	} else {
		res.redirect(`know-provider`)
	}
})

// choose reservation
router.post('/choose-reservation', (req, res) => {
	if (req.session.data['choose-reservation'] == 'create-reservation' ) {
		res.redirect(`reservation-details`)
	} else {
		res.redirect(`commitments-start`)
	}
})

module.exports = router