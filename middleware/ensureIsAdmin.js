/**
 * checks if user is admin
 */
const ensureIsAdmin = (req, res, next) => (
  req.user && req.user.isAdmin ?
    next() :
    res.status(401).send({
      message: 'Unauthorized access',
    })
);

module.exports = ensureIsAdmin;
