const express = require('express')
const router = new express.Router()

// custom filters
var moment = require('moment');

// Home page redirect
router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/account-home`)
})

// Confirm employer (add)
router.post('/add__confirm-employer', (req, res) => {
	if (req.session.data['confirm-employer'] == 'yes' ) {
		res.redirect(`choose-reservation`)
	} else {
		req.session.data['employer'] = ''
		res.redirect(`add__choose-employer`)
	}
})

// confirm details
router.get('/confirm-details', (req, res) => {
	var chosenDate = req.session.data['planned-start-date']
	var startRange = moment(chosenDate).subtract(1, 'months').format("MMMM YYYY")
	var endRange = moment(chosenDate).add(1, 'months').format("MMMM YYYY")

	res.render(`${req.feature}/confirm-details`,{startRange,endRange})
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
		res.redirect(`funding-warning`)
	} else {
		res.redirect(`apprentice-details`)
	}
})

// reservation complete
router.post('/reservation-complete', (req, res) => {
	if (req.session.data['add-apprentice'] == 'yes' ) {
		res.redirect(`apprentice-details`)
	} else {
		res.redirect(`add-another-reservation`)
	}
})

// add another reservation
router.post('/add-another-reservation', (req, res) => {
	if (req.session.data['add-reservation'] == 'yes' ) {
		res.redirect(`choose-date`)
	} else {
		res.redirect(`account-home`)
	}
})

// details sent
router.post('/details-sent', (req, res) => {
	if (req.session.data['add-another'] == 'yes' ) {
		res.redirect(`choose-reservation`)
	} else {
		res.redirect(`account-home`)
	}
})

module.exports = router