//@route    GET/
//@desc     get home page
//access     Public

const getHomePage = (req,res) => {
  res.render('home', {
    title:"Home page",
    url: process.env.URL
  });
}

module.exports = {
  getHomePage
}