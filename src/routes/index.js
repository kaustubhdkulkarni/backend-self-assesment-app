const express = require('express');
const userRoutes = require("./user.route")
const authRoutes = require("./auth.route")
const subRoleRoutes = require("./subRole.route")
const otpRoutes = require("./otp.route")




const multer = require('multer');
const path = require('path');


const notificationRoutes = require("./notification.route");


const sendgridRoutes = require("./sendgrid.route");

const auth = require('../middlewares/auth');
const { roleAccess, contentType } = require('../config/enums');
const checkContentType = require('../middlewares/checkContentType');
const router = express.Router();
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.resolve(__dirname, '../../uploads/');
		cb(null, uploadPath)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, uniqueSuffix + "-" + file.originalname)
	}
})
const upload = multer({
	storage: storage,
	limits: {
		fileSize: MAX_FILE_SIZE
	}
})

const defaultRoutes = [
	{
		path: '/auth',
		route: authRoutes,
	},
	{
		path: '/users',
		route: userRoutes,
	},
	{
		path: '/sub-roles',
		route: subRoleRoutes,
	},
	{
		path: '/otp',
		route: otpRoutes,
	},

	
	{
		path: '/notification',
		route: notificationRoutes,
	},
	
	{
		path: '/sendgrid',
		route: sendgridRoutes,
	},
];


defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;