const express = require('express')
const router = new express.Router()

// custom filters
var moment = require('moment');
var _ = require('underscore');
const cryptoRandomString = require('crypto-random-string');




// Home page redirect
router.get('/', (req, res) => {
	res.redirect(`account-home`)
})

module.exports = router