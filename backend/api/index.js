const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const ratelimit = require('express-rate-limit');

const { sequelize } = require('../models');

dotenv.config();

const PORT = process.env.APP_PORT || 3001;
const URL = process.env.APP_URL || 'http://localhost:3001';
const ORIGIN = process.env.APP_ORIGIN || 'http://localhost:5173';
const SECRET = process.env.APP_SECRET || 'rumah-literasi';

const app = express();
const store = new sequelizeStore({
	db: sequelize,
	tableName: 'sessions',
});

app.set('trust proxy', true);
app.use(
	cors({
		origin: ORIGIN,
		credentials: true,
	})
);

app.use(
	session({
		store: store,
		resave: false,
		secret: SECRET,
		saveUninitialized: false,
		proxy: true,
		cookie: {
			httpOnly: true,
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			secure: process.env.NODE_ENV === 'production',
		},
	})
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(
	ratelimit({
		limit: 100,
		windowMs: 1000 * 60,
		standardHeaders: 'draft-8',
	})
);

const errorHandler = require('../middleware/errors');
const { authenticate } = require('../middleware/authenticate');

const authRoutes = require('../routes/auth.routes');
const paymentRoutes = require('../routes/payment.routes');
const teritoriesRoutes = require('../routes/teritory.route');
const publicRoutes = require('../routes/public.routes');
const bookDonationRoutes = require('../routes/book-donation.routes');
const financialDonationRoutes = require('../routes/financial-donation.routes');
const deliveryRoutes = require('../routes/delivery.routes');
const addressRoutes = require('../routes/address.routes');
const eventRoutes = require('../routes/event.routes');
const userRoutes = require('../routes/user.routes');
const merchantRoutes = require('../routes/merchant.routes');
const logRoutes = require('../routes/log.routes');

app.use('/api/_healthcheck', (req, res) => {
	res.status(200).json({
		message: 'Server is running correctly',
	});
});

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/teritories', teritoriesRoutes);
app.use('/api/public', publicRoutes);

app.use(authenticate);
app.use('/api/book-donations', bookDonationRoutes);
app.use('/api/financial-donations', financialDonationRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', userRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/logs', logRoutes);

app.use(errorHandler);
app.get('*', (req, res) => {
	res.sendStatus(404);
});

store.sync();

app.listen(PORT, () => {
	console.log('Server is running on ' + URL);
});
