const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER_NAME,
    database: process.env.DB_NAME,
    port: 1433,
    options: {
        encrypt: false, 
        trustServerCertificate: true
    }
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

