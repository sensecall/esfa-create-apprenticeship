const express = require('express')
const router = new express.Router()

var _ = require('underscore');
var moment = require('moment');
const cryptoRandomString = require('crypto-random-string');

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/account-home`)
})

// reservations data storage
router.use(function (req, res, next) {
	if (!req.session.data['reservations']) {
		req.session.data['reservations'] = []
	}

	next()
})

// Choose date
router.get('/choose-date', (req, res) => {
	var currentMonth = moment().format('MMMM YYYY')

	var months = [{
		value: currentMonth,
		text: currentMonth,
		attributes:
		{
			required: "required"
		}
	}]

	function addMonths(m){
		if(months.length < m){
			var date = moment(months[months.length-1]["value"]).add(1, 'months').format("MMMM YYYY");
			var month = {
				value: date,
				text: date
			}

			months.push(month)
			addMonths(m)
		}
	}

	addMonths(6)

	res.render(`${req.feature}/choose-date`,{months})
})

router.post('/choose-date', (req, res) => {
	req.session.data['reservation-employer'] = "Super Business Ltd"
	req.session.data['reservation-startRange'] = moment(req.session.data['planned-start-date']).subtract(1, 'months').format("MMMM YYYY")
	req.session.data['reservation-endRange'] = moment(req.session.data['planned-start-date']).add(1, 'months').format("MMMM YYYY")
	req.session.data['reservation-created'] = moment().format('DD MMMM YYYY')

	res.redirect('choose-course')
})


// confirm details
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


// choose course
router.post('/choose-course', (req, res) => {
	res.redirect('confirm-details')
})


module.exports = router