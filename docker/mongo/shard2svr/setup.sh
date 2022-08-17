sleep 10 | echo 'Waiting for the servers to start...'
mongo mongodb://shard2svr1:27017 /mongo/setup.js
