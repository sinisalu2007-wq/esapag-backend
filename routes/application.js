const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');

// Set up local file storage configuration on your laptop server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporarily saves files into your local uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// The Primary Form Submission Endpoint
router.post('/submit', upload.any(), async (req, res) => {
  try {
    const docPaths = {};
    if (req.files) {
      req.files.forEach(file => {
        docPaths[file.fieldname] = file.path;
      });
    }

    const body = req.body;
    
    // Generate a unique transaction tracking reference number for the school
    const refNumber = 'ESAPAG-' + Date.now().toString().slice(-6);

    const newApplication = new Application({
      referenceNumber: refNumber,
      year: body.year,
      streamOrCombination: body.streamOrCombination || null,
      student: {
        fullName: body.fullName,
        dob: body.dob,
        gender: body.gender,
        district: body.district,
        sector: body.sector,
        prevSchool: body.prevSchool
      },
      documents: docPaths,
      guardian: {
        name: body.gName,
        phone: body.gPhone,
        email: body.gEmail,
        relation: body.gRelation
      },
      payment: {
        method: body.payMethod,
        txnId: body.txnId,
        amountRWF: 5000
      }
    });

    await newApplication.save();
    res.status(201).json({ success: true, referenceNumber: refNumber });
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ success: false, message: 'Database processing error.' });
  }
});

module.exports = router;