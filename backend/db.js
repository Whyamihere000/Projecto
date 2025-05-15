import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'SitePAP',
});

db.connect((err) => {
    if (err) {
      console.error('❌ Erro na ligação à base de dados:', err.message);
    } else {
      console.log('✅ Ligação à base de dados bem-sucedida!');
    }
});

export default db;