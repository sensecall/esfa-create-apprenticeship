const express = require('express')
const router = new express.Router()

var _ = require('underscore');
var moment = require('moment');
const cryptoRandomString = require('crypto-random-string');


router.get('*/manage-your-apprentices-alerts', function (req, res) {
	res.render('approve/sprint-09/research/providers/manage-your-apprentices/manage-your-apprentices-alerts', {
   "query" : req.query,
   }
  )
 })
  
 router.get('*/manage-your-apprentices', function (req, res) {
	res.render('approve/sprint-09/research/providers/manage-your-apprentices/manage-your-apprentices', {
   "query" : req.query,
   }
  )
 })

 router.get('*/manage-your-apprentices-filters', function (req, res) {
	res.render('approve/sprint-09/research/providers/manage-your-apprentices/manage-your-apprentices-filters', {
   "query" : req.query,
   }
  )
 })

  module.exports = router