To start the application just run the below command in the root directory of this application.


**Important**: For smooth process, I have pushed docker-env-dev.env and src/db/docker-mongo-dev.env (etc) files as well else these files need to be in .gitignore file

<h5>Following CMD Create two(node.js server and mongodb) containers defined in docker-compose.yaml</h5>

<code> cd gateway-test && sudo docker-compose up -d --build</code>

<h5>To see the logs run below command</h5>

<code>docker logs node-server -f OR docker attach node-server(if server is in running mode) </code>

<h5>Run the tests</h5>

<code>docker-compose run --rm node-server yarn run test --silent</code>

<h5>Remember to remove the containers, once you review/test</h5>

<code>docker-compose down -v</code>