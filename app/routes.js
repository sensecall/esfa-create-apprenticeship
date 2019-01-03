const express = require('express')
const router = new express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Get Sprint and Feature for URL links
router.use('/', (req, res, next) => {
  req.version = req.originalUrl.split('/')[2]
  req.feature = req.originalUrl.split('/')[1]
  res.locals.version = req.version
  res.locals.feature = req.feature
  res.locals.sprint = req.sprint
  next()
})

// VERSIONS
router.use(/\/version-([0-9]+)/, (req, res, next) => {
  require(`./views/version-${req.params[0]}/routes`)(req, res, next);
})

// Simple
router.use(/\/simple\/version-([0-9]+)/, (req, res, next) => {
  require(`./views/simple/version-${req.params[0]}/routes`)(req, res, next);
})

// Transactional
router.use(/\/employer-transactional-v([0-9]+)/, (req, res, next) => {
  require(`./views/employer-transactional-v${req.params[0]}/routes`)(req, res, next);
})

// MVP
router.use(/\/employer-mvp-v([0-9]+)/, (req, res, next) => {
  require(`./views/employer-mvp-v${req.params[0]}/routes`)(req, res, next);
})

// Provider
router.use(/\/provider-v([0-9]+)/, (req, res, next) => {
  require(`./views/provider-v${req.params[0]}/routes`)(req, res, next);
})

module.exports = router