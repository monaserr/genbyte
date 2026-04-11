/*const router = require('express').Router()
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
    console.log('\n📤 ===== UPLOAD REQUEST =====')
    console.log('Subject ID:', req.params.id)
    console.log('Body:', req.body)
    console.log('File received:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: req.file.secure_url
    } : 'NO FILE')
    console.log('===========================\n')
    
    const { type, title } = req.body
    
    // Validate inputs
    if (!type || !title) {
      console.error('❌ Missing required fields - type:', type, 'title:', title)
      return res.status(400).json({ msg: 'Missing type or title field' })
    }
    
    if (!req.file) {
      console.error('❌ No file uploaded')
      return res.status(400).json({ msg: 'No file uploaded - please select a PDF' })
    }
    
    // Get file URL from Cloudinary response
    const url = req.file.secure_url || req.file.path
    
    if (!url) {
      console.error('❌ No URL from Cloudinary:', req.file)
      return res.status(500).json({ msg: 'Failed to upload to cloud storage' })
    }
    
    console.log(`✓ File URL: ${url}`)
    
    // Find and update subject
    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      console.error('❌ Subject not found:', req.params.id)
      return res.status(404).json({ msg: 'Subject not found' })
    }
    
    console.log(`✓ Subject found: ${subject.name}`)
    
    // Add to appropriate array
    if (type === 'summary') {
      subject.summaries.push({ title, url })
      console.log(`✓ Added summary: "${title}"`)
    }
    else if (type === 'exam') {
      subject.exams.push({ title, url })
      console.log(`✓ Added exam: "${title}"`)
    }
    else {
      console.error('❌ Invalid type:', type)
      return res.status(400).json({ msg: 'Type must be "summary" or "exam"' })
    }
    
    // Save to MongoDB
    await subject.save()
    console.log(`✅ Successfully saved ${type} to subject ${subject._id}\n`)
    
    res.json(subject)
  } catch (err) {
    console.error('\n❌ ===== UPLOAD ERROR =====')
    console.error('Error:', err.message)
    console.error('Stack:', err.stack)
    console.error('============================\n')
    
    res.status(500).json({ 
      msg: 'Upload failed: ' + err.message,
      error: err.message
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

// ============================================================
// ASSIGNMENTS ENDPOINTS
// ============================================================

// ADD assignment to subject (admin only)
router.post('/:id/assignment', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body
    if (!title) {
      return res.status(400).json({ msg: 'Assignment title is required' })
    }
    
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    const assignment = {
      id: Date.now().toString(),
      title,
      description: description || '',
      dueDate: dueDate || 'TBA',
      createdAt: new Date()
    }
    
    subject.assignments.push(assignment)
    await subject.save()
    console.log(`✅ Assignment added to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Add assignment error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// DELETE assignment from subject (admin only)
router.delete('/:id/assignment/:assignmentId', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    subject.assignments = subject.assignments.filter(a => a.id !== req.params.assignmentId)
    await subject.save()
    console.log(`✅ Assignment deleted from subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Delete assignment error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// ============================================================
// LINKS ENDPOINTS
// ============================================================

// ADD link to subject (admin only)
router.post('/:id/link', auth, isAdmin, async (req, res) => {
  try {
    const { name, url, icon } = req.body
    if (!name || !url) {
      return res.status(400).json({ msg: 'Link name and URL are required' })
    }
    
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    const link = {
      id: Date.now().toString(),
      name,
      url,
      icon: icon || '🔗',
      createdAt: new Date()
    }
    
    subject.links.push(link)
    await subject.save()
    console.log(`✅ Link added to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Add link error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// DELETE link from subject (admin only)
router.delete('/:id/link/:linkId', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    subject.links = subject.links.filter(l => l.id !== req.params.linkId)
    await subject.save()
    console.log(`✅ Link deleted from subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Delete link error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router*/

