const { Router } = require('express')
const router = Router()
const { 
  getLoginPage, 
  getRegisterPage, 
  registerNewUser,
  loginUser
 } = require('../controllers/authControllers')

router.get('/login', getLoginPage)
router.get('/signup', getRegisterPage)
router.post('/signup', registerNewUser)
router.post('/login', loginUser)

module.exports = router