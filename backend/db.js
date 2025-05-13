import mysql from 'mysql2';

// Configurações das duas contas
const config1 = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'SitePAP',
};

const config2 = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'SitePAP',
};

let db;

// Tenta a primeira conexão
db = mysql.createConnection(config1);

db.connect((err) => {
    if (err) {
        console.warn('⚠️ Primeira ligação falhou. Tentando a segunda conta...');
        
        // Tenta a segunda conexão
        db = mysql.createConnection(config2);
        db.connect((err2) => {
            if (err2) {
                console.error('❌ Ambas as ligações falharam:', err2.message);
            } else {
                console.log('✅ Ligação bem-sucedida com a segunda conta!');
            }
        });

    } else {
        console.log('✅ Ligação bem-sucedida com a primeira conta!');
    }
});

export default db;
