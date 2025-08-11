var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var sms = require('../config/sms');

router.get('/', (req, res, next) => {
    res.render('./home', { user: req.user });
});

router.post('/contactus', (req, res, next) => {
    var {fullname, phone, description} = req.body;
    req.flash('success_msg', 'درخواست شما با موفقیت ثبت شد');
    sms('09336448037', `سفارش جدید سایت:\nنام: ${fullname}\nشماره تماس: ${phone}\nمتن پیام: ${description}`);
    sms('09121974633', `سفارش جدید سایت:\nنام: ${fullname}\nشماره تماس: ${phone}\nمتن پیام: ${description}`);
    sms(phone, `${fullname} عزیز. درخواست شما با موفقیت ثبت شد. همکاران ما در اولین فرصت با شما تماس خواهند گرفت.`);
    res.redirect('/');
});



module.exports = router;