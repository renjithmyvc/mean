var config = {};

config.admin = {
  email: 'vs3.phani@gmail.com'
};

config.mailerOptions = {
  from: 'vs3.phani@zoho.com',
  host: 'smtp.zoho.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'vs3.phani@zoho.com',
    pass: 'tvs3.pk44'
  }
};

module.exports = config;