const router = require('express').Router()
const Subject = require('../models/Subject')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const { upload, uploadToCloudinary } = require('../config/cloudinary')

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
    console.log('\n📤 ===== UPLOAD REQUEST =====')
    console.log('Subject ID:', req.params.id)
    console.log('Body:', req.body)
    console.log('File received:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: req.file.secure_url
    } : 'NO FILE')
    console.log('===========================\n')
    
    const { type, title } = req.body
    
    // Validate inputs
    if (!type || !title) {
      console.error('❌ Missing required fields - type:', type, 'title:', title)
      return res.status(400).json({ msg: 'Missing type or title field' })
    }
    
    if (!req.file) {
      console.error('❌ No file uploaded')
      return res.status(400).json({ msg: 'No file uploaded - please select a PDF' })
    }
    
    // Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...')
    const cloudResult = await uploadToCloudinary(req.file)
    const url = cloudResult.secure_url
    console.log(`✓ File URL: ${url}`)
    
    // Find and update subject
    const subject = await Subject.findById(req.params.id)
    if (!subject) {
      console.error('❌ Subject not found:', req.params.id)
      return res.status(404).json({ msg: 'Subject not found' })
    }
    
    console.log(`✓ Subject found: ${subject.name}`)
    
    // Add to appropriate array
    if (type === 'summary') {
      subject.summaries.push({ title, url })
      console.log(`✓ Added summary: "${title}"`)
    }
    else if (type === 'exam') {
      subject.exams.push({ title, url })
      console.log(`✓ Added exam: "${title}"`)
    }
    else {
      console.error('❌ Invalid type:', type)
      return res.status(400).json({ msg: 'Type must be "summary" or "exam"' })
    }
    
    // Save to MongoDB
    await subject.save()
    console.log(`✅ Successfully saved ${type} to subject ${subject._id}\n`)
    
    res.json(subject)
  } catch (err) {
    console.error('\n❌ ===== UPLOAD ERROR =====')
    console.error('Error:', err.message)
    console.error('Stack:', err.stack)
    console.error('============================\n')
    
    res.status(500).json({ 
      msg: 'Upload failed: ' + err.message,
      error: err.message
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

// ============================================================
// ASSIGNMENTS ENDPOINTS
// ============================================================

// ADD assignment to subject (admin only)
router.post('/:id/assignment', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body
    if (!title) {
      return res.status(400).json({ msg: 'Assignment title is required' })
    }
    
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    const assignment = {
      id: Date.now().toString(),
      title,
      description: description || '',
      dueDate: dueDate || 'TBA',
      createdAt: new Date()
    }
    
    subject.assignments.push(assignment)
    await subject.save()
    console.log(`✅ Assignment added to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Add assignment error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// DELETE assignment from subject (admin only)
router.delete('/:id/assignment/:assignmentId', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    subject.assignments = subject.assignments.filter(a => a.id !== req.params.assignmentId)
    await subject.save()
    console.log(`✅ Assignment deleted from subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Delete assignment error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// ============================================================
// LINKS ENDPOINTS
// ============================================================

// ADD link to subject (admin only)
router.post('/:id/link', auth, isAdmin, async (req, res) => {
  try {
    const { name, url, icon } = req.body
    if (!name || !url) {
      return res.status(400).json({ msg: 'Link name and URL are required' })
    }
    
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    const link = {
      id: Date.now().toString(),
      name,
      url,
      icon: icon || '🔗',
      createdAt: new Date()
    }
    
    subject.links.push(link)
    await subject.save()
    console.log(`✅ Link added to subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Add link error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

// DELETE link from subject (admin only)
router.delete('/:id/link/:linkId', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
    if (!subject) return res.status(404).json({ msg: 'Subject not found' })
    
    subject.links = subject.links.filter(l => l.id !== req.params.linkId)
    await subject.save()
    console.log(`✅ Link deleted from subject ${subject._id}`)
    res.json(subject)
  } catch (err) {
    console.error('❌ Delete link error:', err.message)
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router