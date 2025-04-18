export const admin = (req, res, next) => {
    if (req.user.role != 'admin') {
        return res.status(403).json({ message: 'Access denied. Contact Admin, please!' });
    }
    next();
};
