exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success')
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.json({"status": 404});
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
