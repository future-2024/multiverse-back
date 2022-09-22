const aws = require("aws-sdk");
const { PBKDF2 } = require("crypto-js");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { v4: uuidv4 } = require("uuid");
const s3 = new aws.S3();

s3.config.update({
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  region: "us-east-2",
});

//console.log(s3.config.credentials)
const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};
const fileFilterpdf = (req, file, cb) => {
  console.log('mime', file.mimetype);
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "multiverse-files",
    key: function (req, file, cb) {
      var filename = file.originalname;
      var ext = filename.substring(filename.indexOf("."));
      const newId = uuidv4();
      cb(null, Date.now().toString() + newId + ext);
    },
  }),
});

const uploadpdf = multer({
  fileFilterpdf,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "multiverse-files",
    key: function (req, file, cb) {
      console.log('buffer');
      var filename = file.originalname;
      var ext = filename.substring(filename.indexOf("."));
      const newId = uuidv4();
      cb(null, Date.now().toString() + newId + ext);
    }
  }),
});

module.exports = { upload, uploadpdf };
