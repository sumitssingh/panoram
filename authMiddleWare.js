var jwtDecode = require('jwt-decode');
var moment = require('moment');

function ensureAuthenticated(req, res, next) {

    if (!req.headers.authorization) {
        return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
    }
    var token = req.headers.authorization.split(' ')[1];

    var payload = jwtDecode(token);
    if (payload.isAdmin) {
        req.isAdmin = payload.isAdmin;
        next();
    } else {
        req.userId = payload._id;
        next();
    }
}


module.exports = ensureAuthenticated;
