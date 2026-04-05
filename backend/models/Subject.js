const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  credits: { type: String },
  year: { type: String, required: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: 'rgba(129,140,248,.12)' },
  summaries: [{ title: String, url: String }],
  exams: [{ title: String, url: String }],
  videos: [{ title: String, url: String }]
}, { timestamps: true })

module.exports = mongoose.model('Subject', subjectSchema)