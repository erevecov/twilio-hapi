'use strict';
//let twilio = require('twilio')
const Wreck = require('@hapi/wreck');
const moment = require('moment');

exports.plugin = {
    pkg: {
        name: 'twilio-hapi'
    },
    register: async function (server, options) {

        // Create a route for example
        let socios = {
            "+56951974430": {
                name: 'fabian',
                imei: '864895032499137'
            },
            "+5656117191": {
                name: 'renato',
                imei: '864895032499137'
            }
        }

        server.route([
            {
                method: 'POST',
                path: '/api/smsInbound',
                options: {
                    auth: false,
                    handler: async (request, h) => {
                        try {
                            let inbound = request.payload;
                            console.log('INBOUND', inbound);

                            if(socios[inbound.From]) {
                                if(inbound.Body.toUpperCase() == 'DONDE ESTA MI WEA') {
                                    let { res, payload } = await Wreck.get(`https://fabian.vpsgrifo.tk/gps/get/${socios[inbound.From].imei}`);
                                    payload = JSON.parse(payload);

                                    if(!payload.err) {
                                        let response = h.response(`
                                            GPS TRACKER PATACON\n\nÚltimo registro:\n${moment(payload.date).format('DD/MM/YYYY HH:mm:ss')}\n\nLatitud:\n${payload.lat}\n\nLongitud:\n ${payload.lng}\n\nhttps://maps.google.com/?q=${payload.lat},${payload.lng}
                                        `);

                                        response.type('text/plain');
                                        response.header('X-Custom', 'new request');
                                        return response;
                                    }
                                } else {
                                    let response = h.response(`MENSAJE NO MANEJADO`);

                                    response.type('text/plain');
                                    response.header('X-Custom', 'new request');
                                    return response;
                                }
                            } else {
                                let response = h.response(`USUARIO NO HABILITADO`);

                                response.type('text/plain');
                                response.header('X-Custom', 'new request');
                                return response;
                            }

                        } catch (error) {
                            throw error;
                        }
                        
                    }
                }
            }
            
        ]);
    }
};