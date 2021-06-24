const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'medicaApp69@gmail.com',
      pass: 'empresaurios'
    }
  });

  module.exports =transporter;