const RatingModel = require('../../../models/ratings');
const VideoModel = require('../../../models/video');
const VideoAnalysisModel = require('../../../models/videoAnalysis');
const utils = require('../../../lib/utils');
const Joi = require('@hapi/joi');
const ObjectId = require('mongodb').ObjectId;


function getVideoAnalysisDetails(req, res, next) {
    const logger = req.logger;
    const clientId = req.query.client || 'default';
    utils.setLogTokens(logger, 'videoAnalysis', 'getVideoAnalysisDetails', req.query.client, null);
    let model = new VideoAnalysisModel(logger);
    return model.getVideoAnalysisList(
        req.app.kraken,
        clientId,
        req.query.videoId,
        null,
        null,
        null,
        null,
        null
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function createVideoAnalysis(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videoAnalysis', 'createVideoAnalysis', req.query.client, null);
    const clientId = req.query.client || 'default';
    var requestBody = req.body;
    const schema = Joi.object().keys({
        _id: Joi.optional(),
        createdDate: Joi.optional(),
        lastUpdatedDate: Joi.optional(),
        shown_title: Joi.string().required(),
        shown_description: Joi.string(),
        reality_title: Joi.string().required(),
        reality_description: Joi.string(),
        reality_source: Joi.string().required(),
        link: Joi.string().required(),
        rating_id: Joi.string().alphanum().min(24).max(24).required(),
        video_id: Joi.string().alphanum().min(24).max(24).required(),
        end_time_in_sec: Joi.number().required()
    });

    const {error, value} = Joi.validate(requestBody, schema);
    if (error) {
        return res.status(400).json({error: error.message});
    }

    const videoAnalysisObj = {
        'shown_title': value.shown_title,
        'shown_description': value.shown_description,
        'reality_title': value.reality_title,
        'reality_description': value.reality_description,
        'reality_source': value.reality_source,
        'link': value.link,
        'rating': {
            '$ref': 'rating',
            '$id': ObjectId(value.rating_id)
        },
        'video': {
            '$ref': 'video',
            '$id': ObjectId(value.video_id)
        },
        'end_time_in_sec': value.end_time_in_sec,
        'client_id': clientId
    };

    const asyncCreateVideoAnalysisModel = async () => {
        const ratingDetails = await getRatingDetails(
            req.app.kraken,
            clientId,
            value.rating_id,
            logger
        );
        if (!ratingDetails.data) {
            return res.status(404).json({'error': 'rating id mismatch'});
        }
        const videoDetails = await getVideoDetails(
            req.app.kraken,
            null,
            value.video_id,
            logger
        );
        if (!videoDetails.data) {
            return res.status(404).json({'error': 'video id mismatch'});
        }
        let model = new VideoAnalysisModel(logger);
        return await model.createVideoAnalysis(
            req.app.kraken,
            videoAnalysisObj
        ).then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        }).catch(next);
    };

    asyncCreateVideoAnalysisModel();

}

function updateVideoAnalysis(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videoAnalysis', 'updateVideoAnalysis', req.query.client, null);
    const clientId = req.query.client || 'default';
    let requestBody = req.body;
    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().min(24).max(24).required(),
        createdDate: Joi.optional(),
        lastUpdatedDate: Joi.optional(),
        shown_title: Joi.string().required(),
        shown_description: Joi.string(),
        reality_title: Joi.string().required(),
        reality_description: Joi.string(),
        reality_source: Joi.string().required(),
        link: Joi.string().required(),
        rating_id: Joi.string().alphanum().min(24).max(24).required(),
        video_id: Joi.string().alphanum().min(24).max(24).required(),
        end_time_in_sec: Joi.number().required()
    });

    const {error, value} = Joi.validate(requestBody, schema);
    if (error) {
        return res.status(400).json({error: error.message});
    }
    const videoAnalysisObj = {
        'shown_title': value.shown_title,
        'shown_description': value.shown_description,
        'reality_title': value.reality_title,
        'reality_description': value.reality_description,
        'reality_source': value.reality_source,
        'link': value.link,
        'rating': {
            '$ref': 'rating',
            '$id': ObjectId(value.rating_id)
        },
        'video': {
            '$ref': 'video',
            '$id': ObjectId(value.video_id)
        },
        'end_time_in_sec': value.end_time_in_sec,
        'client_id': clientId
    };

    const asyncUpdateVideoAnalysisModel = async () => {
        const ratingDetails = await getRatingDetails(
            req.app.kraken,
            clientId,
            value.rating_id,
            logger
        );
        if (!ratingDetails.data) {
            return res.status(404).json({'error': 'rating id mismatch'});
        }
        const videoDetails = await getVideoDetails(
            req.app.kraken,
            null,
            value.video_id,
            logger
        );
        if (!videoDetails.data) {
            return res.status(404).json({'error': 'video id mismatch'});
        }
        let model = new VideoAnalysisModel(logger);
        return model.updateVideoAnalysis(
            req.app.kraken,
            clientId,
            req.params.id,
            videoAnalysisObj
        ).then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            return res.status(404).json({'error': 'video id mismatch'});
        }).catch(next);
    };
    asyncUpdateVideoAnalysisModel();

}

function getVideoDetails(config, clientId, videoId, logger) {
    let model = new VideoModel(logger);
    return model.getCachedVideoDetails(
        config,
        clientId,
        videoId
    ).then((result) => {
        return result;
    });
}

function getRatingDetails(config, clientId, ratingId, logger) {
    let model = new RatingModel(logger);
    return model.getRatingDetails(
        config,
        clientId,
        ratingId
    ).then((result) => {
        return result;
    });
}


function deleteVideoAnalysis(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videoAnalysis', 'deleteVideoAnalysis', req.query.client, null);
    const clientId = req.query.client || 'default';

    let model = new VideoAnalysisModel(logger);
    return model.deleteVideoAnalysis(
        req.app.kraken,
        clientId,
        req.params.id
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}


module.exports = function routes(router) {
    router.post('/', createVideoAnalysis);
    router.get('/', getVideoAnalysisDetails);
    router.put('/:id', updateVideoAnalysis);
    router.delete('/:id', deleteVideoAnalysis);
};
