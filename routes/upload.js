var express = require('express');
var path = require('path');
var router = express.Router();
var bodyparser = require('body-parser');
const multer = require('multer');
const mail = require('../config/mail');
const sms = require('../config/sms');
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/User');
const mkdirp = require('mkdirp');

router.use(bodyparser.urlencoded({extended: true}));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'public/files/' + Date.now().toString();
        mkdirp(dir, err => {
            if(err) console.log(err);
            cb(err, dir);
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });


router.post('/blog-upload-image', ensureAuthenticated, upload.single('file'), (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the image URL in the format Froala expects
    const imageUrl = `${req.file.destination.slice(6)}/${req.file.originalname}`;
    res.json({ link: imageUrl });
});

module.exports = router;