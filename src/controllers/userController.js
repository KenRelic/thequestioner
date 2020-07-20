
const Token = require('../../model/Token');
const User = require('../../model/User');

exports.userSignUp = function (req, res) {

}

exports.userLogin = function (req, res) {
  res.render('login')
}

exports.verifyLink = async (req, res, next) => {
  try {
    // Find a matching token
    const token = req.params.id
    Token.findOne({ token: token }, function (err, token) {
      // render the resend verification view asking them to insert their email again
      if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

      // If we found a token, find a matching user
      User.findOne({ _id: token._userId }, async (err, user) => {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        // Render a view for already verified users. asking them to login page
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        await user.save((err) => {
          if (err) { return res.status(500).send({ msg: err.message }); }
          res.status(200).send("The account has been verified. Please log in.");
        });
      });
      return next();
    })
  } catch (error) {
    console.log(error)
  }
}

exports.signUpUser = function (req, res) {
  User.create({
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    role: "USER"
  }).then(user => res.json(user));
}

