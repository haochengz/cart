
// local mongodb host
// user: dev, pwd: 123456

dev_db_user = 'dev'
dev_db_pwd = '123456'
dev_db_host = '127.0.0.1'
dev_db_port = '27017'
dev_db_name = 'mall'

dev_db_con = `mongodb://${dev_db_user}:${dev_db_pwd}@${dev_db_host}:${dev_db_port}/${dev_db_name}`

db_con = dev_db_con

module.exports.db_con = db_con
