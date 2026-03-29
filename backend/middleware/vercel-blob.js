const path = require('path');
const multer = require('multer');
const { put } = require('@vercel/blob');

class VercelBlobStorage {
	constructor(options) {
		this.options = options || {};
	}

	/**
	 * Called when a file is detected in a request.
	 * @param {*} req
	 * @param {*} file
	 * @param {*} cb
	 */
	_handleFile(req, file, cb) {
		const hash = Date.now();
		const ext = path.extname(file.originalname);
		const prefix = this.options.prefix || 'files';
		const filename = path.join(prefix, hash + ext);

		const chunks = [];
		file.stream.on('data', (chunk) => chunks.push(chunk));
		file.stream.on('end', async () => {
			try {
				const buffer = Buffer.concat(chunks);

				const blob = await put(filename, buffer, {
					access: 'public',
				});

				cb(null, {
					path: blob.url,
					filename: filename,
					size: buffer.length,
				});
			} catch (error) {
				cb(error);
			}
		});
		file.stream.on('error', cb);
	}

	_removeFile(req, file, cb) {
		cb(null);
	}
}

const storage = new VercelBlobStorage({
	prefix: 'uploads',
});

const upload = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) cb(null, true);
		else cb(new Error('Only image files are allowed!'), false);
	},
});

module.exports = {
	upload,
};
