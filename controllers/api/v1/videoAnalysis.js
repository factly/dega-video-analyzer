const VideoAnalysisModel = require('../../../models/videoAnalysis');
const utils = require('../../../lib/utils');
const Joi = require('@hapi/joi');


function getVideoAnalysisList(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videoAnalysis', 'getVideoAnalysisList', req.query.client, null);
    var model = new VideoAnalysisModel(logger);
    return model.getVideoAnalysisList(
        req.app.kraken,
        '',
        req.query.videoId,
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
    }).catch(next);
}


function getVideoAnalysisDetails(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videoAnalysis', 'getVideoAnalysisDetails', req.query.client, null);
    const clientId = req.query.client;
    var model = new VideoAnalysisModel(logger);
    return model.getVideoDetails(
        req.app.kraken,
        '',
        req.params.videoId
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
    const clientId = req.query.client;
    var requestBody = req.body;
    const schema = Joi.object().keys({
        shown_title: Joi.string().required(),
        shown_description: Joi.string(),
        reality_title: Joi.string().required(),
        reality_description: Joi.string(),
        reality_source: Joi.string().required(),
        youtube_link: Joi.string().required(),
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
        'youtube_link': value.youtube_link,
        'rating': {
            '$id': value.rating_id,
            '$ref': 'video',
        },
        'video': {
            '$id': value.video_id,
            '$ref': 'video',
        },
        'end_time_in_sec': value.end_time_in_sec,
        'client_id': clientId
    };

    var model = new VideoAnalysisModel(logger);
    return model.createVideoAnalysis(
        req.app.kraken,
        value
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function updateVideoAnalysis(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videoAnalysis', 'updateVideoAnalysis', req.query.client, null);
    const clientId = req.query.client;

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().min(24).max(24).required(),
        shown_title: Joi.string().required(),
        shown_description: Joi.string(),
        reality_title: Joi.string().required(),
        reality_description: Joi.string(),
        reality_source: Joi.string().required(),
        youtube_link: Joi.string().required(),
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
        'youtube_link': value.youtube_link,
        'rating': {
            '$id': value.rating_id,
            '$ref': 'video',
        },
        'video': {
            '$id': value.video_id,
            '$ref': 'video',
        },
        'end_time_in_sec': value.end_time_in_sec,
        'client_id': clientId
    };



    var model = new VideoAnalysisModel(logger);
    return model.updateVideoAnalysis(
        req.app.kraken,
        clientId,
        req.params.id,
        value
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function deleteVideoAnalysis(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videoAnalysis', 'deleteVideoAnalysis', req.query.client, null);
    const clientId = req.query.client;

    var model = new VideoAnalysisModel(logger);
    return model.deleteVideoAnalysis(
        req.app.kraken,
        '',
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
    router.get('/', getVideoAnalysisList);
    router.post('/', createVideoAnalysis);
    router.get('/:id', getVideoAnalysisDetails);
    router.put('/:id', updateVideoAnalysis);
    router.delete('/:id', deleteVideoAnalysis);
};
