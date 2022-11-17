const express = require('express')
const multer = require('multer')
const logger = require("../config/logger");

const router = express.Router()
const MAX_SIZE = 70 * 1024 * 1024

const {
  uploadDoc,
  listDocs,
  getDocumentDetails,
  deleteDoc,
} = require('../controllers/document')
const { storage } = require('../middlewares/s3provider')
const db = require("../models/index");
const User = db.users
const authorizeToken = require('../middlewares/auth')(User,logger);

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
})
router.post('/v1/documents/', authorizeToken, upload.array('document'), uploadDoc)
router.get('/v1/documents/', authorizeToken, listDocs)
router.get('/v1/documents/:doc_id', authorizeToken, getDocumentDetails)
router.delete('/v1/documents/:doc_id', authorizeToken, deleteDoc)

module.exports = router