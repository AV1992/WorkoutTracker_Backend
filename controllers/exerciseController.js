const _orm = require('orm');
const _paging = require('orm-paging');
const _dbconfig = require('../dbconfig');

function getModel(db) {
  return db.define("exercise", {
    id: Number,
    name: String,
    dateModified: Number,
    userid: Number
  });
}

function successResponse(method_name, res, obj) {
  console.log("[exerciseController][" + method_name + "] | Success: " + JSON.stringify(obj));
  return res.status(200).send(obj);
}

function errorResponse(method_name, res, err) {
  // throw err;
  console.log("[exerciseController][" + method_name + "] | Error: " + err);
  return res.status(500).send(err);
}

exports.getAll = function (req, res) {
  var method_name = "getAll";

  _orm.connect(_dbconfig, function (err, db) {
    if (err)
      return errorResponse(method_name, res, err);

    var exerciseModel = getModel(db);
      // add the table to the database
      exerciseModel.sync(function (err) {
        if (err)
          return errorResponse(method_name, res, err);

          // query the person table by surname
          exerciseModel.find(function (err, dbExercises) {
            if (err)
              return errorResponse(method_name, res, err);

            return successResponse(method_name, res, dbExercises);
          });
        });
    });
};

exports.getById = function (req, res) {
    var method_name = "getById";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var id = req.params.id;
        var model = getModel(db);

        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // query the person table by surname
            model.get(id, function (err, dbExercise) {
                if (err)
                    return errorResponse(method_name, res, err);

                return successResponse(method_name, res, dbExercise);
            });
        });
    });
};

exports.getForUser = function (req, res) {
  var method_name = "getForUser";

  _orm.connect(_dbconfig, function (err, db) {
    if (err)
      return errorResponse(method_name, res, err);

    var userid = req.params.userid;
    var model = getModel(db);

            // add the table to the database
    model.sync(function (err) {
      if (err)
        return errorResponse(method_name, res, err);

      // query the person table by surname
      model.find({or:[{userid: userid}, {userid: null}]}, function (err, dbExercise) {
        if (err)
          return errorResponse(method_name, res, err);

        return successResponse(method_name, res, dbExercise);
      });
    });
  });
};

exports.create = function (req, res) {
  var method_name = "create";

  _orm.connect(_dbconfig, function (err, db) {
    if (err)
      return errorResponse(method_name, res, err);

    var model = getModel(db);
    var exercise = req.body;

      // add the table to the database
      model.sync(function (err) {
        if (err)
          return errorResponse(method_name, res, err);

          // add a row to the person table
          model.create(exercise, function (err, dbExercise) {
            if (err)
              errorResponse(method_name, res, err);

            return successResponse(method_name, res, dbExercise);
          });
        });
    });
};

exports.update = function (req, res) {
    var method_name = "update";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var exercise = req.body;
        var model = getModel(db);

        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // query the person table by surname
            model.get(exercise.id, function (err, dbExercise) {
                if (err)
                    return errorResponse(method_name, res, err);

                dbExercise.name = exercise.name;
                dbExercise.dateModified = exercise.dateModified;

                dbExercise.save(function (err) {
                    if (err)
                        return errorResponse(method_name, res, err);

                    return successResponse(method_name, res, dbExercise);
                });
            });
        });
    });
};

exports.delete = function (req, res) {
  var method_name = "delete";

  _orm.connect(_dbconfig, function (err, db) {
    if (err)
      return errorResponse(method_name, res, err);

    var id = req.params.id;
    var model = getModel(db);
    
      // add the table to the database
    model.sync(function (err) {
      if (err)
        return errorResponse(method_name, res, err);

        // query the person table by surname
        model.get(id, function (err, dbExercise) {
          if (err)
            return errorResponse(method_name, res, err);

          dbExercise.remove(function (err) {
            if (err)
              return errorResponse(method_name, res, err);

            return res.status(200).send({'status':1});
          });
        });
    });
  });
};
