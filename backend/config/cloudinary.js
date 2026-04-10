const cloudinary = require('cloudinary').v2
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
  
  let folder = 'genbyte'
  let resource_type = 'auto'
  
  if (file.mimetype.startsWith('image/')) {
    folder = 'genbyte/images'
    resource_type = 'image'
  } else if (file.mimetype === 'application/pdf') {
    folder = 'genbyte/pdfs'
    resource_type = 'raw'  // ← الحل هنا
  }
  
  return {
    folder: folder,
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png', 'gif'],
    resource_type: resource_type,
    public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\-]/g, '_')}`
  }
}
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  },
  fileFilter: (req, file, cb) => {
    console.log(`🔍 File filter - Name: ${file.originalname}, Type: ${file.mimetype}`)
    
    // Allowed mime types
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/jpg']
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      console.error(`❌ File type not allowed: ${file.mimetype}`)
      cb(new Error(`File type not allowed: ${file.mimetype}`))
    }
  }
})

module.exports = { cloudinary, upload }