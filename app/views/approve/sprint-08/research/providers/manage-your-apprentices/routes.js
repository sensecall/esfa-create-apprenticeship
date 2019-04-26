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

  //end of journey screens
router.post('/confirmation', (req, res) => {
	if (req.session.data['next-step'] == 'homepage') {
	  res.redirect('https://marvelapp.com/3ff4j45')
	} else {
	  res.redirect('login')
	}
	})
	
	router.post('/not-confirmed', (req, res) => {
		if (req.session.data['next-step'] == 'homepage') {
			res.redirect('https://marvelapp.com/3ff4j45')
		} else {
			res.redirect('login')
		}
		})
  
  module.exports = router