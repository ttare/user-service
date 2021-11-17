module.exports = {
  up: function (queryInterface, DataTypes) {
    return Promise.all([
      this.createUserTable(queryInterface, DataTypes),
      this.createLikeTable(queryInterface, DataTypes),
    ])
  },

  createUserTable: function (queryInterface, DataTypes) {
    let tableDef = {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      salt: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: DataTypes.DATE
    };
    return queryInterface.createTable('users', tableDef);
  },

  createLikeTable: function (queryInterface, DataTypes) {
    let tableDef = {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        model: 'users',
        key: 'id'
      },
      liked_by: {
        type: DataTypes.UUID,
        allowNull: false,
        model: 'users',
        key: 'id'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    };
    return queryInterface.createTable('likes', tableDef);
  }
};
