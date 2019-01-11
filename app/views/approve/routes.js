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

router.use(/\/sprint-([0-99]+)/, (req, res, next) => {
  require(`./sprint-${req.params[0]}/routes`)(req, res, next);
})

module.exports = router