exports.protectRoute = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

exports.verifyAccess = (requiredNivel) => {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.nivel > requiredNivel) {
            return res.status(403).render('errorPage', { status: 403, message: 'Acesso negado.' });
        }
        next();
    };
};
