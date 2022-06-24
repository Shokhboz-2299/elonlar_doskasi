const { Router } = require('express')
const router = Router()
const { getHomePage } = require('../controllers/homeControllers')

router.get('/', getHomePage)

module.exports = router