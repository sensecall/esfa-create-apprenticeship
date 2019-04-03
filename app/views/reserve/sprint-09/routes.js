const express = require('express')
const router = new express.Router()

router.use('/', (req, res, next) => {
  req.feature = req.originalUrl.split('/')[1] + '/' + req.originalUrl.split('/')[2] + '/' + req.originalUrl.split('/')[3] + '/' + req.originalUrl.split('/')[4]
  req.sprint = req.originalUrl.split('/')[2]
  res.locals.feature = req.feature
  next()
})

// Route index page
router.get('/', function (req, res) {
  res.redirect('../')
})

// provider
router.use(/\/research\/provider-v1/, (req, res, next) => {
  require(`./research/provider-v1/routes`)(req, res, next);
})

// provider
router.use(/\/research\/provider-v2/, (req, res, next) => {
  require(`./research/provider-v2/routes`)(req, res, next);
})

// employer 
router.use('/research/employer/', (req, res, next) => {
  require(`./research/employer/routes`)(req, res, next);
})

module.exports = router