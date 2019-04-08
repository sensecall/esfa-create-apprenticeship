const express = require('express')
const router = new express.Router()

var _ = require('underscore');
var moment = require('moment');
const cryptoRandomString = require('crypto-random-string');

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/email`)
})

//review an apprentice
router.post('/review-an-apprentice', (req, res) => {
	if (req.session.data['approve'] == 'yes') {
	  res.redirect('confirmation')
	} else {
	  res.redirect('not-confirmed')
	}
	})
	
	// employer 
router.use('/stop-apprentice', (req, res, next) => {
  require(`./stop-apprentice/routes`)(req, res, next);
})
  
  module.exports = router