const express = require('express');
const router = express.Router();
const vineyards = require('../controllers/vineyards');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateVineyard } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Vineyard = require('../models/vineyard');

router.route('/')
    .get(catchAsync(vineyards.index))
    .post(isLoggedIn, upload.array('image'), validateVineyard, catchAsync(vineyards.createVineyard));
    

router.get('/new', isLoggedIn, vineyards.renderNewForm);

router.route('/:id')
    .get(catchAsync(vineyards.showVineyard))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateVineyard, catchAsync(vineyards.updateVineyard))
    .delete(isLoggedIn, isAuthor, catchAsync(vineyards.deleteVineyard));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(vineyards.renderEditForm));




module.exports = router;