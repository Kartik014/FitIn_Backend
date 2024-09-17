import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'fitin-database.ct6a4uiaw2sr.us-east-1.rds.amazonaws.com',
    database: 'FitIn_Database',
    password: 'PUFAVRHTFP',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
})

pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected');
        release();
    }
});

export default pool;