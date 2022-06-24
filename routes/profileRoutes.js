const { Router } = require('express')
const router = Router()
const { getProfilePage } = require('../controllers/profileControllers')

router.get('/:username', getProfilePage)

module.exports = router