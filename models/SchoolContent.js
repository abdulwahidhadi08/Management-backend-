const mongoose = require('mongoose');

const SchoolContentSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    default: 'Horizon International School'
  },
  tagline: {
    type: String,
    default: 'Inspiring Minds. Building Character. Shaping Futures.'
  },
  logo: {
    type: String, // Base64
    default: ''
  },
  heroHeading: {
    type: String,
    default: 'Welcome to Horizon International School'
  },
  heroDescription: {
    type: String,
    default: 'A premium educational institution dedicated to cultivating academic excellence, personal growth, and integrity in our students.'
  },
  heroImage: {
    type: String, // Base64
    default: ''
  },
  aboutHeading: {
    type: String,
    default: 'Nurturing the Leaders of Tomorrow'
  },
  aboutDescription: {
    type: String,
    default: 'Founded with a vision to provide quality education, Horizon International School combines rigorous academics with character development. Our modern campus, dedicated faculty, and vibrant student community create an environment where every student can excel.'
  },
  yearsOfExcellence: {
    type: Number,
    default: 25
  },
  principalName: {
    type: String,
    default: 'Dr. Evelyn Carter'
  },
  principalDesignation: {
    type: String,
    default: 'Principal & Academic Director'
  },
  principalMessage: {
    type: String,
    default: 'Welcome to our digital portal. At Horizon, we believe in a holistic approach to education. We inspire our students to explore their interests, develop critical thinking, and build strong moral character. Together, we shape futures.'
  },
  principalPhoto: {
    type: String, // Base64
    default: ''
  },
  headmasterName: {
    type: String,
    default: 'Mr. Arthur Pendelton'
  },
  headmasterMessage: {
    type: String,
    default: 'Our administrative and management portal is designed to keep our school community connected. We invite parents and students to actively engage with academic schedules, events, and announcements here.'
  },
  headmasterPhoto: {
    type: String, // Base64
    default: ''
  },
  address: {
    type: String,
    default: '102 Academic Boulevard, Education District, NY 10001'
  },
  phone: {
    type: String,
    default: '+1 (555) 123-4567'
  },
  email: {
    type: String,
    default: 'info@horizonschool.com'
  },
  facebookUrl: {
    type: String,
    default: 'https://facebook.com'
  },
  twitterUrl: {
    type: String,
    default: 'https://twitter.com'
  },
  instagramUrl: {
    type: String,
    default: 'https://instagram.com'
  },
  linkedinUrl: {
    type: String,
    default: 'https://linkedin.com'
  }
}, { timestamps: true });

module.exports = mongoose.model('SchoolContent', SchoolContentSchema);
