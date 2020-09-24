const { KafkaClient, Producer, Consumer } = require('kafka-node');
const { kafka_connString, kafka_username, kafka_password, kafka_request_topic, kafka_response_topic } = require('../config');
const createTopics = [kafka_request_topic, kafka_response_topic];

class KafkaConnection {
    constructor() {
        this.kafkaConf = { kafkaHost: kafka_connString };
        this.client = null;
        this.producer = null;
        this.consumer = null;
    }

    init(requestTopic, requestCallback) {
        this.client = new KafkaClient(this.kafkaConf);
        this.client.on('connect', () => console.log('connected to kafka at', kafka_connString));
        this.client.on('error', err => console.error('error connecting to kafka at', kafka_connString, 'error:', err));
        this._initConsumer(requestTopic, requestCallback);
        this._initProducer();
    }

    _initProducer() {
        this.producer = new Producer(this.client);
        this.producer.on('ready', () => {
            this.producer.createTopics(createTopics, (err, data) => {
                if (err) {
                    console.error('error in createtopis', err);
                } else {
                    console.log('producer ready, topic created', data);
                }
            });
        });
        this.producer.on('error', err => console.error('producer error', err));
    }

    _initConsumer(requestTopic, requestCallback) {
        this.consumer = new Consumer(
            this.client,
            requestTopic.split(",").map(topic => ({ topic, partitions: 1 })),
            // [{ topic: 'request', partitions: 1 }, { topic: 'response', partitions: 1 }],
            { autoCommit: true, groupId: "group1" }
        );
        this.consumer.on('error', err => console.error('consumer local', err));
        this.consumer.on('message', msg => {
            const jsonData = JSON.parse(msg.value);
            requestCallback(jsonData)
        });
    }

    /*
        example "payload" = {
            correlationId: "abcd",
            data: { a: 1, b: 2 },
            method: "getPersons"
        };
    */
    send(topic, payload) {
        this.producer.send([{ topic, messages: JSON.stringify(payload), partitions: 1 }], () => { });
    }
}


// leaving old "node-rdkafka" code for reference
// class KafkaConnection {
//     constructor() {
//         this.kafkaConf = {
//             "group.id": "group1",
//             "metadata.broker.list": kafka_connString.split(","),
//             "socket.keepalive.enable": true,
//             "security.protocol": "SASL_SSL",
//             "sasl.mechanisms": "SCRAM-SHA-256",
//             "sasl.username": kafka_username,
//             "sasl.password": kafka_password,
//             "debug": "generic,broker,security"
//         };
//         this.producer = null;
//         this.consumer = null;
//     }


//     init(requestTopic, requestCallback) {
//         this._initConsumer(requestTopic, requestCallback);
//         this._initProducer();
//     }

//     _initProducer() {
//         this.producer = new kafka.Producer(this.kafkaConf);
//         this.producer.on("ready", arg => console.log(`Produces ${arg.name} ready`));
//         this.producer.on("event.error", err => console.error('producer event.err', err));
//         this.producer.connect();
//     }

//     _initConsumer(requestTopic, requestCallback) {
//         const topics = requestTopic.split(",");
//         this.consumer = new kafka.KafkaConsumer(this.kafkaConf, { "auto.offset.reset": "beginning" });
//         this.consumer.on("ready", arg => {
//             console.log(`Consumer ${arg.name} ready`);
//             this.consumer.subscribe(topics);
//             this.consumer.consume();
//         });
//         this.consumer.on("data", data => {
//             const jsonData = JSON.parse(data.value.toString());
//             // console.log(jsonData);
//             requestCallback(jsonData);

//         });
//         this.consumer.on("disconnected", err => console.error('consumer disconnected', err));
//         this.consumer.on("event.error", err => console.error('consumer event.err', err));
//         this.consumer.connect();
//     }

//     /*
//         example "payload" = {
//             correlationId: "abcd",
//             data: { a: 1, b: 2 }
//         };
//     */
//     send(topic, payload) {
//         return this.producer.produce(topic, -1, Buffer.from(JSON.stringify(payload)));
//     }
// }

const kafkaConn = new KafkaConnection();
module.exports = {
    init: kafkaConn.init.bind(kafkaConn),
    send: kafkaConn.send.bind(kafkaConn)
};