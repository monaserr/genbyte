/*const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

console.log('🔧 Cloudinary config loading...')
console.log('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '❌ Missing')
console.log('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '❌ Missing')
console.log('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '❌ Missing')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('✅ Cloudinary configured')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {
    console.log(`📁 Uploading file: ${file.originalname}`)

    const isPDF = file.mimetype === 'application/pdf'

    return {
      folder: 'genbyte',

      // 🔥 أهم تعديل هنا
      resource_type: isPDF ? 'raw' : 'image',

      allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'gif'],

      public_id: `${Date.now()}_${file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_\-]/g, '_')}`
    }
  }
})

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 100 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    console.log(`🔍 File filter - Name: ${file.originalname}, Type: ${file.mimetype}`)

    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg'
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      console.error(`❌ File type not allowed: ${file.mimetype}`)
      cb(new Error(`File type not allowed: ${file.mimetype}`))
    }
  }
})

module.exports = { cloudinary, upload }*/

const cloudinary = require('cloudinary').v2
const multer = require('multer')
const fs = require('fs')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// multer temp storage
const upload = multer({
  dest: 'uploads/',
})

// upload function (FIXED)
const uploadToCloudinary = async (file) => {
  if (!file) throw new Error('No file provided')

  const isPDF = file.mimetype === 'application/pdf'

  const originalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')

  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'genbyte',
    resource_type: isPDF ? 'raw' : 'image',
    access_mode: 'public',
    use_filename: true,
    unique_filename: true,
    public_id: `${Date.now()}_${originalName}`
  })

  // delete temp file
  fs.unlinkSync(file.path)

  return result
}

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary
}