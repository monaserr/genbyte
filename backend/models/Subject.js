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
  }],
  assignments: [{
    id: { type: String, default: () => Date.now().toString() },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  links: [{
    id: { type: String, default: () => Date.now().toString() },
    name: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: '🔗' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

module.exports = mongoose.model('Subject', subjectSchema)