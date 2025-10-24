export default (sequelize, DataTypes) => {
    const RouteMap = sequelize.define('RouteMap', {
        hash: { type: DataTypes.STRING, unique: true },
        route: DataTypes.STRING,
        created_at: DataTypes.DATE
    }, {
        tableName: 'route_map',
        timestamps: false
    })
    return RouteMap
}
