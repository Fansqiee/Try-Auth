const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:'postgres',
        port:process.env.DB_PORT,
        logging: false,
        pool:{
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectionDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to Postgre DB....');
        await sequelize.sync();
    } catch (err) {
        console.error('Unable to connect to DB', err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectionDB };