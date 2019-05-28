const express = require('express')
const router = new express.Router()

var _ = require('underscore');
var moment = require('moment');
const cryptoRandomString = require('crypto-random-string');
const Fuse = require('fuse.js');

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/account-home`)
})


// account home
router.get('/account-home', (req, res) => {
	req.session.data['saved-for-later'] = 'false'

	res.render(`${req.feature}/account-home`)
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

	if (req.session.data['preload-reservations'] == 'true') {
		req.session.data['reservations'] = require('../reservations.json')
	}
	
	req.session.data['preload-reservations'] = 'false'

	next()
})
// ----------------------------------------------------------------------


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


// choose course
router.post('/funding--choose-course', (req, res) => {
	if(req.session.data['know-course'] == 'no' || req.session.data['course-name'] == ''){
		res.redirect('funding--not-reserved')
	} else {
		res.redirect('funding--cya')
	}
})

// know month
router.post('/funding--know-month', (req, res) => {
	if(req.session.data['know-month'] == 'yes'){
		res.redirect('funding--choose-month')
	} else {
		res.redirect('funding--not-reserved')
	}
})

function setMonths(req, res) {
	var monthFormat = "MMMM YYYY"
	var currentMonth = moment().format(monthFormat)

	var months = [
	{
		value: 'before-now',
		text: "Before " + currentMonth,
		checked: req.session.data['planned-start-date'] == "before-now",
		attributes:
		{
			required: "required"
		}
	},
	{
		value: currentMonth,
		text: moment(currentMonth).startOf('month').format(monthFormat),
		checked: req.session.data['planned-start-date'] == currentMonth,
		attributes:
		{
			required: "required"
		}
	}
	]

	function addMonths(m){
		if(months.length <= m + 1){
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
	addMonths(5)

	months.push({
		divider: "or"
	},
	{
		value: "dont-know",
		text: "I don't know",
		checked: req.session.data['planned-start-date'] == "dont-know",
	})

	return months
}

// date plus course variant
router.get('/funding--choose-month', (req, res) => {
	var months = setMonths(req, res)

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
	if(req.session.data['planned-start-date'] == 'before-now'){
		req.session.data['backdated'] = 'true'
		res.redirect('funding--backdated')
	} else if (req.session.data['planned-start-date'] == 'dont-know'){
		res.redirect('funding--not-reserved')
	} else {
		var earliest = moment(req.session.data['planned-start-date']).startOf('month').format("MMMM YYYY")
		var latest =  moment(req.session.data['planned-start-date']).add(2, 'months').endOf('month').format("MMMM YYYY")

		req.session.data['backdated'] = 'false'
		req.session.data['reservation-employer'] = req.session.data['employer']
		req.session.data['reservation-startRange'] = earliest
		req.session.data['reservation-endRange'] = latest
		req.session.data['reservation-created'] = moment().format('MMMM YYYY')
	}

	if(req.session.data['course-name'] == ''){
		req.session.data['course-name'] = 'Unknown'
	}

	res.redirect('funding--choose-course')
})

// funding backdated
router.post('/funding--backdated', (req, res) => {
	var backdatedDate = req.session.data['planned-start-date-year'] + '-' + req.session.data['planned-start-date-month'] + '-01'
	var earliest = moment(backdatedDate).startOf('month').format("MMMM YYYY")

	req.session.data['reservation-employer'] = req.session.data['employer']
	req.session.data['reservation-startRange'] = earliest
	req.session.data['reservation-endRange'] = ''
	req.session.data['reservation-created'] = moment().format('MMMM YYYY')

	res.redirect('funding--choose-course')
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
	let nextThing = req.session.data['whats-next']

	if (nextThing == 'add-apprentice' ) {
		res.redirect(`add--start`)
	} else if (nextThing == 'recruit-apprentice' ) {
		res.redirect(`recruit--start`)
	} else if (nextThing == 'find-provider' ) {
		res.redirect(`fat`)
	} else if (nextThing == 'return-to-homepage' ) {
		res.redirect(`account-home`)
	}
})

router.get('/funding--complete', (req, res) => {
	req.session.data['course-name'] = ''
	
	res.render(`${req.feature}/funding--complete`)
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
		res.redirect(`funding--choose-month`)
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

	req.session.data['current-reservation'] = reservation
	req.session.data['reservations'].push(reservation)

	// reset question answers
	req.session.data['know-course'] = ''
	req.session.data['know-month'] = ''

	if (req.session.data['confirm-funding'] == 'yes' ) {
		var d = req.session.data
		d['know-month'] = ''
		d['know-course'] = ''

		res.redirect(`funding--complete`)
	} else {
		req.session.data['saved-for-later'] = 'true'
		res.redirect(`account-home`)
	}
})


// choose course
router.post('/choose-course', (req, res) => {
	res.redirect('choose-date')
})


// manage funding
router.get('/funding--manage', (req, res) => {
	let filteredReservations = req.session.data['reservations'].filter(function(item) {
		return item.employer == req.session.data['employer']
	});

	req.session.data['showDeleteConfirmation'] = 'false'

	// search
	if ( ! req.session.data['search-funding'] ) {
		req.session.data['search-funding']
		res.render(`${req.feature}/funding--manage`,{filteredReservations})
	} else {
		var options = {
			keys: ['course', 'employer']
		}
		
		let fuse = new Fuse(filteredReservations, options)
		
		filteredReservations = fuse.search( req.session.data['search-funding'] );
		
		res.render(`${req.feature}/funding--manage`, {filteredReservations})
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
	req.session.data['deleted-reservation-details'] = _.filter(req.session.data['reservations'], function(item){
		return item['id'] === req.session.data['reservation-id'];
	})

	if (req.session.data['delete-reservation'] == 'yes' ) {
		req.session.data['reservations'] = req.session.data['reservations'].filter(function(item) {
			return item.id !== req.session.data['reservation-id']
		});

		// req.session.data['showDeleteConfirmation'] = 'true'

		res.redirect(`funding--deleted`)
	} else {
		res.redirect(`funding--manage`)
	}
})


// funding deleted
router.post('/funding--deleted', (req, res) => {
	if (req.session.data['whats-next'] == 'manage' ) {
		res.redirect(`funding--manage`)
	} else if (req.session.data['whats-next'] == 'return-to-homepage' ) {
		res.redirect(`account-home`)
	}
})


module.exports = router