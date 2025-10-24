// models/NginxLog.js
export default (sequelize, DataTypes) => {
    const NginxLog = sequelize.define(
        'NginxLog',
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            ip: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            route_hash: {
                type: DataTypes.STRING(64),
                allowNull: false,
            },
            data: {
                type: DataTypes.TEXT('long'),
                allowNull: false,
            },
            method: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            bytes: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'nginx_logs',
            timestamps: false,
            indexes: [
                { fields: ['route_hash'] },
                { fields: ['created_at'] },
            ],
        }
    )

    return NginxLog
}
