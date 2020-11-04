module.exports = function(sequelize, DataTypes) {
    var Gift = sequelize.define("Gift", {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      href: DataTypes.STRING
    });
  
    Gift.associate = function(models) {
      Gift.belongsTo(models.UserCircle, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Gift;
};