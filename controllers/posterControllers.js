const Poster = require('../models/posterModel')
const User = require('../models/userModel')
const filtering = require('../utils/filtering')
//@route    GET/poster
//@desc     get all posters
//access    Public
const getPostersPage = async (req, res) => {
  try {

   const pagelimit = 10
   const limit = parseInt(req.query.limit)
   const page = parseInt(req.query.page)
   const total = await Poster.countDocuments()

  //  Redirect if queries [page, pagelimit] doesn't exist
  if(req.url === '/'){
    return res.redirect(`?page=1&limit=${pagelimit}`)
  }

    if (req.query.search) {
      const { search } = req.query
      search.toLowerCase()
      const posters = await Poster.find({
        title: {
          $regex: search
        }
      }).lean()

      return res.status(200).render('poster/searchResults', {
        title: "Search results",
        posters: posters.reverse(),
        user: req.session.user,
        querySearch: req.query.search,
        url: process.env.URL
      })
    }

    if (!req.query.page || !req.query.limit) {
      const { category, from, to, region } = req.query
      // $gte $lte $gt $lt
      const filterings = filtering(category, from, to, region)
      const posters = await Poster.find(filterings).lean()

      return res.render('poster/searchResults', {
        title: "Search results",
        posters: posters.reverse(),
        user: req.session.user,
        url: process.env.URL
      })
    }

    const posters = await Poster
    .find()
    .skip((page * limit) - limit)
    .limit(limit)
    .lean()
     return res.render('poster/posters', {
      title: "Poster page",
      posters: posters.reverse(),
      pagination: {
        page,
        limit,
        pageCount: Math.ceil(total/limit)
      },
      user: req.session.user,
      url: process.env.URL
    });
  } catch (err) {
    console.log(err);
  }
}

//@route    GET/posters/:id
//@desc     get one poster by id
//access    Public
const getOnePoster = async (req, res) => {
  const poster = await Poster
    .findByIdAndUpdate(req.params.id, { $inc: { visits: 1 } }, { new: true })
    .populate('author')
    .lean()
  return res.render('poster/one', {
    title: poster.title,
    poster,
    user: req.session.user,
    author: poster.author,
    url: process.env.URL
  });
}

const addNewPosterPage = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id).lean()
    return res.render('poster/add-poster', {
      title: "Yangi e'lon qo'shish",
      url: process.env.URL,
      poster
    })
  } catch (err) {
    console.log(err);
  }
}

//@route  POST /posters/add
//desc    Add new poster
//access  Private
const addNewPoster = async (req, res) => {
  try {
    const newPoster = new Poster({
      title: req.body.title.toLowerCase(),
      amount: req.body.amount,
      image: 'uploads/' + req.file.filename,
      category: req.body.category,
      region: req.body.region,
      description: req.body.description,
      author: req.session.user._id
    })

    await User.findByIdAndUpdate(
      req.session.user._id,
      { $push: { posters: newPoster._id } },
      { new: true, upsert: true })

    await newPoster.save((err, posterSaved) => {
      if (err) throw err
      const posterId = posterSaved._id
      res.redirect('/posters/' + posterId)
    })
  } catch (err) {
    console.log(err);
  }
}

//@route   /posters/:id/edit
//desc    Get edit poster by id
//access  Private(Own)
const getEditPosterPage = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id).lean()
   return res.render('poster/edit-poster', {
      title: "Edit page",
      url: process.env.URL,
      poster
    })
  } catch (err) {
    console.log(err);
  }
}

//@route   /posters/:id/edit
//desc    edit poster by id
//access  Private
const updatePoster = async (req, res) => {
  try {
    const editedPoster = {
      title: req.body.title,
      amount: req.body.amount,
      image: 'uploads/' + req.file.filename,
      region: req.body.region,
      category: req.body.category,
      description: req.body.description
    }
    await Poster.findByIdAndUpdate(req.params.id, editedPoster)
    res.redirect('/posters')
  } catch (error) {
    console.log(error);
  }
}

//@route   /posters/:id/delete
//desc    delete poster by id
//access  Private
const deletePoster = async (req, res) => {
  try {
    await Poster.findByIdAndRemove(req.params.id)
    res.redirect('/posters')
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getPostersPage,
  getOnePoster,
  addNewPosterPage,
  addNewPoster,
  updatePoster,
  deletePoster,
  getEditPosterPage
}
