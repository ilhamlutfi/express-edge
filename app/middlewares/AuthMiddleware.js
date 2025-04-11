const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
         return next(); // user sudah login
    }
    
    req.flash('error', 'Please login first!');
    res.redirect('/login');
}

export default isAuthenticated;

