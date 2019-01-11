const express = require('express')
const router = new express.Router()

// provider
router.use(/\/provider/, (req, res, next) => {
  require(`./provider/routes`)(req, res, next);
})

// employer 
router.use(/\/employer/, (req, res, next) => {
  require(`./employer/routes`)(req, res, next);
})

module.exports = router