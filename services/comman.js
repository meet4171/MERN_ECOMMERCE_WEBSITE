const { Product } = require('../model/Product')
require('dotenv').config()
const passport = require('passport')
const nodemailer = require('nodemailer')
const ejs = require('ejs')

exports.isAuth = (req, res, next) => {
    return passport.authenticate('jwt')
}

exports.sanitizeUser = (user) => {
    return ({ id: user.id, role: user.role })
}

exports.cookieExtractor = (req) => {

    let token = null;
    
    if (req && req.cookies && req.cookies['jwt']) {
        token = req.cookies['jwt'];
    }

    return token;
};

// Nodemailer
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "meet45jadav@gmail.com",
        pass: process.env.APP_PASS,
    },
});

exports.sendMail = (sendTo, token) => {

    // html file to send in response
    const resetLink = "/reset-password?email=" + sendTo + "&token=" + token;

    return new Promise((resolve, reject) => {
        ejs.renderFile(__dirname + "/resetPass.ejs", { email: sendTo, resetLink: resetLink }, function (err, data) {
            if (err) {
                console.log(err);
                reject(err)
            } else {
                let mailOpts = {
                    from: "'www.trendcart.com' meet45jadav@gmail.com",
                    to: sendTo,
                    subject: 'www.trendcart.com forget password link',
                    html: data
                }

                transporter.sendMail(mailOpts, function (err, info) {
                    if (err) {
                        console.log(err)
                        reject({
                            status: 500,
                            error: err
                        }
                        )
                    } else {
                        resolve({
                            status: 200,
                            data: info.response
                        })
                    }
                });
            }

        })

    })

};

exports.sendSuccessMail = (sendTo) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(__dirname + "/resetPassSuccess.ejs", { email: sendTo }, function (err, data) {
            if (err) {
                console.log(err);
                reject({ status: 400 });
            } else {
                let mailOpts = {
                    from: "'www.trendcart.com' meet45jadav@gmail.com",
                    to: sendTo,
                    subject: 'www.trendcart.com forget password link',
                    html: data
                };

                transporter.sendMail(mailOpts, function (err, info) {
                    if (err) {
                        console.log(err);
                        reject({ status: 400 }); // You should reject with the error object
                    } else {
                        console.log('Message sent: ' + info.response);
                        resolve({ status: 200 }); // You can resolve with a success message or relevant data
                    }
                });
            }
        });
    });
};
exports.sendInvoiceMail = (userInfo, orderInfo) => {
    return new Promise((resolve, reject) => {
        const currentDate = new Date()
        ejs.renderFile(__dirname + "/invoice.ejs", { email: userInfo.email, userInfo, orderInfo, currentDate }, function (err, data) {
            if (err) {
                console.log(err);
                reject({ status: 400 });
            } else {
                let mailOpts = {
                    from: "'www.trendcart.com' meet45jadav@gmail.com",
                    to: userInfo.email,
                    subject: 'www.trendcart.com Order Placed Successfully',
                    html: data
                };

                transporter.sendMail(mailOpts, function (err, info) {
                    if (err) {
                        console.log(err);
                        reject({ status: 400 });
                    } else {
                        resolve({ status: 200 });
                    }
                });
            }
        });
    });
};

exports.updateStock = async (cartItems) => {
    try {
        for (const item of cartItems) {
            const product = await Product.findById(item.product.id);
            if (product) {
                const newStock = product.stock - item.quantity;
                await Product.findByIdAndUpdate(item.product.id, { stock: newStock });
            } else {
                console.error(`Product with ID ${item.product.id} not found.`);
            }
        }
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}




