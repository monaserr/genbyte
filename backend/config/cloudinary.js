const cloudinary = require('cloudinary').v2
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ✅ multer — temp storage على disk
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/jpg']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`))
    }
  }
})

// ✅ رفع على Cloudinary بعد ما multer يحفظ الملف مؤقتاً
const uploadToCloudinary = async (file) => {
  if (!file) throw new Error('No file provided')

  const isPDF = file.mimetype === 'application/pdf'
  const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_')

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'genbyte',
      resource_type: isPDF ? 'raw' : 'image',
      access_mode: 'public',
      use_filename: true,
      unique_filename: true,
      public_id: `${Date.now()}_${safeName}`
    })
    return result
  } finally {
    // ✅ دايماً امسح الـ temp file حتى لو في error
    try { fs.unlinkSync(file.path) } catch {}
  }
}

module.exports = { cloudinary, upload, uploadToCloudinary }
