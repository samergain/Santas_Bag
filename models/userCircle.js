module.exports = function(sequelize, DataTypes) {
    var UserCircle = sequelize.define("UserCircle", {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      budget: DataTypes.INTEGER,
      keywords: DataTypes.STRING
    });
  
    UserCircle.associate = function(models) {
      // We're saying that a userCircle should belong to a user
      // A userCircle can't be created without a user due to the foreign key constraint
      UserCircle.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
      UserCircle.hasMany(models.Gift, {
        onDelete: "cascade"
      });
    };

    return UserCircle;
};