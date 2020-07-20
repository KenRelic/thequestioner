const express = require('express');
const debug = require('debug')('app:/src/routes/index')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

// const sgMail = require('@sendgrid/mail');
// const nodemailerSendgrid = require('nodemailer-sendgrid');
const Token = require('../../model/Token');
const User = require('../../model/User');
const indexController = require('../controllers/indexController')

router.get('/', indexController.indexPage);
router.get('/login', indexController.loginPage);
router.get('/signUp', indexController.signUpPage);
router.get('/verificationSuccessful', (req, res) => {
  res.status(200).render('verificationSuccessful');
})
router.get('/userVerified', (req, res) => {
  res.status(200).render('userVerified');
})

router.get('/verificationSent', (req, res) => {
  res.status(200).render('verificationSent')
})

router.get('/verificationFailed', [
  body('email').isEmail().withMessage('Email is invalid')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('verificationFailed',
      {
        isInvalid: true,
        isNotFound: false
      });
  }
  res.status(200).render('verificationFailed', { isInvalid: null, isNotFound: null });
})

router.post('/resendLink', [
  body('email').isEmail().withMessage('Email is invalid')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('verificationFailed',
        {
          isInvalid: true,
          isNotFound: false
        });
    }
    await User.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(400).render('verificationFailed', { isInvalid: false, isNotFound: false })
      if (!user) return res.status(400).render('verificationFailed', { isInvalid: false, isNotFound: true })
      if (user.isVerified) return res.status(400).render('userVerified')

      // Create a verification token for this user
      const userToken = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the verification token
      userToken.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }

        // Send the email-------------------------------------------------------------------------
        //create a transport
        var transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.USER,
            pass: process.env.PASS
          }
        });

        const verifyLink = 'http://' + req.headers.host + '/confirmation/' + userToken.token;

        const message = {
          to: `${user.email}`,
          from: 'no-reply@questioner.com',
          subject: 'Questioner Email verification',
          text: 'Email verification is all that is left. click the link to verify your email address:' + 'http://' + req.headers.host + '/confirmation/' + userToken.token,
          html: `<td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="600" alt="" data-proportionally-constrained="true" data-responsive="true" src="https://image.freepik.com/free-vector/mailbox-concept-illustration_23-2148277017.jpg"></td>
            <h3 style="text-align: center"><span style="font-family: helvetica, sans-serif; color: #3c6ddd; font-size: 24px"><strong>Almost done! one more click left.</strong></span></h3>
            <div style="font-family: inherit; text-align: center">Thanks for creating an account on Questioner all that is left now is to confirm your email and you can get in to your account and start using Questioner. Please click the link below to verify your email address.</div>
            <td align="center" bgcolor="#3c6ddd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><form method="post" action="${verifyLink}" target="_blank" style ="width:100%; margin: 0 auto;"><button type="submit" id="verify-link" style="background:linear-gradient(45deg,#150fd1,#ff29a6);border-radius:2em;color:#fff;cursor:pointer;display:block;margin:2em auto;max-width:300px;min-width:150px;overflow:hidden;padding:1em;position:relative;text-align:center;text-decoration:none;width:70%;z-index:1">Verify email addrress</button></form></td>`,
        };

        transport.sendMail(message, (err) => {
          if (err) {
            debug('Error occurred. ' + err.message);
            return process.exit(1);
          }
        });
        return res.status(201).render('verificationSent', { email: user.email, token: userToken.token });
      })
    })
  } catch (error) {
    debug(error)
  }
})

router.get('/verificationSentAgain', (req, res) => {
  res.status(200).render('verificationSentAgain');
})

router.post('/signUp', [
  body('fullname').isLength(4).withMessage('Full name must be at least 4 characters long'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('password').isLength({ max: 1024 }).withMessage('Password must be at most 1024 characters long')
], async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('signUp',
        {
          errors: errors.array(),
          fullname: req.body.fullname, password: req.body.password, email: req.body.email,
          error: undefined
        });
    }

    // Make sure this account doesn't already exist
    User.findOne({ email: req.body.email }, async (err, user) => {

      //   // Make sure user doesn't already exist
      if (user) return res.status(400).render('signUp', {
        error: 'The email address already exists.',
        errors: undefined,
        fullname: req.body.fullname, password: req.body.password, email: req.body.email
      });

      // Create and save the user
      // hash the user password so its not recognizable in the DB

      // hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashedPassword,
        role: "USER",
        isVerified: false
      })


      await newUser.save((err, savedUser) => {
        // Render a 500 page
        if (err) { return res.status(500).send({ msg: err.message }); }

        // Create a verification token for this user
        const userToken = new Token({ _userId: savedUser._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        userToken.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          // Send the email-------------------------------------------------------------------------
          //create a transport
          var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS
            }
          });

          const verifyLink = 'http://' + req.headers.host + '/confirmation/' + userToken.token;

          const message = {
            to: `${newUser.email}`,
            from: 'no-reply@questioner.com',
            subject: 'Questioner Email verification',
            text: 'Email verification is all that is left. click the link to verify your email address:' + 'http://' + req.headers.host + '/confirmation/' + userToken.token,
            html: `<td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="600" alt="" data-proportionally-constrained="true" data-responsive="true" src="https://image.freepik.com/free-vector/mailbox-concept-illustration_23-2148277017.jpg"></td>
            <h3 style="text-align: center"><span style="font-family: helvetica, sans-serif; color: #3c6ddd; font-size: 24px"><strong>Almost done! one more click left.</strong></span></h3>
            <div style="font-family: inherit; text-align: center">Thanks for creating an account on Questioner all that is left now is to confirm your email and you can get in to your account and start using Questioner. Please click the link below to verify your email address.</div>
            <td align="center" bgcolor="#3c6ddd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><form method="post" action="${verifyLink}" target="_blank" style ="width:100%; margin: 0 auto;"><button type="submit" id="verify-link" style="background:linear-gradient(45deg,#150fd1,#ff29a6);border-radius:2em;color:#fff;cursor:pointer;display:block;margin:2em auto;max-width:300px;min-width:150px;overflow:hidden;padding:1em;position:relative;text-align:center;text-decoration:none;width:70%;z-index:1">Verify email addrress</button></form></td>`,
          };

          transport.sendMail(message, (err, msg) => {
            if (err) {
              debug('Error occurred. ' + err.message);
              return process.exit(1);
            }
            console.log('Message sent: %s', msg.messageId);
          });
          return res.status(201).render('verificationSent', { email: newUser.email, token: userToken.token });
        })
      })
    })
  } catch (error) {
    debug('Error: ' + error.message);
  }
})

