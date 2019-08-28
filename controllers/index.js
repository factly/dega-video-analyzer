'use strict';

var RatingModel = require('../models/ratings');
const utils = require('../lib/utils');


module.exports = function (router) {



    router.get('/', function (req, res) {
        const logger = req.logger;
        utils.setLogTokens(logger, 'ratings', 'getRating', req.query.client, null);
        var model = new RatingModel(logger);
        return model.getRating(
            req.app.kraken,
            '',
            req.query.sortBy,
            req.query.sortAsc,
            req.query.limit,
            req.query.next,
            req.query.previous
        ).then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        }).catch(console.log('err'));

    });

    router.get('/:ratingId', function (req, res) {
        const logger = req.logger;
        utils.setLogTokens(logger, 'ratings', 'getRating', req.query.client, null);
        var model = new RatingModel(logger);
        return model.getRatingDetails(
            req.app.kraken,
            '',
            req.params.ratingId
        ).then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        }).catch(console.log('err'));

    });

};
