const oracledb = require('oracledb');


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.DB_USER,  // usuarios_novo2
  password: process.env.DB_PASSWORD,  // 465280
  connectString: process.env.DB_CONNECTION_STRING, // 192.168.15.20:1521/XEXDB

};

module.exports.execute = async (sql, binds = {}, options = {}) => {
  const connection = await oracledb.getConnection(dbConfig);

  const result = await connection.execute(
    sql,
    binds,
    { autoCommit: true, ...options }
  );

  await connection.close();
  return result;
};
