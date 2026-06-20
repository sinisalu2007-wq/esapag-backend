const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  referenceNumber: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  streamOrCombination: { type: String, default: null },
  student: {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    district: { type: String, required: true },
    sector: { type: String, required: true },
    prevSchool: { type: String, required: true }
  },
  documents: { type: Map, of: String }, // Stores document ID -> uploaded file path mappings
  guardian: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    relation: { type: String, required: true }
  },
  payment: {
    method: { type: String, required: true },
    txnId: { type: String, required: true, unique: true },
    amountRWF: { type: Number, default: 5000 },
    isVerified: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['pending', 'verified', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);