'use strict'

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('nginx_logs', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ip: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        route_hash: {
            type: Sequelize.STRING(64),
            allowNull: false,
        },
        data: {
            type: Sequelize.TEXT('long'),
            allowNull: false,
        },
        method: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        status: {
            type: Sequelize.SMALLINT,
            allowNull: false,
        },
        bytes: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.fn('NOW'),
        },
    })

    await queryInterface.addIndex('nginx_logs', ['ip'])
    await queryInterface.addIndex('nginx_logs', ['route_hash'])
    await queryInterface.addIndex('nginx_logs', ['status'])
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('nginx_logs')
}
