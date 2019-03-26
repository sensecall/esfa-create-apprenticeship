const express = require('express')
const router = new express.Router()

router.use('/', (req, res, next) => {
  req.feature = req.originalUrl.split('/')[1] + '/' + req.originalUrl.split('/')[2] + '/' + req.originalUrl.split('/')[3]
  req.sprint = req.originalUrl.split('/')[2]
  res.locals.feature = req.feature
  next()
})


// provider
router.use(/\/employer/, (req, res, next) => {
  require(`./employer/routes`)(req, res, next);
})

// provider
router.use(/\/provider/, (req, res, next) => {
  require(`./provider/routes`)(req, res, next);
})

module.exports = router