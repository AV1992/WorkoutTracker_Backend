const _orm = require('orm');
const _paging = require('orm-paging');
const _dbconfig = require('../dbconfig');

function getModel(db) {
    return db.define("user", {
        id: Number,
        name: String,
        surname: String,
        email: String,
        password: String,
        username: String
    });
}

function successResponse(method_name, res, obj) {
    console.log("[userController][" + method_name + "] | Success: " + JSON.stringify(obj));
    return res.status(200).send(obj);
}

function errorResponse(method_name, res, err) {
    // throw err;
    console.log("[userController][" + method_name + "] | Error: " + err);
    return res.status(500).send(err);
}

exports.getAll = function (req, res) {
    var method_name = "getAll";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var model = getModel(db);
        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // query the person table by surname
            model.find(function (err, dbUsers) {
                if (err)
                    return errorResponse(method_name, res, err);

                return successResponse(method_name, res, dbUsers);
            });
        });
    });
};

exports.getPage = function (req, res) {
    var method_name = "getPage";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var page = Number(req.params.page);
        var pageSize = Number(req.params.pageSize);
        var orderBy = req.params.orderBy;

        console.log("Page: " + page + " Page-Size: " + pageSize + " Order-By: " + orderBy);

        db.use(_paging);

        var model = getModel(db);
        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            model.settings.set("pagination.perpage", pageSize); // default is 20

            model.pages(function (err, pages) {
                if (err)
                    return errorResponse(method_name, res, err);

                console.log("Total pages: %d", pages);

                model.page(page).order(["name", "Z"], ["surname", "Z"]).run(function (err, dbUsers) {
                    if (err)
                        return errorResponse(method_name, res, err);

                    return successResponse(method_name, res, dbUsers);
                });
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
            model.get(id, function (err, dbUser) {
                if (err)
                    return errorResponse(method_name, res, err);

                return successResponse(method_name, res, dbUser);
            });
        });
    });
};

exports.getByUsernamePassword = function (req, res) {
    var method_name = "getById";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var username = req.params.username;
        var password = req.params.password;

        var model = getModel(db);
        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // query the person table by surname
            model.one({username: username, password: password}, function (err, dbUser) {
                if (err)
                    return errorResponse(method_name, res, err);

                return successResponse(method_name, res, dbUser);
            });
        });
    });
};

exports.create = function (req, res) {
	var user = req.body;

	createCheckEmail(user, res);
};

function createCheckEmail(user, res) {
	var method_name = "createCheckEmail";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var email = user.email;
        var model = getModel(db);

        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // query the person table by surname
            model.one({email: email}, function (err, dbUser) {
                if (err)
                    return errorResponse(method_name, res, err);

                if (dbUser == null) {
                	createCheckUsername(user, res);
                } else {
                	// email already taken
                	// return error
                	return res.status(200).send({'status':1});
                }
            });
        });
    });
}

function createCheckUsername(user, res) {
	var method_name = "createCheckUsername";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var username = user.username;
        var model = getModel(db);

        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // query the person table by surname
            model.one({username: username}, function (err, dbUser) {
                if (err)
                    return errorResponse(method_name, res, err);

                if (dbUser == null) {
                	create(user, res);
                } else {
                	// username already taken
                	// return error
                	return res.status(200).send({'status':2});
                }
            });
        });
    });
}

function create(user, res) {
	var method_name = "create";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var model = getModel(db);
        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // add a row to the person table
            model.create(user, function (err, dbUser) {
                if (err)
                    errorResponse(method_name, res, err);

                //return successResponse(method_name, res, dbUser);
                return res.status(201).send(dbUser);
            });
        });
    });
}

exports.update = function (req, res) {
    var method_name = "update";

    _orm.connect(_dbconfig, function (err, db) {
        if (err)
            return errorResponse(method_name, res, err);

        var user = req.body;
        var model = getModel(db);
        // add the table to the database
        model.sync(function (err) {
            if (err)
                return errorResponse(method_name, res, err);

            // query the person table by surname
            model.get(user.id, function (err, dbUser) {
                if (err)
                    return errorResponse(method_name, res, err);

                dbUser.name = user.name;
                dbUser.surname = user.surname;
                dbUser.email = user.email;
                dbUser.password = user.password;
                dbUser.username = user.username;

                dbUser.save(function (err) {
                    if (err)
                        return errorResponse(method_name, res, err);

                    return successResponse(method_name, res, dbUser);
                });
            });
        });
    });
};
