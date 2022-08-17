rs.initiate(
  {
    _id: 'shard2rs',
    members: [
      { _id: 0, host: 'shard2svr1:27017' },
      { _id: 1, host: 'shard2svr2:27017' },
      { _id: 2, host: 'shard2svr3:27017' },
    ]
  }
)
