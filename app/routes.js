const express = require('express')
const router = new express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Get Sprint and Feature for URL links
router.use('/', (req, res, next) => {
  req.version = req.originalUrl.split('/')[2]
  req.feature = req.originalUrl.split('/')[1] + '/' + req.originalUrl.split('/')[2] + '/' + req.originalUrl.split('/')[3]
  res.locals.version = req.version
  res.locals.feature = req.feature
  res.locals.sprint = req.sprint
  next()
})

// VERSIONS
router.use(/\/version-([0-9]+)/, (req, res, next) => {
  require(`./views/version-${req.params[0]}/routes`)(req, res, next);
})

// ARCHIVE
// created 2019-01-11
router.use(/\/archive/, (req, res, next) => {
  require(`./views/archive/routes`)(req, res, next);
})

// Approve
router.use(/\/approve\/sprint-([0-99]+)/, (req, res, next) => {
  require(`./views/approve/sprint-${req.params[0]}/routes`)(req, res, next);
})

// Reserve
router.use(/\/reserve\/sprint-([0-99]+)/, (req, res, next) => {
  require(`./views/reserve/sprint-${req.params[0]}/routes`)(req, res, next);
})

// Reserve (build)
router.use(/\/reserve\/build-([0-99]+)/, (req, res, next) => {
  require(`./views/reserve/build-${req.params[0]}/routes`)(req, res, next);
})

// Provider account
router.use(/\/provider-account\/version-([0-99]+)/, (req, res, next) => {
  require(`./views/provider-account/version-${req.params[0]}/routes`)(req, res, next);
})

// Employer end-to-end testing
router.get('/reserve/e2e/', (req, res) => {
  res.redirect(`/reserve/sprint-07/research/employer/funding--start`)
})

module.exports = router