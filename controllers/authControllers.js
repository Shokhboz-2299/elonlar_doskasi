const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

//@route    GET/auth/login
//@desc     get login page
//access    Public
const getLoginPage = (req,res) => {
  if(!req.session.isLogged){
    res.render('auth/login', {
      title:"Login",
      url: process.env.URL
    })
  }
}

//@route    GET/auth/signup
//@desc     get register page
//access    Public
const getRegisterPage = (req,res) => {
  if(!req.sesion.isLogged){
    res.render('auth/signup', {
      title:"Registration",
      url: process.env.URL
    })
  }
}

//@route    POST/auth/signup
//@desc     Register new user to database
//access    Public

const registerNewUser = async (req,res) => {
  try {
    const { email, username, phone, password, password2 } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userExist = await User.findOne({email})

    if(userExist){
      return res.redirect('/auth/signup')
    }
    if(password !== password2){
      return res.redirect('/auth/signup')
    }

    await User.create({
      email,
      username,
      phone,
      password:hashedPassword
    })

    return res.redirect('/auth/login')

  } catch (err) {
    console.log(err);
  }
}

//@route    POST/auth/login
//@desc    login user to website
//access    Public
const loginUser = async(req, res) => {
  try {
    const userExist = await User.findOne({email: req.body.email})
    if(userExist){
      const matchPassword = await bcrypt.compare(req.body.password, userExist.password)
      if(matchPassword){
        req.session.user = userExist
        req.session.isLogged = true
        req.session.save(err => {
          if(err) throw err
          res.redirect('/profile/' + req.session.user.username)
        })
      }
      else{
        res.redirect('/auth/login')
      }
    }
    else{
      res.redirect('/auth/login')
    }
  } catch (err) {
    console.log(err);
  }
}

//@route    GET/auth/logout
//@desc    logout user
//access    Private
const logout = (req,res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

module.exports = {
  getLoginPage,
  getRegisterPage,
  registerNewUser,
  loginUser,
  logout
}