const mongoClient = require('mongodb').MongoClient;
const utils = require('./utils');

class Database {
    constructor() {
        this.client = null;
    }

    getDb(name) {
        if (!name) {
            name = this.database;
        }
        return this.client.db(name);
    }

    config(dbConfig, logger) {
        // pull the uri from environment variable
        const envMongoDbUri = process.env.MONGODB_URI;

        if (!envMongoDbUri) {
            logger.info('Mongo connection uri is not defined in environment variable, pulling it from config file');
        }


        // URI from env variable takes the preference over pulling it from config file
        logger.info(JSON.stringify(dbConfig));
        const mongoDbUri = (envMongoDbUri) ? envMongoDbUri : dbConfig.uri;
        logger.info(`Using mongo connection uri  ${mongoDbUri}`);

        return utils.retry(5, 20000, (() => this.getConnection(mongoDbUri)), logger);
    }

    getConnection(uri, logger) {
        return new Promise((resolve, reject) => {
            if (this.client) {
                resolve(this.client)
            }
            mongoClient.connect(uri, { useNewUrlParser: true })
                .then((ret, err) => {
                    if (err) {
                        const msg = (err) ? err.stack : err;
                        logger.error(`Error connecting to MongoDB uri: ${uri} error: ${msg}`);
                        throw Error(err);
                    }
                    this.client = ret;
                    resolve(this.client);
                });
        })

    };

    closeConnection() {
        return this.client.close();
    }
}

const db = new Database();

module.exports = db;
