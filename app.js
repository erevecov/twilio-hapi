'use strict';

const Hapi     = require('@hapi/hapi');
const Twilio   = require('./plugins/twilio-hapi')

const init = async () => {

    const server = Hapi.server({
        port: 4000,
        host: '0.0.0.0'
    });

    await server.register([Twilio])

    await server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Server running on %ss', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();