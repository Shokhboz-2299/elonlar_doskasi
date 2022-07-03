const User = require('../models/userModel')

//@route    GET/profile/:username
//@desc    Users profile page
//access    Private

const userProfilePage = async (req, res) => {
try {
  const userProfile = await User
  .findOne({username: req.params.username})
  .populate('posters')
  .lean()
  if(!userProfile) throw new Error('Bunday foydalanuvchi mavjud emas')

  let isMe = false
  if(req.sesion.user){
    isMe = userProfile._id == req.session.user._id.toString()
  }
  res.render('user/profile', {
    title: `${userProfile.username}`,
    user: req.session.user,
    userProfile,
    isMe,
    posters:userProfile.posters,
    isAuth: req.session.isLogged,
    url: process.env.URL
  })
} catch (err) {
  console.log(err);
}
}

module.exports = { userProfilePage}