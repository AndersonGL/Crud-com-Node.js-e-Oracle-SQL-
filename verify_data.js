const sequelize = require("./config/database");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Oracle.");

    // This is the query Sequelize generates internally
    console.log("Running Query: SELECT \"id\", \"name\", \"email\", \"age\" FROM \"USUARIOS_NOVO2\"");
    
    const [results] = await sequelize.query('SELECT "id", "name", "email", "age" FROM "USUARIOS_NOVO2"');
    console.log("Data found in Node.js:", results);

    console.log("\n---------------------------------------------------");
    console.log("TO SEE THIS DATA IN ORACLE SQL DEVELOPER, RUN:");
    console.log('SELECT "id", "name", "email", "age" FROM USUARIOS_NOVO2;');
    console.log("---------------------------------------------------\n");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
})();
