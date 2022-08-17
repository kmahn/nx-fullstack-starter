rs.initiate(
  {
    _id: 'cfgrs',
    configsvr: true,
    members: [
      { _id: 0, host: 'cfgsvr1:27017' },
      { _id: 1, host: 'cfgsvr2:27017' },
      { _id: 2, host: 'cfgsvr3:27017' },
    ]
  }
)
