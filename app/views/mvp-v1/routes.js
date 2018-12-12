const express = require('express')
const router = new express.Router()

var moment = require('moment');

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/account-home`)
})

router.post('/choose-date', (req, res) => {
	var chosenDate = req.session.data['planned-start-date']
	var startRange = moment(chosenDate).subtract(1, 'months').format("MMMM YYYY")
	var endRange = moment(chosenDate).add(1, 'months').format("MMMM YYYY")
	var created = moment().format('DD MMMM YYYY')

	req.session.data['startRange'] = startRange
	req.session.data['endRange'] = endRange
	req.session.data['created'] = created

	res.redirect('reserve-confirm')
})

module.exports = router