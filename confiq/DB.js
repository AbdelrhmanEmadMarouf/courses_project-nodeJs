const sql = require('mssql/msnodesqlv8');

const config = {
    server: process.env.DB_SERVER_NAME,
    database: process.env.DB_NAME,
    options: {
        trustedConnection: true, // Set to true if using Windows Authentication
        trustServerCertificate: true, // Set to true if using self-signed certificates
    },
   driver: "ODBC Driver 18 for SQL Server", // Uncomment to use specific driver
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log("Connected to SQL Server");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
};

module.exports = {
    sql,
    connectDB
}

