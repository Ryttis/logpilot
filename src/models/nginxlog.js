export default (sequelize, DataTypes) => {
    const NginxLog = sequelize.define('NginxLog', {
        ip: {
            type: DataTypes.STRING(45),
            allowNull: false,
            index: true,
        },
        route_hash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            index: true,
        },
        data: {
            type: DataTypes.TEXT('long'), // base64-encoded payload
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
    }, {
        tableName: 'nginx_logs',
        timestamps: false,
        indexes: [
            { fields: ['ip'] },
            { fields: ['route_hash'] },
            { fields: ['status'] },
        ],
    })

    return NginxLog
}
