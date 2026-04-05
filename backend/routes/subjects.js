const router = require('express').Router()
const Subject = require('../models/Subject')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const { upload } = require('../config/cloudinary')

// GET all subjects
router.get('/', auth, async (req, res) => {
  try {
    const { year } = req.query
    const filter = year ? { year } : {}
    const subjects = await Subject.find(filter)
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// ADD subject (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.create(req.body)
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// DELETE subject (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Deleted' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// UPLOAD file to subject (summary or exam)
router.post('/:id/upload', auth, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const { type, title } = req.body
    const url = req.file.path
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    if (type === 'summary') subject.summaries.push({ title, url })
    else if (type === 'exam') subject.exams.push({ title, url })
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// ADD YouTube video link
router.post('/:id/video', auth, isAdmin, async (req, res) => {
  try {
    const { title, url } = req.body
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    subject.videos.push({ title, url })
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// UPDATE subject image
router.post('/:id/image', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      { new: true }
    )
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router