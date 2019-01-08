const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/${req.featureVersion}/start`)
})

module.exports = router