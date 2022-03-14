const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
    const { fullname, email, username, password } = req.body;
    const user = new User({ fullname, email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to YourWines🍇');
        res.redirect('/vineyards');
    })
    } catch(e) {
    req.flash('error', e.message);
    res.redirect('register');
    } 
    
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back🍷');
    const redirectUrl = req.session.returnTO || '/vineyards';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye🍷");
    res.redirect('/vineyards');
}