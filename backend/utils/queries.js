async function getQueryResults(query, req, res) {
    const err = handleQueries(query, req.query, res);
    if (err) {
        return;
    }

    try {
        const queryResult = await query.exec();
        res.status(200).json({
            message: "OK",
            data: queryResult
        });
    } catch (mongo_err) {
        res.status(404).json({
            message: "Mongo Error",
            data: mongo_err
        });
    }
}

function handleQueries(query, queries, res) { // returns true if error
    if (!query || !queries) return;

    if (queries.where) {
        try {
            queryConds = JSON.parse(queries.where);
            query.where(queryConds);
        } catch (err) {
            invalidQuery(err, res);
            return true;
        }
    }

    if (queries.select) {
        try {
            queryConds = JSON.parse(queries.select);
            query.select(queryConds);
        } catch (err) {
            invalidQuery(err, res);
            return true;
        }
    }

    if (queries.skip && Number.isInteger(+queries.skip)) {
        try {
            query.skip(+queries.skip);
        } catch (err) {
            invalidQuery(err, res);
            return true;
        }
    }

    if (queries.limit && Number.isInteger(+queries.limit)) {
        try {
            query.limit(+queries.limit);
        } catch (err) {
            invalidQuery(err, res);
            return true;
        }
    }

    if (queries.sort) {
        try {
            queryConds = JSON.parse(queries.sort);
            query.sort(queryConds);
        } catch (err) {
            invalidQuery(err, res);
            return true;
        }
    }

    if (queries.count && queries.count === "true") {
        try {
            query.countDocuments();
        } catch (err) {
            invalidQuery(err, res);
            return true;
        }
    }

    return false;
}

function invalidQuery(err, res) {
    res.status(404).json({
        message: "Invalid query",
        data: err
    });
}

module.exports = {
    getQueryResults,
    handleQueries,
    invalidQuery
};