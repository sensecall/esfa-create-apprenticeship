const express = require('express')
const router = new express.Router()

var _ = require('underscore');
var moment = require('moment');
const cryptoRandomString = require('crypto-random-string');

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/account-home`)
})


// ----------------------------------------------------------------------
// Reservations data storage
// ----------------------------------------------------------------------
// We use this to set an empty array which will hold all the reservations
// created by the user.
//
// In the future we might want to expand this so that we can run research
// sessions with a provider and an employer user at the same time.
router.use(function (req, res, next) {
	if (!req.session.data['reservations']) {
		req.session.data['reservations'] = []
	}

	next()
})
// ----------------------------------------------------------------------


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

	res.render(`${req.feature}/choose-date-02`,{months})
})

router.post('/choose-date', (req, res) => {
	req.session.data['reservation-employer'] = "APEX ELECTRICAL ENGINEERS LIMITED"
	// req.session.data['reservation-startRange'] = moment(req.session.data['reservation-startRange-month'] + ' 01 ' + req.session.data['reservation-startRange-year']).format("MMMM YYYY")
	// req.session.data['reservation-endRange'] = moment(req.session.data['reservation-endRange-month'] + ' 01 ' + req.session.data['reservation-endRange-year']).format("MMMM YYYY")
	req.session.data['reservation-startRange'] = moment('01 ' + req.session.data['reservation-startRange']).startOf('month').format("DD MMMM YYYY")
	req.session.data['reservation-endRange'] = moment('01 ' + req.session.data['reservation-endRange']).endOf('month').format("DD MMMM YYYY")
	req.session.data['reservation-created'] = moment().format('DD MMMM YYYY')

	res.redirect('confirm-details')
})


// date course variant
router.get('/date-course', (req, res) => {
	var currentMonth = moment().format('MMMM YYYY')

	var months = [{
		value: currentMonth,
		text: moment(currentMonth).startOf('month').format("MMMM YYYY") + " (valid until " + moment(currentMonth).add(2, 'months').endOf('month').format("D MMMM YYYY") + ")",
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
				text: moment(date).startOf('month').format("MMMM YYYY") + " (valid until " + moment(date).add(2, 'months').endOf('month').format("D MMMM YYYY") + ")",
				hint:
				{
					text: ""
				}
			}

			months.push(month)
			addMonths(m)
		}
	}

	addMonths(4)

	res.render(`${req.feature}/date-course`,{months})
})

router.post('/date-course', (req, res) => {
	var earliest = moment(req.session.data['planned-start-date']).startOf('month').format("DD MMMM YYYY")
	var latest =  moment(req.session.data['planned-start-date']).add(2, 'months').endOf('month').format("DD MMMM YYYY")
	req.session.data['reservation-employer'] = "APEX ELECTRICAL ENGINEERS LIMITED"
	req.session.data['reservation-startRange'] = earliest
	req.session.data['reservation-endRange'] = latest
	req.session.data['reservation-created'] = moment().format('DD MMMM YYYY')

	res.redirect('confirm-details')
})


// know course
router.post('/know-course', (req, res) => {
	if (req.session.data['know-course'] == 'yes' ) {
		res.redirect(`choose-course`)
	} else {
		req.session.data['course-name'] = 'All apprenticeships, any level'
		res.redirect(`confirm-details`)
	}
})


// reservation complete
router.post('/reservation-complete', (req, res) => {
	if (req.session.data['add-apprentice'] == 'yes' ) {
		res.redirect(`add-apprentice`)
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


// apprentice-details
router.post('/apprentice-details', (req, res) => {
	req.session.data['reservations'] = req.session.data['reservations'].filter(function(item) {
		return item.id !== req.session.data['choose-reservation']
	});

	res.redirect(`review-apprentice-details`)
})


// details sent
router.post('/details-sent', (req, res) => {
	if (req.session.data['add-another'] == 'yes' ) {
		res.redirect(`choose-reservation`)
	} else {
		res.redirect(`account-home`)
	}
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
	res.redirect('choose-date')
})


module.exports = router