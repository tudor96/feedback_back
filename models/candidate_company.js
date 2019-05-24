'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateCompany = sequelize.define('CandidateCompany', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    candidateId: DataTypes.INTEGER,
    companyId: DataTypes.INTEGER
  }, {});
  CandidateCompany.associate = (models) => {
    // associations can be defined here
  };
  return CandidateCompany;
};