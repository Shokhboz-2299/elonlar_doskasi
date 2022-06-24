const { Router } = require('express')
const router = Router()
const { 
  getPostersPage, 
  addNewPosterPage,
  addNewPoster, 
  getOnePoster,
  getEditPosterPage,
  updatePoster,
  deletePoster
} = require('../controllers/posterControllers')

const upload = require('../utils/fileUpload')
router.get('/', getPostersPage)
router.get('/add', addNewPosterPage)
router.get('/:id', getOnePoster)
router.get('/:id/edit', getEditPosterPage)
router.post('/add',upload.single('image'), addNewPoster)
router.post('/:id/edit', updatePoster)
router.post('/:id/delete', deletePoster)

module.exports = router