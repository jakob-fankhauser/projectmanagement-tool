import mysql from 'mysql2/promise';

const parseConnectionString = (url) => {
  const matches = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  return {
    user: matches[1],
    password: matches[2],
    host: matches[3],
    port: parseInt(matches[4]),
    database: matches[5]
  };
};

const dbConfig = parseConnectionString(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;