module.exports = function(sequelize, DataTypes) {
    var ItemStorage = sequelize.define("ItemStorage", {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      href: DataTypes.STRING,
      keywords: DataTypes.STRING
    });
    return ItemStorage;
}