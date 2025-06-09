require('dotenv').config()
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser') // go get cookies in req.cookies
const { User } = require('./model/User');
const bcrypt = require('bcrypt');
const { isAuth, sanitizeUser, cookieExtractor, isTokenValid } = require('./services/comman');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const { urlencoded } = require('body-parser')
const path = require('path')
const server = express();
const { main } = require('./services/mongoose_connection')

// Import routes
const { router: productRouter } = require('./routes/Product');
const { router: brandsRouter } = require('./routes/Brands');
const { router: categoryRouter } = require('./routes/Category');
const { router: userRouter } = require('./routes/User');
const { router: authRouter } = require('./routes/Auth');
const { router: cartRouter } = require('./routes/Cart');
const { router: orderRouter } = require('./routes/Order');
const { router: adminRouter } = require('./routes/Admin');
const { nextTick } = require('process');
const { APP_MODE, BASE_URL } = require('./config');



// All Middlewares
server.use(urlencoded({ extended: true }))
server.use(cookieParser())
server.use(express.json());


server.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
);
server.use(passport.initialize());
server.use(passport.session());

server.use(cors(
    {
        origin: ['http://localhost:3000', 'https://meetjadav.shop', 'https://www.meetjadav.shop', 'https://checkout.stripe.com'],
        exposedHeaders: ['X-Total-Count'],
        credentials: true, // Allow cookies with credentials
    }
));

// Passport Local Strategy

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async function (email, password, done) {
    try {
        const user = await User.findOne({ email }).exec()
        if (!user) {

            return done(null, false);
        }
        if (! await bcrypt.compare(password, user.password)) {
            return done(null, false);
        }
        const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
        return done(null, { id: user.id, role: user.role, token });
    } catch (err) {
        return done(err);
    }
}));

// Passport JWT Strategy 

passport.use(
    'jwt',
    new JwtStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET_KEY
    }, async function (jwt_payload, done) {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, sanitizeUser(user)); // This will send the user to req.user
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});

// Deserialize User will be never called
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});


// Stripe Payment

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
server.post("/create-checkout-session", async (req, res) => {
    const orderDetails = req.body;


    const line_items = orderDetails.cartItems.map((item) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: item.product.title,
            },
            unit_amount: Math.round((item.product.price - (item.product.price * (item.product.discountPercentage / 100))) * 100)
        },
        quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: `${BASE_URL}/order-success/${orderDetails.id}`,
        cancel_url: `${BASE_URL}/order-cancalled/`,
    });

    res.status(200).json({ url: session.url })
})



server.use('/api/auth', authRouter);
server.use('/api/product', isAuth(), productRouter);
server.use('/api/brands', isAuth(), brandsRouter);
server.use('/api/categories', isAuth(), categoryRouter);
server.use('/api/users', isAuth(), userRouter);
server.use('/api/cart', isAuth(), cartRouter);
server.use('/api/orders', isAuth(), orderRouter);
server.use('/api/admin', isAuth(), adminRouter);


// Routes [API EndPoints]
if (APP_MODE === "production") {
    server.use(express.static(path.resolve(__dirname, 'build')));
    server.get(/^\/(?!api).*/, function (req, res) {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

main()
server.listen(8080, () => {
    console.log('server started at port http://localhost:8080');
});
