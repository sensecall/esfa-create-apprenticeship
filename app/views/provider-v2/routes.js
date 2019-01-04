const express = require('express')
const router = new express.Router()

// custom filters
var moment = require('moment');
var _ = require('underscore');
const cryptoRandomString = require('crypto-random-string');

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
		res.redirect(`choose-date`)
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
	req.session.data['reservation-employer'] = req.session.data['employer']
	req.session.data['reservation-startRange'] = moment(req.session.data['planned-start-date']).subtract(1, 'months').format("MMMM YYYY")
	req.session.data['reservation-endRange'] = moment(req.session.data['planned-start-date']).add(1, 'months').format("MMMM YYYY")
	req.session.data['reservation-created'] = moment().format('DD MMMM YYYY')

	res.redirect('choose-course')
})

// choose course
router.post('/choose-course', (req, res) => {
	res.redirect('confirm-details')
})

// confirm details
router.get('/confirm-details', (req, res) => {
	res.render(`${req.feature}/confirm-details`)
})

router.post('/confirm-details', (req, res) => {
	var reservation = {
		"id": cryptoRandomString(10),
		"month": req.session.data['planned-start-date'],
		"startMonth": req.session.data['reservation-startRange'],
		"endMonth": req.session.data['reservation-endRange'],
		"created": req.session.data['reservation-created'],
		"employer": req.session.data['reservation-employer'],
		"course": req.session.data['course-name']
	}

	req.session.data['reservations'].push(reservation)

	res.redirect(`reservation-complete`)
})

// choose reservation
router.get('/choose-reservation', (req, res) => {
	var filteredReservations = _.filter(req.session.data['reservations'], function(reservation){
		return _.has(reservation, 'employer') && reservation['employer'] === req.session.data['employer'];
	})

	if(filteredReservations.length == 0){
		res.redirect('funding-warning')
	} else {
		res.render(`${req.feature}/choose-reservation`,{filteredReservations})
	}	
})

router.post('/choose-reservation', (req, res) => {
	if (req.session.data['choose-reservation'] == 'create-reservation' ) {
		res.redirect(`funding-warning`)
	} else {
		res.redirect(`apprentice-details`)
	}
})

// funding warning skip
router.get('/funding-warning', (req, res) => {
	res.redirect('choose-date')
})

// reservation complete
router.post('/reservation-complete', (req, res) => {
	if (req.session.data['add-apprentice'] == 'yes' ) {
		res.redirect(`apprentice-details`)
	} else {
		res.redirect(`add-another-reservation`)
	}
})

// reservation details
router.get('/reservation-details', (req, res) => {
	var reservationDetails = _.filter(req.session.data['reservations'], function(item){
		return item['id'] === req.session.data['reservation-id'];
	})

	res.render(`${req.feature}/reservation-details`,{reservationDetails})
})

// apprentice-details
router.post('/apprentice-details', (req, res) => {
	req.session.data['reservations'] = req.session.data['reservations'].filter(function(item) {
		return item.id !== req.session.data['choose-reservation']
	});

	res.redirect(`review-apprentice-details`)
})

// delete reservation
router.get('/delete-reservation', (req, res) => {
	var reservationDetails = _.filter(req.session.data['reservations'], function(item){
		return item['id'] === req.session.data['reservation-id'];
	})

	res.render(`${req.feature}/delete-reservation`,{reservationDetails})
})

router.post('/delete-reservation', (req, res) => {
	req.session.data['reservations'] = req.session.data['reservations'].filter(function(item) {
		return item.id !== req.session.data['reservation-id']
	});

	res.redirect(`manage-reservations`)
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