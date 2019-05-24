module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resumeLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    interviewedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    feedbackAtContact: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    feedback: {
      type: DataTypes.STRING,
      allowNull: true
    },
  })
  Candidate.associate = function (models) {
    Candidate.belongsToMany(models.Technology, {
      through: models.CandidateTechnology,
      as: 'technologies',
      foreignKey: 'candidateId'
    });
    Candidate.belongsToMany(models.Company, {
      through: models.CandidateCompany,
      as: 'companies',
      foreignKey: 'candidateId'
    });
  };
  return Candidate
}
