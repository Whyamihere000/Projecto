import mysql from 'mysql2';

// Configurações das conexões
const dbConfigs = [
  {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'SitePAP',
  },
  {
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'SitePAP',
  },
];

// Função para tentar ligar-se a uma base de dados
const connectToDatabase = (configs, index = 0) => {
  if (index >= configs.length) {
    console.error('❌ Não foi possível ligar a nenhuma base de dados.');
    process.exit(1);
  }

  const db = mysql.createConnection(configs[index]);

  db.connect((err) => {
    if (err) {
      console.error(`❌ Erro na ligação à base de dados (Configuração ${index + 1}):`, err.message);
      connectToDatabase(configs, index + 1);
    } else {
      console.log(`✅ Ligação à base de dados bem-sucedida (Configuração ${index + 1})!`);
      // Guardar a conexão e continuar a aplicação
      global.dbConnection = db;
    }
  });
};

// Tentar ligar à base de dados
connectToDatabase(dbConfigs);

export default global.dbConnection;