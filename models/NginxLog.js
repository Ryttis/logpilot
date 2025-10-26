// models/NginxLog.js
export default (sequelize, DataTypes) => {
    const NginxLog = sequelize.define(
        'NginxLog',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            ip: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            route: {
                type: DataTypes.TEXT('long'),
                allowNull: false,
            },
            method: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            status: {
                type: DataTypes.SMALLINT,
                allowNull: false,
            },
            bytes: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'nginx_logs',
            timestamps: false,
        }
    );

    return NginxLog;
};
