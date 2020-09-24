const DAL = require('./DAL');
const { kafka_request_topic, kafka_response_topic } = require('./config');
const { init, send } = require('./kafka/connection');

const sleep = msec => new Promise(r => setTimeout(r, msec));

/*
    sample msg = {
        correlationId: "abc",
        payload: { a: 1 },
        method: "getChats"
    }
*/
const onRequestTopicMessage = async ({ correlationId, payload, method }) => {
    if (correlationId && payload && method) {
        try {
            // custom method logic
            if (method === 'saveChat') {
                payload.ts = new Date();
            }

            const data = await DAL[method](payload);
            send(kafka_response_topic, { correlationId, data });
        } catch (e) {
            send(kafka_response_topic, { correlationId, error: e.message || e });
        }
    }
}

const startProcessing = async () => {
    init(kafka_request_topic, onRequestTopicMessage);
    // await sleep(5000);
    // send(kafka_request_topic, {
    //     correlationId: "abc",
    //     payload: {},
    //     method: "getPersons"
    // });
};

startProcessing();