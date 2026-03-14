import jwt from 'jsonwebtoken';

const genToken = async (userId) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        return token;

    } catch (error) {
        return resizeBy.status(500).json({
            message: `Gen-Token Error: ${error}`
        });
    }
};

export default genToken;