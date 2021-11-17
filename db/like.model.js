module.exports = function (sequalize, DataTypes) {
  const Like = sequalize.define('Like', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
  }, {
    tableName: 'likes',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'liked_by']
      }
    ]
  });

  Like.associate = function (db) {
    db.Like.belongsTo(db.User, {foreignKey: 'liked_by', allowNull: false});
    db.Like.belongsTo(db.User, {foreignKey: 'user_id', allowNull: false});
  };

  return Like;
};
