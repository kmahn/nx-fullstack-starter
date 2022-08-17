sleep 10 | echo 'Waiting for the servers to start...'
mongo mongodb://cfgsvr1:27017 /mongo/setup.js
