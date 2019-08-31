const VideoModel = require('../../../models/video');
const utils = require('../../../lib/utils');
const Joi = require('@hapi/joi');


function getVideoList(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videos', 'getVideoList', req.query.client, null);
    var model = new VideoModel(logger);
    return model.getVideoList(
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
    }).catch(next);
}


function getVideoDetails(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videos', 'getVideoDetails', req.query.client, null);
    const clientId = req.query.client;
    var model = new VideoModel(logger);
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

function createVideo(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videos', 'createVideoEntry', req.query.client, null);
    const clientId = req.query.client;
    var requestBody = req.body;
    const schema = Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string(),
        youtube_link: Joi.string().required(),
        slug: Joi.string().required()
    });

    const {error, value} = Joi.validate(requestBody, schema);
    if (error) {
        return res.status(400).json({error: error.message});
    }

    var model = new VideoModel(logger);
    return model.createVideo(
        req.app.kraken,
        '',
        value
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function updateVideo(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'videos', 'updateVideoDetails', req.query.client, null);
    const clientId = req.query.client;

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().min(24).max(24).required(),
        title: Joi.string().required(),
        description: Joi.string(),
        youtube_link: Joi.string().required(),
        slug: Joi.string().required()
    });

    const {error, value} = Joi.validate(requestBody, schema);
    if (error) {
        return res.status(400).json({error: error.message});
    }


    var model = new VideoModel(logger);
    return model.updateVideo(
        req.app.kraken,
        '',
        req.params.videoId,
        value
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}



module.exports = function routes(router) {
    router.get('/', getVideoList);
    router.post('/', createVideo);
    router.get('/:videoId', getVideoDetails);
    router.put('/:videoId', updateVideo);
};
