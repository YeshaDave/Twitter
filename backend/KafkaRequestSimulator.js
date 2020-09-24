const { kafka_request_topic, kafka_response_topic } = require('./config');
const { init, send } = require('./kafka/connection');

// const sleep = msec => new Promise(r => setTimeout(r, msec));

const getCorrId = () => Math.random().toString(36).slice(2);

const openRequests = {};

/*
    sample msg = {
        correlationId: "xxyyzz",
        data: { "_id": "abcd" },
        error: { ...error object... },
        method: "getChats"
    }
*/
const onResponseTopicMessage = async ({ correlationId, data, error }) => {
    if (correlationId && openRequests[correlationId]) {
        openRequests[correlationId](error, data);
        delete openRequests[correlationId];
    }
}

const simulateRequestOverKafka = (method, payload) => {
    return new Promise((resolve, reject) => {
        try {
            const correlationId = getCorrId();
            send(kafka_request_topic, {
                correlationId, payload, method
            });
            openRequests[correlationId] = (err, data) => err ? reject(err) : resolve(data);
        } catch (e) {
            reject(e);
        }
    });
};

init(kafka_response_topic, onResponseTopicMessage);

module.exports = { simulateRequestOverKafka };

// const test = async () => {
//     await sleep(5000);
//     const data = await simulateRequestOverKafka("getPersons", {})
//     console.log(data);
// };

// test();