require('dotenv').config()
const multer = require('multer')
const { S3 } = require('aws-sdk')
const SDC = require('statsd-client')
const db = require('../models')
const dbConfig = require('../config/config')

const sdc = new SDC({
  host: dbConfig.HOST,
  port: dbConfig.PORT,
})

const User = db.users
const Document = db.document

const storage = multer.memoryStorage()


const s3Uploadv2 = async (files) => {
  const s3 = new S3()
  const userData = await User.findOne({
    where: {
      username: global.username,
    },
  })
  const { id } = userData
  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${id}/${file.originalname}`,
      Body: file.buffer,
    }
  })

  const res = await Promise.all(
    params.map((param) => s3.upload(param).promise())
  )
  return res
}

// const s3CheckDocv2 = async (fileName) => {
//   const s3 = new S3()
//   const userData = await User.findOne({
//     where: {
//       username: global.username,
//     },
//   })
//   const { id } = userData
//   const param = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `${id}/${fileName}`,
//   }
//   const res = await s3.deleteObject(param).promise()
//   return res
// }

const s3Deletev2 = async (fileName) => {
  const s3 = new S3()
  const userData = await User.findOne({
    where: {
      username: global.username,
    },
  })
  const { id } = userData
  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${id}/${fileName}`,
  }
  const res = await s3.deleteObject(param).promise()
  return res
}

module.exports = {
  storage,
  s3Uploadv2,
  s3Deletev2,
  // s3CheckDocv2,
}
