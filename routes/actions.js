var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  res.render('admin/actions');
});

/*
 * GET actions.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('actions').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD action.
 */
router.post('/add', function(req, res) {
    var db = req.db;
    var data = req.body;
    db.collection('actions').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * EDIT action.
 */
router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('actions').updateById( id, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteaction.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var actionToDelete = req.params.id;
    db.collection('actions').removeById(actionToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
