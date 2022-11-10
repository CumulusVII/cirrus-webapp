const { v4: uuidv4 } = require("uuid");
const logger = require("../config/logger");
const dbConfig = require('../config/config');
const SDC = require('statsd-client');
const sdc = new SDC({host: dbConfig.METRICS_HOSTNAME, port: dbConfig.METRICS_PORT});
const { s3Uploadv2, s3Deletev2 } = require("../middlewares/s3provider");
const db = require("../models");

const User = db.users;
const Document = db.document;

const uploadDoc = async (req, res) => {
  sdc.increment("Uploading Documents");
  const {protocol,method,hostname,originalUrl} = req
  const headers = {...req.headers}
  const data = {protocol,method,hostname,originalUrl,headers}
  logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`, {data});
  try {
    const userData = await User.findOne({
      where: {
        username: global.username,
      },
    });
    const { id } = userData;
    logger.info("Invalid request body for user object");
    if (req.files.length === 0)
      return res.status(403).send("check the file to upload!");
    const file = req.files[0].originalname;

    const exists = await Document.findOne({
      where: {
        name: file,
        user_id: id,
      },
    });
    if (exists) {
      logger.info("File Already Exists");
      return res.status(403).send("File Already Exists");
    }
    const results = await s3Uploadv2(req.files);
    if (results.length === 0)
      return res
        .status(400)
        .send({ status: "Bad request, check files to upload!!!" });
    const documents = results.map((result) => {
      return Document.build({
        doc_id: uuidv4(),
        user_id: id,
        name: result.Key.split("/")[1],
        date_created: new Date(),
        s3_bucket_path: result.Location,
      });
    });
    try {
      await documents.map((document) => document.save());
    } catch (err) {
      return res.status(400).send({ message: "Bad Request" });
    }
    return res.status(201).json(documents);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ status: "Bad Request, check file to upload!" });
  }
};


const listDocs = async (req, res) => {
  sdc.increment("List Documents");

  const {protocol,method,hostname,originalUrl} = req
  const headers = {...req.headers}
  const data = {protocol,method,hostname,originalUrl,headers}
  logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`,{data});
  try {
    const userData = await User.findOne({
      where: {
        username: global.username,
      },
    });
    const { id } = userData;
    const documents = await Document.findAll({
      where: {
        user_id: id,
      },
    });
    const result = documents.map((document) => {
      return {
        doc_id: document.doc_id,
        user_id: document.user_id,
        name: document.name,
        date_created: document.date_created,
        s3_bucket_path: document.s3_bucket_path,
      };
    });
    return res.status(201).json(result);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ status: "Bad Request, check file to upload!" });
  }
};


const getDocumentDetails = async (req, res) => {
  sdc.increment("Get Documents Details");
  const {protocol,method,hostname,originalUrl} = req
  const headers = {...req.headers}
  const data = {protocol,method,hostname,originalUrl,headers}
  logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`, {data});
  try {
    const userData = await User.findOne({
      where: {
        username: global.username,
      },
    });
    const { id } = userData;
    const { doc_id } = req.params;
    const validDocID =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        doc_id
      );
    if (!validDocID) return res.status(403).send("Forbidden");
    const document = await Document.findByPk(doc_id);
    if (document === null)
      return res.status(404).send({ message: "Not Found!" });
    const { user_id } = document;
    if (id === user_id) return res.status(200).send(document);
    return res.status(401).send({ message: "Unauthorized" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ status: "Bad Request, check file to upload!" });
  }
};

const deleteDoc = async (req, res) => {
  sdc.increment("Delete Documents");
  const {protocol,method,hostname,originalUrl} = req
  const headers = {...req.headers}
  const data = {protocol,method,hostname,originalUrl,headers}
  logger.info(`Request for ${method} ${protocol}://${hostname}${originalUrl}`, {data});
  try {
    const userData = await User.findOne({
      where: {
        username: global.username,
      },
    });
    const { id } = userData;
    const { doc_id } = req.params;
    const validDocID =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        doc_id
      );
    if (!validDocID) return res.status(403).send("Forbidden");
    const document = await Document.findByPk(doc_id);
    if (document === null)
      return res.status(404).send({ message: "Not Found!" });
    const { name, user_id } = document;
    try {
      if (id === user_id) {
        await s3Deletev2(name);
        await document.destroy();
      } else {
        return res.status(401).send({ message: "Unauthorized!" });
      }
    } catch (err) {
      console.log(err);
      logger.warn(`Invalid request ${method} ${protocol}://${hostname}${originalUrl}`);
      return res.status(400).send({ status: "Bad request!" });
    }
    return res.status(204).send();
  } catch (err) {
    console.log(err);
    return res.status(400).send({ status: "Bad Request!" });
  }
};
module.exports = {
  uploadDoc,
  listDocs,
  getDocumentDetails,
  deleteDoc,
};
