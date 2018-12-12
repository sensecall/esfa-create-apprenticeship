const express = require('express')
const router = new express.Router()

// custom filters
var moment = require('moment');

// data
// var reservations = [];


// reservations data storage
router.use(function (req, res, next) {
	if (!req.session.data['reservations']) {
		req.session.data['reservations'] = []
	}

	next()
})

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

// Confirm employer (reserve)
router.post('/reserve__confirm-employer', (req, res) => {
	if (req.session.data['confirm-employer'] == 'yes' ) {
		res.redirect(`choose-reservation`)
	} else {
		req.session.data['employer'] = ''
		res.redirect(`reserve__choose-employer`)
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

// choose date
router.post('/choose-date', (req, res) => {
	var chosenDate = req.session.data['planned-start-date']
	var startRange = moment(chosenDate).subtract(1, 'months').format("MMMM YYYY")
	var endRange = moment(chosenDate).add(1, 'months').format("MMMM YYYY")
	var created = moment().format('DD MMMM YYYY')

	var reservation = {
		"month": chosenDate,
		"startMonth": startRange,
		"endMonth": endRange,
		"created": created
	}

	req.session.data['reservations'].push(reservation)

	req.session.data['startRange'] = startRange
	req.session.data['endRange'] = endRange

	res.redirect('confirm-details')
})

// confirm details
router.get('/confirm-details', (req, res) => {
	res.render(`${req.feature}/confirm-details`)
})

// choose reservation
router.get('/choose-reservation', (req, res) => {
	if(req.session.data['reservations'].length == 0){
		res.redirect('funding-warning')
	} else {
		res.render(`${req.feature}/choose-reservation`)
	}
	
})

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