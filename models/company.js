module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
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
  Company.associate = (models) => {
    Company.belongsToMany(models.Candidate, {
      through: models.CandidateCompany,
      as: 'candidates',
      foreignKey: 'companyId'
    });
  };
  return Company
}