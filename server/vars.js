
// local mongodb host
// user: dev, pwd: 123456

const devdbuser = 'dev'
const devdbpwd = '123456'
const devdbhost = '127.0.0.1'
const devdbport = '27017'
const devdbname = 'mall'

const devdbcon = `mongodb://${devdbuser}:${devdbpwd}@${devdbhost}:${devdbport}/${devdbname}`

const dbcon = devdbcon

module.exports.dbcon = dbcon
