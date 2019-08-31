const MongoBase = require('../lib/MongoBase');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
const Cache = require('../lib/cacheService');
var ObjectId = require('mongodb').ObjectId;


const ttl = 60 * 60 * 6; // cache for 6 Hour
const cache = new Cache(ttl);

class VideoModel extends MongoBase {
    /**
     * Creates a new VideoModel.
     * @param logger The logger to use.
     */
    constructor(logger) {
        super(logger, 'video');
        this.logger = logger;
    }

    getVideoList(config, clientId, sortBy, sortAsc, limit, next, previous) {
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

    getVideoDetails(config, clientId, videoId) {
        const query = {};
        query._id = ObjectId(videoId);
        query.client_id = clientId;
        const database = config.get('databaseConfig:databases:factcheck');
        return this.collection(database).findOne(query)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            });
    }

    getCachedVideoDetails(config, clientId, videoId) {
        const query = {};
        query._id = ObjectId(videoId);
        query.client_id = clientId;
        const database = config.get('databaseConfig:databases:factcheck');
        const key = `VIDEO_${videoId}`;
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

    createVideo(config, videoDetails) {
        const database = config.get('databaseConfig:databases:factcheck');
        return this.collection(database).insertOne(videoDetails)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            });
    }

    updateVideo(config, clientId, videoId, videoDetails) {
        const query = {};
        query._id = ObjectId(videoId);
        query.client_id = clientId;
        const database = config.get('databaseConfig:databases:factcheck');
        return this.collection(database).updateOne(query, videoDetails)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            });
    }
}

module.exports = VideoModel;
