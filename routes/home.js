var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var sms = require('../config/sms');
const Content = require('../models/Content');

router.get('/', (req, res, next) => {
    res.render('./home', { user: req.user });
});

router.post('/contactus', (req, res, next) => {
    var {fullname, phone, description} = req.body;
    req.flash('success_msg', 'درخواست شما با موفقیت ثبت شد');
    sms('09017765682', `سفارش جدید سایت:\nنام: ${fullname}\nشماره تماس: ${phone}\nمتن پیام: ${description}`);
    sms('09121974633', `سفارش جدید سایت:\nنام: ${fullname}\nشماره تماس: ${phone}\nمتن پیام: ${description}`);
    sms(phone, `${fullname} عزیز. درخواست شما با موفقیت ثبت شد. همکاران ما در اولین فرصت با شما تماس خواهند گرفت.`);
    res.redirect('/');
});

router.get('/service', (req, res) => {
    var {title} = req.query;
    Content.findOne({title}, (err, content) => {
        res.render('./pages/service', {
            user: req.user,
            title,
            content,
        });
    })    
});
router.get('/edit-service', ensureAuthenticated, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    var {title} = req.query;
    Content.findOne({title}, (err, content) => {
        if(content){
            res.render('./pages/edit-service', {
                user: req.user,
                title,
                content,
            });
        }
        else{
            var newcontent = new Content({
                title,
                content: '',
            })
            console.log(newcontent)
            newcontent.save().then(doc => {
                res.render('./pages/edit-service', {
                    user: req.user,
                    title,
                    content: newcontent,
                });
            }).catch(err => console.log(err));
        }
    })    
});
router.post('/update-service', ensureAuthenticated, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    var {title, content} = req.body;
    Content.updateMany({title}, {$set: {content}}, (err, doc) => {
        req.flash('success_msg', 'تغییرات با موفقیت ثبت شد')
        res.redirect(`/service?title=${title}`);
    });
});



module.exports = router;