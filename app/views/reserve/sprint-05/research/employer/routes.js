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


// funding start
router.get('/funding--start', (req, res) => {
	if ( req.session.data['funding-restrictions'].includes('current-restriction') ) {
		res.render(`${req.feature}/funding--start--service-unavailable`)
	} else {
		res.render(`${req.feature}/funding--start`)
	}
})


// choose course
router.post('/funding--choose-course', (req, res) => {
	res.redirect('funding--choose-month')
})


// date plus course variant
router.get('/funding--choose-month', (req, res) => {
	var currentMonth = moment().format('MMMM YYYY')
	var monthFormat = "MMMM YYYY"

	var months = [{
		value: currentMonth,
		text: moment(currentMonth).startOf('month').format(monthFormat),
		checked: req.session.data['planned-start-date'] == currentMonth,
		attributes:
		{
			required: "required"
		}
	}]

	function addMonths(m){
		if(months.length < m){
			var date = moment(months[months.length-1]["value"]).add(1, 'months').format(monthFormat);
			var month = {
				value: date,
				text: moment(date).startOf('month').format(monthFormat),
				hint:
				{
					text: ""
				},
				checked: req.session.data['planned-start-date'] == date
			}

			months.push(month)
			addMonths(m)
		}
	}

	addMonths(6)

	res.render(`${req.feature}/funding--choose-month`,{months})
})

// date plus course variant
router.get('/funding--choose-month--errors', (req, res) => {
	var currentMonth = moment().format('MMMM YYYY')
	var monthFormat = "MMMM YYYY"

	var months = [{
		value: currentMonth,
		text: moment(currentMonth).startOf('month').format(monthFormat),
		checked: req.session.data['planned-start-date'] == currentMonth,
		attributes:
		{
			required: "required"
		}
	}]

	function addMonths(m){
		if(months.length < m){
			var date = moment(months[months.length-1]["value"]).add(1, 'months').format(monthFormat);
			var month = {
				value: date,
				text: moment(date).startOf('month').format(monthFormat),
				hint:
				{
					text: ""
				},
				checked: req.session.data['planned-start-date'] == date
			}

			months.push(month)
			addMonths(m)
		}
	}

	addMonths(6)

	res.render(`${req.feature}/funding--choose-month--errors`,{months})
})

router.post('/funding--choose-month', (req, res) => {
	var earliest = moment(req.session.data['planned-start-date']).startOf('month').format("MMMM YYYY")
	var latest =  moment(req.session.data['planned-start-date']).add(2, 'months').endOf('month').format("MMMM YYYY")
	req.session.data['reservation-employer'] = req.session.data['employer']
	req.session.data['reservation-startRange'] = earliest
	req.session.data['reservation-endRange'] = latest
	req.session.data['reservation-created'] = moment().format('MMMM YYYY')

	if(req.session.data['course-name'] == ''){
		req.session.data['course-name'] = 'Unknown'
	}

	res.redirect('funding--cya')
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
router.post('/funding--complete', (req, res) => {
	if (req.session.data['add-apprentice'] == 'yes' ) {
		res.redirect(`add-apprentice`)
	} else {
		res.redirect(`account-home`)
	}
})


// add another reservation
router.post('/funding--add-another-reservation', (req, res) => {
	if (req.session.data['add-reservation'] == 'yes' ) {
		res.redirect(`funding--enter-details`)
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


// view details
router.get('/funding--choose-legal-entity', (req, res) => {
	if (req.session.data['multiple-legal-entities'] == 'true' ) {
		res.render(`${req.feature}/funding--choose-legal-entity`)
	} else {
		res.redirect(`funding--number-of-apprentices`)
	}
})


// view details
router.get('/funding--view-details', (req, res) => {
	var reservationDetails = _.filter(req.session.data['reservations'], function(item){
		return item['id'] === req.session.data['reservation-id'];
	})

	res.render(`${req.feature}/funding--view-details`,{reservationDetails})
})


// confirm details
router.post('/funding--cya', (req, res) => {
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

	res.redirect(`funding--complete`)
})


// choose course
router.post('/choose-course', (req, res) => {
	res.redirect('choose-date')
})


module.exports = router