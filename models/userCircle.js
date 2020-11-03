module.exports = function(sequelize, DataTypes) {
    var userCircle = sequelize.define("userCircle", {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      budget: DataTypes.INTEGER,
      keywords: DataTypes.STRING
    });
  
    userCircle.associate = function(models) {
      // We're saying that a userCircle should belong to a user
      // A userCircle can't be created without a user due to the foreign key constraint
      userCircle.belongsTo(models.user, {
        userId: {
          allowNull: false
        }
      });
      userCircle.belongsTo(models.gift, {
        giftId: {
          allowNull: false
        }
      });
    };
  
    return userCircle;
  };