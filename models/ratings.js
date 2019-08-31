const MongoBase = require('../lib/MongoBase');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
var ObjectId = require('mongodb').ObjectId;

class RatingModel extends MongoBase {
    /**
     * Creates a new RatingModel.
     * @param logger The logger to use.
     */
    constructor(logger) {
        super(logger, 'rating');
        this.logger = logger;
    }

    getRating(config, clientId, sortBy, sortAsc, limit, next, previous) {
        const query = {};

        query.client_id = clientId;
        const pagingObj = utils.getPagingObject(query, sortBy, sortAsc, limit, next, previous);
        const database = config.get('databaseConfig:databases:factcheck');
        return MongoPaging.find(this.collection(database), pagingObj)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result.results;
                response.paging = {};
                response.paging.next = result.next;
                response.paging.hasNext = result.hasNext;
                response.paging.previous = result.previous;
                response.paging.hasPrevious = result.hasPrevious;
                return response;
            });
    }

    getRatingDetails(config, clientId, ratingId) {
        const query = {};
        query._id = ObjectId(ratingId);
        query.client_id = clientId;
        const database = config.get('databaseConfig:databases:factcheck');
        return this.collection(database).findOne(query)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            }).catch(
                (err) => {
                    console.log(err)
                }
            );
    }
}

module.exports = RatingModel;
