const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  credits: { type: String },
  year: { type: String, required: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: 'rgba(129,140,248,.12)' },
  image: { type: String, default: null },
  summaries: [{ 
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  exams: [{ 
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  videos: [{ 
    title: { type: String, required: true },
    url: { type: String, required: true }
  }]
}, { timestamps: true })

module.exports = mongoose.model('Subject', subjectSchema)