'use strict'

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('route_map', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        hash: { type: Sequelize.STRING(64), allowNull: false, unique: true },
        route: { type: Sequelize.STRING(255), allowNull: false },
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    })
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('route_map')
}
