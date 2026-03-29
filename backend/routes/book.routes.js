const express = require('express');
const router = express.Router();

const BookController = require('../controllers/book.controller');
const { upload: local } = require('../middleware/local-upload');
const { upload: vercel } = require('../middleware/vercel-blob');

const { ROLES } = require('../libs/constant');
const { authorize } = require('../middleware/authorize');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const upload = IS_PRODUCTION ? vercel : local;

const librarian = authorize([ROLES.LIBRARIAN]);
router.get('/', BookController.index);
router.post('/', librarian, upload.single('cover[]'), BookController.store);
router.get('/:id', librarian, BookController.show);
router.put('/:id', librarian, upload.single('cover[]'), BookController.update);
router.delete('/:id', librarian, BookController.destroy);

module.exports = router;
