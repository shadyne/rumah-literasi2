process.env.NODE_ENV = 'test';

const fs = require('fs');
const os = require('os');
const path = require('path');

const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rumah-literasi-test-'));
process.env.UPLOAD_DIR = uploadDir;
