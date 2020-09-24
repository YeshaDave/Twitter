# Twitter
273 Twitter Prototype Project

## Starting node-server from /backend:

Run npm install - This will install all the dependencies listed in the package.json.
Run npm start in the backend folder. node app.js will start the server on port 3001

## Starting the react application from /frontend:

From the root directory, go to frontend folder. Run npm install in the frontend folder.
Run npm start and the client will be started at port 3000. The proxy has been configured to make all the requests to port 3001.

## Starting node-server from /db-service:

Run npm install - This will install all the dependencies listed in the package.json.
Run npm start in the db-service folder. node server.js will start the server.

## Database

Schema for all the required Mongo DB collections,SQL connection,queries have been defined in the /db-service/models folder. 

## Deployment

Frontend will be running on EC2 instane one. Backend and Kafka-Backend will be running on EC2 instance two.

## Kafka Topics
1. User
2. Profile
3. Follow
4. Tweets
5. Bookmarks
6. Messages
7. Lists
8. Analytics
