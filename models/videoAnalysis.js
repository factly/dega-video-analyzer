const MongoBase = require('../lib/MongoBase');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
var ObjectId = require('mongodb').ObjectId;

class VideoAnalysisModel extends MongoBase {
    /**
     * Creates a new videoAnalysisModel.
     * @param logger The logger to use.
     */
    constructor(logger) {
        super(logger, 'video_analysis');
        this.logger = logger;
    }

    getVideoAnalysisList(config, clientId, videoId, sortBy, sortAsc, limit, next, previous) {
        const query = {};

        query.client_id = clientId;
        query.video.$id = ObjectId(videoId);

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

    getVideoAnalysisDetails(config, clientId, videoId) {
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

    createVideoAnalysis(config, videoAnalysisDetails) {
        const database = config.get('databaseConfig:databases:factcheck');
        return this.collection(database).insertOne(videoAnalysisDetails)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            });
    }

    updateVideoAnalysis(config, clientId, id, videoAnalysisDetails) {
        const query = {};
        query._id = ObjectId(id);
        query.client_id = clientId;
        const database = config.get('databaseConfig:databases:factcheck');
        return this.collection(database).updateOne(query, videoAnalysisDetails)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            });
    }

    deleteVideoAnalysis(config, clientId, id) {
        const query = {};
        query._id = ObjectId(id);
        query.client_id = clientId;
        const database = config.get('databaseConfig:databases:factcheck');
        return this.collection(database).deleteOne(query)
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result;
                return response;
            });
    }
}

module.exports = VideoAnalysisModel;