router.post('/login', [
  body('email').isEmail().withMessage('Email or password is invalid'),
  body('password').isLength({ min: 8 }).withMessage('Email or password is invalid'),
  body('password').isLength({ max: 1024 }).withMessage('Email or password is invalid')
], async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).json({ errors: errors.array() })
      return res.status(422).render('login',
        {
          errors: errors.array(),
          password: req.body.password, email: req.body.email
        });
    }

    // Check if the user is registered
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.status(400).render('login', { msg: 'Email or password is incorrect' });

    // Check if the password is correct//
    // decrypt the password in the DB for comparison
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).render('login', { msg: 'email of password is incorrect' })

  } catch (error) {
    debug(error)
  }
})

router.post('/confirmation/:id', async (req, res) => {
  try {
    // Find a matching token
    const token = req.params.id
    Token.findOne({ token: token }, (err, token) => {
      // render the resend verification view asking them to insert their email again
      if (!token) return res.status(400).render('verificationFailed', { isInvalid: null, isNotFound: null });

      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, async (err, user) => {
        if (!user) return res.status(400).render('verificationFailed', { isInvalid: null, isNotFound: null });
        // Render a view for already verified users. asking them to login page
        if (user.isVerified) return res.status(400).render('userVerified');

        // Verify and save the user
        user.isVerified = true;
        await user.save((err) => {
          if (err) { return res.status(500).send({ msg: err.message }); }
          res.status(200).redirect('/../verificationSuccessful');
        });
      });

    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/resendLink/:id', async (req, res) => {
  try {
    // Find a matching token
    const token = req.params.id

    Token.findOne({ token: token }, async (err, token) => {
      // render the resend verification view asking them to insert their email again
      if (!token) return res.status(400).render('verificationFailed', { isInvalid: null, isNotFound: null });

      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, async (err, user) => {
        if (!user) return res.status(400).redirect('verificationFailed', { isInvalid: null, isNotFound: null });
        // Render a view for already verified users. asking them to login page
        if (user.isVerified) return res.status(400).redirect('userVerified');

        const newToken = crypto.randomBytes(16).toString('hex');

        // Save the verification token
        await Token.updateOne({ token: token.token }, { token: newToken }, { runValidators: true })

        // Send the email-------------------------------------------------------------------------
        //create a transport
        var transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.USER,
            pass: process.env.PASS
          }
        });

        const verifyLink = 'http://' + req.headers.host + '/confirmation/' + newToken;

        const message = {
          to: `${user.email}`,
          from: 'no-reply@questioner.com',
          subject: 'Questioner Email verification',
          text: 'Email verification is all that is left. click the link to verify your email address:' + 'http://' + req.headers.host + '/confirmation/' + newToken,
          html: `<td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"><img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" width="600" alt="" data-proportionally-constrained="true" data-responsive="true" src="https://image.freepik.com/free-vector/mailbox-concept-illustration_23-2148277017.jpg"></td>
            <h3 style="text-align: center"><span style="font-family: helvetica, sans-serif; color: #3c6ddd; font-size: 24px"><strong>Almost done! one more click left.</strong></span></h3>
            <div style="font-family: inherit; text-align: center">Thanks for creating an account on Questioner all that is left now is to confirm your email and you can get in to your account and start using Questioner. Please click the link below to verify your email address.</div>
            <td align="center" bgcolor="#3c6ddd" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><form method="post" action="${verifyLink}" target="_blank" style ="width:100%; margin: 0 auto;"><button type="submit" id="verify-link" style="background:linear-gradient(45deg,#150fd1,#ff29a6);border-radius:2em;color:#fff;cursor:pointer;display:block;margin:2em auto;max-width:300px;min-width:150px;overflow:hidden;padding:1em;position:relative;text-align:center;text-decoration:none;width:70%;z-index:1">Verify email addrress</button></form></td>`,
        };

        transport.sendMail(message, (err) => {
          if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
          }
        });
        return res.status(201).redirect('verificationSentAgain');

      });

    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;