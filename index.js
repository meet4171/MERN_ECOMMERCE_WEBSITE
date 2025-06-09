require('dotenv').config();
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { User } = require('./model/User');
const bcrypt = require('bcrypt');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/comman');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const { urlencoded } = require('body-parser');
const path = require('path');
const server = express();
const { main } = require('./services/mongoose_connection');
const { APP_MODE, BASE_URL } = require('./config');

// Import routes
const { router: productRouter } = require('./routes/Product');
const { router: brandsRouter } = require('./routes/Brands');
const { router: categoryRouter } = require('./routes/Category');
const { router: userRouter } = require('./routes/User');
const { router: authRouter } = require('./routes/Auth');
const { router: cartRouter } = require('./routes/Cart');
const { router: orderRouter } = require('./routes/Order');
const { router: adminRouter } = require('./routes/Admin');

// 1️⃣ CORS FIRST (important)
server.use(cors({
    origin: [
        'http://localhost:3000',
        'https://meetjadav.shop',
        'https://www.meetjadav.shop',
        'https://checkout.stripe.com'
    ],
    exposedHeaders: ['X-Total-Count'],
    credentials: true
}));

// 2️⃣ Basic Middlewares
server.use(urlencoded({ extended: true }));
server.use(cookieParser());
server.use(express.json());

// 3️⃣ Session and Passport
server.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
server.use(passport.initialize());
server.use(passport.session());

// 4️⃣ Passport Local Strategy
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function (email, password, done) {
    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return done(null, false);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false);

        const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
        return done(null, { id: user.id, role: user.role, token });
    } catch (err) {
        return done(err);
    }
}));

// 5️⃣ Passport JWT Strategy
passport.use('jwt', new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET_KEY
}, async function (jwt_payload, done) {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) return done(null, sanitizeUser(user));
        else return done(null, false);
    } catch (err) {
        return done(err, false);
    }
}));

// 6️⃣ Passport serialize/deserialize
passport.serializeUser(function (user, cb) {
    process.nextTick(() => {
        cb(null, { id: user.id, role: user.role });
    });
});
passport.deserializeUser(function (user, cb) {
    process.nextTick(() => {
        cb(null, user);
    });
});


// 7️⃣ Stripe Payment (before /api routes)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

server.post('/create-checkout-session', async (req, res) => {
    try {
        const orderDetails = req.body;

        const MIN_AMOUNT = 5000; // ₹50 minimum, in paisa

        const line_items = orderDetails.cartItems.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.product.title
                },
                unit_amount: Math.max(MIN_AMOUNT, Math.round(
                    (item.product.price - (item.product.price * (item.product.discountPercentage / 100))) * 100
                ))
            },
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${BASE_URL}/order-success/${orderDetails.id}`,
            cancel_url: `${BASE_URL}/order-cancalled/`
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe session error:', error);
        res.status(500).json({ error: 'Stripe session failed' });
    }
});

// 8️⃣ API routes
server.use('/api/auth', authRouter);
server.use('/api/product', isAuth(), productRouter);
server.use('/api/brands', isAuth(), brandsRouter);
server.use('/api/categories', isAuth(), categoryRouter);
server.use('/api/users', isAuth(), userRouter);
server.use('/api/cart', isAuth(), cartRouter);
server.use('/api/orders', isAuth(), orderRouter);
server.use('/api/admin', isAuth(), adminRouter);

// 9️⃣ Static serving for React app (safe version)
if (APP_MODE === "production") {
    server.use(express.static(path.resolve(__dirname, 'build')));
    // Only match non-API routes (very important!)
    server.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

// 10️⃣ Start server
main();
server.listen(8080, () => {
    console.log('✅ Server started at port http://localhost:8080');
});
