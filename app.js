// Importing Node modules and initializing Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/main');
const authRouter = require('./routers/authRouter')();
const userRouter = require('./routers/userRouter')();
const routeMap = require('express-routemap');

// Database Connection
mongoose.connect(config.database);

if (process.env.ENV === 'test') {
    // TODO
} else {
    mongoose.connect(config.database);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Start the server
app.listen(config.port, () => {
    // Print all available routes
    routeMap(app);
});
console.log('Your server is running on port ' + config.port + '.');

// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

const apiRoutes = express.Router();

app.use('/api', apiRoutes);

// Set auth routers as subgroup/middleware to other routers
apiRoutes.use('/auth', authRouter);
apiRoutes.use('/users', userRouter);