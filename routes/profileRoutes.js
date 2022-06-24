const { Router } = require('express')
const router = Router()
const { userProfilePage } = require('../controllers/profileControllers')

router.get('/:username', userProfilePage)

module.exports = router