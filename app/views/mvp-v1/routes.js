const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
	res.redirect(`/${req.feature}/start`)
})

module.exports = router