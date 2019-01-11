const express = require('express')
const router = new express.Router()

router.use(/\/provider/, (req, res, next) => {
  require(`./provider/routes`)(req, res, next);
})

module.exports = router