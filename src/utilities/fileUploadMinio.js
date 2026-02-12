const Minio = require("minio");
const fs = require("fs");
const util = require("util");
const path = require("path");
const unlinkFile = util.promisify(fs.unlink);
const ApiError = require("./apiErrors");
const httpStatus = require("http-status");
const NodeClam = require("clamscan");
const sendResponse = require("../utilities/responseHandler");
const logger = require("../config/logger");
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024);

// Initialize MinIO client
const minioClient = new Minio.Client({
	endPoint: process.env.MINIO_URL,
	port: Number(process.env.MINIO_PORT),
	useSSL: false,  // set false if not uploads
	accessKey: process.env.MINIO_ACCESS_KEY,
	secretKey: process.env.MINIO_SECRET_KEY,
});

// Allowed file types
const acceptedFileTypes = [
	"jpeg", "jpg", "png", "bmp", "tiff", "gif", "webp", "svg",
	"doc", "docx", "xls", "xlsx", "csv", "pdf", "csv", "txt",
];

// Upload file to MinIO
const fileUpload = (objectName, filePath) => {
	return new Promise(async (resolve, reject) => {
		const bucketName = process.env.MINIO_BUCKET;

		try {
			console.log({ filePath });

			// Validate file size
			const fileStats = await fs.promises.stat(filePath); // Get file statistics

			if (fileStats.size > MAX_FILE_SIZE) {
				const errorMsg = `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)} MB`;
				console.error(errorMsg);
				return reject(new ApiError(httpStatus.FORBIDDEN, errorMsg));
			}

			// Validate file extension
			const fileExtension = getFileExtension(filePath);
			if (!acceptedFileTypes.includes(fileExtension)) {
				return reject(new ApiError(httpStatus.FORBIDDEN, "Invalid file type"));
			}

			// Check if file exists
			if (!fs.existsSync(filePath)) {
				return reject(new ApiError(httpStatus.BAD_REQUEST, "File does not exist"));
			}

			// Ensure bucket exists or create it
			const bucketExists = await minioClient.bucketExists(bucketName);
			if (!bucketExists) {
				await minioClient.makeBucket(bucketName, process.env.MINIO_REGION);
			}

			// Upload file to MinIO
			const etag = await minioClient.fPutObject(bucketName, objectName, filePath);

			// Generate file URL
			const minioUrl = process.env.NODE_ENV !== "development"
				? `https://${process.env.MINIO_URL}`
				: `http://${process.env.MINIO_URL}:${process.env.MINIO_PORT}`;
			resolve(`${minioUrl}/${bucketName}/${objectName}`);
		} catch (err) {
			console.error("Error in file upload:", err);
			reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "File upload failed"));
		} finally {
			// Clean up local file
			try {
				await unlinkFile(filePath);
			} catch (cleanupError) {
				console.error("Error cleaning up file:", cleanupError);
			}
		}
	});
};

// Get file extension
const getFileExtension = (filePath) => {
	const match = filePath.match(/\.([0-9a-z]+)(?:[\?#]|$|-|$)/i);
	return match ? `${match[1]}` : "";
};

// Scan file for viruses
// const scanFileForViruses = async (filePath) => {
//     const clamscan = await new NodeClam().init({
//         remove_infected: false,
//         quarantine_infected: false,
//         clamscan: {
//             path: process.env.CLAMSCAN_PATH || "/usr/bin/clamscan",
//         },
//         preference: "clamscan",
//     });

//     const { isInfected, file, viruses } = await clamscan.scanFile(filePath);
//     if (isInfected) {
//         throw new ApiError(
//             httpStatus.BAD_REQUEST,
//             `File is infected with viruses: ${viruses.join(", ")}`
//         );
//     }
// };

// Express controller for file upload
const uploadFileController = async (req, res) => {
	try {
		const file = req.file;
		if (!file) {
			throw new ApiError(httpStatus.BAD_REQUEST, "No file provided");
		}

		const timestamp = Date.now();
		const fileExtension = path.extname(file.originalname);
		const baseName = path.basename(file.originalname, fileExtension);
		const objectName = `${baseName}_${timestamp}${fileExtension}`;
		const fileStats = await fs.promises.stat(file.path); // Get file statistics
		// console.log({ fileStats });

		const uploadedFileUrl = await fileUpload(objectName, file.path);

		return sendResponse(res, httpStatus.OK, uploadedFileUrl, null);
	} catch (err) {
		console.error("Error uploading file controller:", err);
		return sendResponse(
			res,
			err.status || httpStatus.INTERNAL_SERVER_ERROR,
			null,
			err.message || "File upload failed"
		);
	}
};

module.exports = {
	uploadFileController,
};
