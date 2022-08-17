sleep 10 | echo 'Waiting for the servers to start...'
mongo mongodb://shard1svr1:27017 /mongo/setup.js
