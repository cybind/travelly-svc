var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Picture = require('../models/Picture.js');

/* GET pictures listing */
router.get('/', function(req, res) {
    Picture.find(function(err, pictures) {
        if (err) return next(err);
        res.json(pictures);
    });
});

/* POST /pictures */
router.post('/', function(req, res, next) {

	var picture = req.body;

    if (req.files && req.files && req.files.picture) {
    	picture.fileName = req.files.picture.name;
    }

    Picture.create(picture, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /pictures/id */
router.get('/:id', function(req, res, next) {
    Picture.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /pictures/:id */
router.put('/:id', function(req, res, next) {
    Picture.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /pictures/:id */
router.delete('/:id', function(req, res, next) {
    Picture.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
