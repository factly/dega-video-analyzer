const MongoBase = require('../lib/MongoBase');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
const Cache = require('../lib/cacheService');
var ObjectId = require('mongodb').ObjectId;


const ttl = 60 * 60 * 6; // cache for 6 Hour
const cache = new Cache(ttl);

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

        // query.client_id = clientId;
        const pagingObj = utils.getPagingObject(query, sortBy, sortAsc, limit, next, previous);
        const database = config.get('databaseConfig:databases:factcheck');
        const key = 'ALL_RATINGS';
        return cache.get(key, () => MongoPaging.find(this.collection(database), pagingObj)
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
            })
        ).then((result) => {
            return result;
        });
    }


    getRatingDetails(config, clientId, ratingId) {
        const query = {};
        query._id = ObjectId(ratingId);
        query.client_id = clientId;
        const database = config.get('databaseConfig:databases:factcheck');
        const key = `RATING_${ratingId}`;
        return cache.get(key, () => this.collection(database).findOne(query)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            })).then((result) => {
                return result;
            }
        );
    }
}

module.exports = RatingModel;
