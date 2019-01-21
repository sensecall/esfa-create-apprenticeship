const express = require('express')
const router = new express.Router()

// Get Sprint and Feature for URL links
router.use('/', (req, res, next) => {
  req.version = req.originalUrl.split('/')[2]
  req.feature = 'archive/' + req.originalUrl.split('/')[2]
  res.locals.version = req.version
  res.locals.feature = req.feature
  res.locals.sprint = req.sprint
  next()
})



// Home page redirect
router.get('/archive', (req, res) => {
  res.redirect(`/archive/`)
})



// Provider
router.use(/\/provider-v([0-9]+)/, (req, res, next) => {
  require(`./provider-v${req.params[0]}/routes`)(req, res, next);
})



// VERSIONS
router.use(/\/version-([0-9]+)/, (req, res, next) => {
  require(`./version-${req.params[0]}/routes`)(req, res, next);
})

// Simple
router.use(/\/archive\/simple\/version-([0-9]+)/, (req, res, next) => {
  require(`./simple/version-${req.params[0]}/routes`)(req, res, next);
})

// Transactional
router.use(/\/employer-transactional-v([0-9]+)/, (req, res, next) => {
  require(`./employer-transactional-v${req.params[0]}/routes`)(req, res, next);
})

// MVP
router.use(/\/employer-mvp-v([0-9]+)/, (req, res, next) => {
  require(`./employer-mvp-v${req.params[0]}/routes`)(req, res, next);
})

// Employer approve
router.use(/\/employer-approve-v([0-9]+)/, (req, res, next) => {
  require(`./employer-approve-v${req.params[0]}/routes`)(req, res, next);
})

// Provider add details
router.use(/\/provider-add-details-v([0-9]+)/, (req, res, next) => {
  require(`./provider-add-details-v${req.params[0]}/routes`)(req, res, next);
})

module.exports = router