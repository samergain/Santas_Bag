module.exports = function(sequelize, DataTypes) {
    var Gift = sequelize.define("Gift", {
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      price: DataTypes.INTEGER,
      keywords: DataTypes.STRING,
      href: DataTypes.STRING
    });
  
    Gift.associate = function(models) {
      Gift.hasMany(models.userCircle, {
        onDelete: "Null"
      });
    };
  
    return Gift;
  };