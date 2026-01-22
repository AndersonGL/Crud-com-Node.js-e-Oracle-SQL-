const oracledb = require('oracledb');


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
   privilege: oracledb.SYSDBA 
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
