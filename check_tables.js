const sequelize = require("./config/database");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Oracle.");

    const [results] = await sequelize.query("SELECT table_name FROM user_tables");
    console.log("All Tables:", results.map(r => r.TABLE_NAME || r.table_name));

    const matched = results.filter(r => (r.TABLE_NAME || r.table_name).toLowerCase().includes('usuario'));
    console.log("Matched Tables:", matched);

    if (matched.length > 0) {
        console.log("Checking data in found tables...");
        for (const row of matched) {
            const tableName = row.TABLE_NAME || row.table_name;
            // Quote the table name to handle case sensitivity if needed
            const [count] = await sequelize.query(`SELECT count(*) as c FROM "${tableName}"`);
            console.log(`Table "${tableName}" has ${count[0].c || count[0].C} rows.`);
        }
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
})();
