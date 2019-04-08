const express = require('express')
const router = new express.Router()

router.use('/', (req, res, next) => {
  req.feature = req.originalUrl.split('/')[1] + '/' + req.originalUrl.split('/')[2] + '/' + req.originalUrl.split('/')[3] + '/' + req.originalUrl.split('/')[4]
  res.locals.feature = req.feature
  next()
})

// Route index page
router.get('/', function (req, res) {
  res.redirect('../')
})

// provider
router.use(/\/research\/provider/, (req, res, next) => {
  require(`./research/provider/routes`)(req, res, next);
})

// employer approvals
router.use('/research/employers/employer-approve', (req, res, next) => {
  require(`./research/employers/employer-approve/routes`)(req, res, next);
})

// stop apprentice
router.use('/research/employers/stop-apprentice', (req, res, next) => {
  require(`./research/employers/stop-apprentice/routes`)(req, res, next);
})

// employers manage apprentices
router.use('/research/employers/manage-your-apprentices', (req, res, next) => {
  require(`./research/employers/manage-your-apprentices/routes`)(req, res, next);
})

// providers manage apprentices
router.use('/research/providers/manage-your-apprentices', (req, res, next) => {
  require(`./research/providers/manage-your-apprentices/routes`)(req, res, next);
})

// employer 
router.use('/build/providers/', (req, res, next) => {
  require(`./build/providers/routes`)(req, res, next);
})

// employer 
router.use('/build/employers/', (req, res, next) => {
  require(`./build/employers/routes`)(req, res, next);
})

module.exports = router