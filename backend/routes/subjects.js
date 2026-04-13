const router = require('express').Router()
const Subject = require('../models/Subject')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const { upload, uploadToCloudinary } = require('../config/cloudinary')

// GET all subjects
router.get('/', async (req, res) => {
  try {
    const { year } = req.query
    const filter = year ? { year } : {}
    const subjects = await Subject.find(filter).lean()
    console.log(`✅ Fetched ${subjects.length} subjects`)
    res.json(subjects)
  } catch (err) {
    console.error('❌ Fetch subjects error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// ADD subject (admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.create(req.body)
    console.log(`✅ Subject created: ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Create subject error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// DELETE subject (admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id)
    console.log(`✅ Subject deleted: ${req.params.id}`)
    res.json({ msg: 'Deleted' })
  } catch (err) {
    console.error('❌ Delete subject error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// UPLOAD file (summary or exam)
router.post('/:id/upload', auth, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const { type, title } = req.body

    if (!type || !title)
      return res.status(400).json({ msg: 'Missing type or title' })

    if (!req.file)
      return res.status(400).json({ msg: 'No file uploaded' })

    // ✅ رفع على Cloudinary
    const cloudResult = await uploadToCloudinary(req.file)
    const url = cloudResult.secure_url

    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    if (type === 'summary') subject.summaries.push({ title, url })
    else if (type === 'exam') subject.exams.push({ title, url })
    else return res.status(400).json({ msg: 'Type must be summary or exam' })

    await subject.save()
    console.log(`✅ ${type} uploaded to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Upload error:', err.message)
    res.status(500).json({ msg: 'Upload failed: ' + err.message })
  }
})

// DELETE file from subject (summary or exam)
router.delete('/:id/file', auth, isAdmin, async (req, res) => {
  try {
    const { type, fileUrl } = req.body
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    if (type === 'summary')
      subject.summaries = subject.summaries.filter(s => s.url !== fileUrl)
    else if (type === 'exam')
      subject.exams = subject.exams.filter(e => e.url !== fileUrl)
    else
      return res.status(400).json({ msg: 'Type must be summary or exam' })

    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// ADD YouTube video
router.post('/:id/video', auth, isAdmin, async (req, res) => {
  try {
    const { title, url } = req.body
    if (!title || !url) return res.status(400).json({ msg: 'Title and URL required' })

    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    subject.videos.push({ title, url })
    await subject.save()
    console.log(`✅ Video added to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Add video error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// DELETE video
router.delete('/:id/video', auth, isAdmin, async (req, res) => {
  try {
    const { videoUrl } = req.body
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    subject.videos = subject.videos.filter(v => v.url !== videoUrl)
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// UPDATE subject image
router.post('/:id/image', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No image uploaded' })

    const cloudResult = await uploadToCloudinary(req.file)
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { image: cloudResult.secure_url },
      { new: true }
    )
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    console.log(`✅ Image updated for subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Image upload error:', err.message)
    res.status(500).json({ msg: 'Image upload failed: ' + err.message })
  }
})

// ADD assignment
router.post('/:id/assignment', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body
    if (!title) return res.status(400).json({ msg: 'Assignment title is required' })

    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    subject.assignments.push({
      id: Date.now().toString(),
      title,
      description: description || '',
      dueDate: dueDate || 'TBA',
      createdAt: new Date()
    })
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// DELETE assignment
router.delete('/:id/assignment/:assignmentId', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    subject.assignments = subject.assignments.filter(a => a.id !== req.params.assignmentId)
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// ADD link
router.post('/:id/link', auth, isAdmin, async (req, res) => {
  try {
    const { name, url, icon } = req.body
    if (!name || !url) return res.status(400).json({ msg: 'Name and URL required' })

    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    subject.links.push({
      id: Date.now().toString(),
      name, url,
      icon: icon || '🔗',
      createdAt: new Date()
    })
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// DELETE link
router.delete('/:id/link/:linkId', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })

    subject.links = subject.links.filter(l => l.id !== req.params.linkId)
    await subject.save()
    res.json(subject)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router
