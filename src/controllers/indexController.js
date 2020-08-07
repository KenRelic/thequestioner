
exports.indexPage = function (req, res) {
  res.render('login', { errors: undefined, msg: undefined })
}

exports.loginPage = function (req, res) {
  res.render('login', {errors: null, msg: null})
}

exports.signUpPage = function (req, res) {
  res.render('signUp', {
    errors: undefined,
    msg: undefined,
    fullname: '', password: '', email: '',
    error: undefined
  })
}

exports.privacyPage = function (req, res) {
  res.render('privacyPolicy')
}

// exports.resendLinkPage = function (req, res) {
//   res.render('resendLink', {
//     // user_id: req.body._id
//   })
// }

// exports.confirmation = function (req, res) {
//   res.render('resendLink', {
//     // user_id: req.body._id
//   })
// }