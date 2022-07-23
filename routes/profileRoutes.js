const { Router } = require('express')
const router = Router()
const { 
  userProfilePage, 
  updateUserPage, 
  updateUser 
} = require('../controllers/profileControllers')

router.get('/change', updateUserPage)
router.post('/change', updateUser)
router.get('/:username', userProfilePage)

module.exports = router