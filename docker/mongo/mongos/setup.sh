sleep 30 | echo 'Waiting for the servers to start...'
mongo mongodb://mongos:27017 /mongo/setup.js
