module.exports = (sequelize, DataTypes) => {
    const Technology = sequelize.define('Technology', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })
    Technology.associate = (models) => {
        Technology.belongsToMany(models.Candidate, {
        through: models.CandidateTechnology,
        as: 'technologies',
        foreignKey: 'techId'
      });
    };
    return Technology
  }