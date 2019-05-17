const express = require('express')
const router = new express.Router()

var _ = require('underscore');
var moment = require('moment');
const cryptoRandomString = require('crypto-random-string');

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/account-home`)
})


// account home
// router.get('/account-home', (req, res) => {
// 	if( req.get('host').includes('localhost') ){
// 		res.render(`${req.feature}/account-home`)
// 	} else {
// 		res.redirect('https://marvelapp.com/1e07dceg')
// 	}
// })


// ----------------------------------------------------------------------
// Reservations data storage
// ----------------------------------------------------------------------
router.use(function (req, res, next) {
	if (!req.session.data['reservations']) {
		req.session.data['reservations'] = []
	}

	if (req.session.data['preload-reservations'] == 'true') {
		req.session.data['reservations'] = require('../reservations.json')
	}
	
	req.session.data['preload-reservations'] = 'false'

	next()
})


// funding start
// funding start
router.get('/funding--sc-check', (req, res) => {

	let sc = req.session.data['funding-restrictions']
	let a = req.session.data['reservations']
	let e = req.session.data['employer']
	let seenWarning = req.session.data['seen-warning']
	
	// check that the selected employer hasnt got too many reservations yet
	// https://stackoverflow.com/questions/45547504/counting-occurrences-of-particular-property-value-in-array-of-objects-angular/45547593
	let employerReservationCount = a.filter((obj) => obj.employer === e).length


	// check if there's a spend control in place
	if ( sc != '' ) {
		// if there is a current restriction don't let the user go any further
		if ( sc.includes('current-restriction') ) {
			res.redirect(`funding--start--service-unavailable`)
		} else if( sc.includes('number-of-starts') && employerReservationCount > 2 ) {
			res.redirect(`funding--employer-ineligible`)
		} else {
			// check they've seen a warning
			if( seenWarning != 'true' ) {
				res.redirect(`funding--warning`)
			} else {
				res.redirect(`funding--start`)
			}
		}
	} else {
		// if no spend control then let them continue
		res.redirect(`funding--start`)
	}
})


// delete reservation
router.get('/funding--delete', (req, res) => {
	var reservationDetails = _.filter(req.session.data['reservations'], function(item){
		return item['id'] === req.session.data['reservation-id'];
	})

	res.render(`${req.feature}/funding--delete`,{reservationDetails})
})

router.post('/funding--delete', (req, res) => {
	if (req.session.data['delete-reservation'] == 'yes' ) {
		req.session.data['reservations'] = req.session.data['reservations'].filter(function(item) {
			return item.id !== req.session.data['reservation-id']
		});

		req.session.data['showDeleteConfirmation'] = 'true'
	}

	res.redirect(`funding--manage`)
})


// choose course
router.post('/funding--choose-course', (req, res) => {
	if(req.session.data['know-course'] == 'no' || req.session.data['course-name'] == ''){
		req.session.data['course-name'] = 'Unknown'
	}
	res.redirect('funding--choose-month')
})

// know month
router.post('/funding--know-month', (req, res) => {
	if(req.session.data['know-month'] == 'yes'){
		res.redirect('funding--choose-month')
	} else {
		res.redirect('funding--month-warning')
	}
})


// date plus course variant
router.get('/funding--choose-month', (req, res) => {
	var monthFormat = "MMMM YYYY"
	var currentMonth = moment().format(monthFormat)

	var months = [
	// {
	// 	value: "Before " + moment(currentMonth).startOf('month').format(monthFormat),
	// 	text: "Before " + moment(currentMonth).startOf('month').format(monthFormat)
	// },
	// {
	// 	divider: "or"
	// },
	{
		value: currentMonth,
		text: moment(currentMonth).startOf('month').format(monthFormat),
		checked: req.session.data['planned-start-date'] == currentMonth,
		attributes:
		{
			required: "required"
		}
	}]

	function addMonths(m){
		if(months.length < m+2){
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

	addMonths(4)

	res.render(`${req.feature}/funding--choose-month`,{months})
})

// date plus course variant
router.get('/funding--choose-month--errors', (req, res) => {
	var currentMonth = moment().format('MMM YYYY')
	var monthFormat = "MMM YYYY"

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
	if(req.session.data['planned-start-date'].includes('Before')){
		res.redirect('funding--backdated')
	} else {
		var earliest = moment(req.session.data['planned-start-date']).startOf('month').format("MMM YYYY")
		var latest =  moment(req.session.data['planned-start-date']).add(2, 'months').endOf('month').format("MMM YYYY")
		req.session.data['reservation-employer'] = req.session.data['employer']
		req.session.data['reservation-startRange'] = earliest
		req.session.data['reservation-endRange'] = latest
		req.session.data['reservation-created'] = moment().format('MMM YYYY')
	}

	if(req.session.data['course-name'] == ''){
		req.session.data['course-name'] = 'Unknown'
	}

	res.redirect('funding--cya')
})

// funding backdated
router.post('/funding--backdated', (req, res) => {
	var backdatedDate = '01' + ' ' + req.session.data['planned-start-date-month'] + ' ' + req.session.data['planned-start-date-year']
	var earliest = moment(backdatedDate).startOf('month').format("MMM YYYY")
	var latest =  moment(backdatedDate).add(2, 'months').endOf('month').format("MMM YYYY")
	req.session.data['reservation-employer'] = req.session.data['employer']
	req.session.data['reservation-startRange'] = earliest
	req.session.data['reservation-endRange'] = latest
	req.session.data['reservation-created'] = moment().format('MMM YYYY')

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
		res.redirect(`add--start`)
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

// manage funding
router.get('/funding--manage', (req, res) => {
	let filteredReservations = req.session.data['reservations'].filter(function(item) {
		return item.employer == req.session.data['employer']
	});

	req.session.data['showDeleteConfirmation'] = 'false'

	res.render(`${req.feature}/funding--manage`,{filteredReservations})
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
		res.redirect(`funding--choose-course`)
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