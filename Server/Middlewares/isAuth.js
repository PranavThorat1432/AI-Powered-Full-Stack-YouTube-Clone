import jwt from 'jsonwebtoken';

export const isAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(400).json({
                message: 'User dost not have token!'
            });
        }

        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyToken) {
            return res.status(400).json({
                message: 'Invalid Token!'
            });
        }

        req.userId = verifyToken.userId;
        next();

    } catch (error) {
        return res.status(500).json({
            message: `IsAuth Error: ${error}`
        });
    }
};