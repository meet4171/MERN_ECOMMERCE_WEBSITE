require('dotenv').config()
const { User } = require("../model/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sanitizeUser, sendMail, sendSuccessMail } = require('../services/comman')
const crypto = require('crypto')


exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = req.body;

        user.password = hashedPassword;
        const newUser = new User(user);
        const response = await newUser.save();

        // this will call the serialize user to make a seesion when new user is created
        const token = jwt.sign(sanitizeUser(response), process.env.JWT_SECRET_KEY);

        req.login(token, function (err) {
            if (err) {
                res.status(401).json(err);
            } else {
                res.cookie('jwt', token, { expires: new Date(Date.now() + 3 * 60 * 60 * 1000), httpOnly: true }).status(201).json(sanitizeUser(response))
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

};
exports.loginUser = async (req, res) => {
    const token = jwt.sign(sanitizeUser(req.user), process.env.JWT_SECRET_KEY);
    res.cookie('jwt', token, { expires: new Date(Date.now() + 3 * 60 * 60 * 1000), httpOnly: true, path: '/', }).status(200).json(req.user);
};


exports.checkAuth = async (req, res) => {
    if (req.user) {
        return res.status(200).json(req.user);
    }
    else {
        return res.sendStatus(401)
    }
};
exports.sendResetMail = async (req, res) => {
    try {
        const email = req.body.email;
        const token = crypto.randomBytes(48).toString('hex');
        if (email) {
            const user = await User.findOne({ email: email });

            if (user) {
                user.resetPassToken = token;
                await user.save();
                await sendMail(email, token);
                return res.status(200).json("Password reset email sent successfully!");
            }
        }

        return res.status(404).json({ message: "Email Does not Exists" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.resetPassword = async (req, res) => {
    let { email, token, newPassword } = req.body;
    try {

        if (email && newPassword && token) {
            const user = await User.findOne({ resetPassToken: token, email: email })
            if (user) {
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedNewPassword
                await user.save()
                const mailResponse = await sendSuccessMail(email)
                if (mailResponse.status === 200) {
                    return res.status(200).json({ message: "Password Changed Successfully" })
                }


            }
        }
        return res.status(404).json({ message: "User with such email was not found" })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: false, // Set this to true if your app uses HTTPS
    }).sendStatus(200);
};

