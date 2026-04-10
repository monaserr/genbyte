const router = require('express').Router()
const Subject = require('../models/Subject')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const { upload } = require('../config/cloudinary')

// GET all subjects (public - guests can see)
router.get('/', async (req, res) => {
  try {
    const { year } = req.query
    console.log(`📖 GET /subjects called - year filter: ${year || 'ALL'}`)
    
    const filter = year ? { year } : {}
    console.log('📋 Query filter:', filter)
    
    const subjects = await Subject.find(filter).lean()
    console.log(`✅ Fetched ${subjects.length} subjects${year ? ` for ${year}` : ''}`)
    
    res.json(subjects)
  } catch (err) {
    console.error('❌ Fetch subjects error:', err.message)
    console.error('❌ Full error:', err)
    res.status(500).json({ msg: err.message, error: err.toString() })
  }
})

// ADD subject (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    console.log('📚 Creating new subject:', req.body.name)
    const subject = await Subject.create(req.body)
    console.log(`✅ Subject created: ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Create subject error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// DELETE subject (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    console.log(`🗑️ Deleting subject: ${req.params.id}`)
    await Subject.findByIdAndDelete(req.params.id)
    console.log(`✅ Subject deleted: ${req.params.id}`)
    res.json({ msg: 'Deleted' })
  } catch (err) {
    console.error('❌ Delete subject error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// UPLOAD file to subject (summary or exam)
router.post('/:id/upload', auth, isAdmin, upload.single('file'), async (req, res) => {
  try {
    console.log('📤 Upload endpoint called for subject:', req.params.id)
    console.log('   req.body:', req.body)
    console.log('   req.file:', req.file ? `✓ File: ${req.file.filename} (${req.file.size} bytes)` : '❌ No file')
    
    const { type, title } = req.body
    
    if (!type || !title) {
      console.error('❌ Missing type or title:', { type, title })
      return res.status(400).json({ msg: 'Missing type or title' })
    }
    
    if (!req.file) {
      console.error('❌ No file in request')
      return res.status(400).json({ msg: 'No file uploaded' })
    }
    
    const url = req.file.path
    console.log(`   ✓ File URL from Cloudinary: ${url}`)
    
    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      console.error('❌ Subject not found:', req.params.id)
      return res.status(404).json({ msg: 'Subject not found' })
    }
    
    console.log(`   ✓ Subject found: ${subject.name}`)
    
    if (type === 'summary') {
      subject.summaries.push({ title, url })
      console.log(`   ✓ Added summary: ${title}`)
    }
    else if (type === 'exam') {
      subject.exams.push({ title, url })
      console.log(`   ✓ Added exam: ${title}`)
    }
    else {
      console.error('❌ Invalid type:', type)
      return res.status(400).json({ msg: 'Invalid type. Must be summary or exam' })
    }
    
    await subject.save()
    console.log(`✅ ${type} uploaded successfully to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Upload file error:', err.message)
    console.error('❌ Full error stack:', err)
    res.status(500).json({ 
      msg: 'Upload failed', 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    })
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
    console.log(`✅ Video added to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Add video error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// UPDATE subject image
router.post('/:id/image', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    console.log('🖼️ Image upload endpoint called')
    console.log('   req.file:', req.file ? `✓ File: ${req.file.filename}` : '❌ No file')
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded' })
    }
    
    console.log(`   ✓ Uploading to subject: ${req.params.id}`)
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { image: req.file.path },
      { new: true }
    )
    
    if (!subject) {
      return res.status(404).json({ msg: 'Subject not found' })
    }
    
    console.log(`✅ Image updated for subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Update image error:', err.message)
    console.error('❌ Full error:', err)
    res.status(500).json({ 
      msg: 'Image upload failed', 
      error: err.message 
    })
  }
})

module.exports = router