function isAuthenticated(request, response, next) {
  if (request.session && request.session.user) {
    return next();
  }
  response.status(401).json({
    message: "Unauthorized",
    session: request.session,
  });
}

module.exports = isAuthenticated;
