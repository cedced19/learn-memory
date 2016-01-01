// test if user is authenticated
module.exports = function(req, res, next) {
   if (req.isAuthenticated()) {
        next();
    } else{
        res.redirect('/login');
    }
};
