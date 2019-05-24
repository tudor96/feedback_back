'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateTechnology = sequelize.define('CandidateTechnology', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    candidateId: DataTypes.INTEGER,
    techId: DataTypes.INTEGER
  }, {});
  CandidateTechnology.associate = (models) => {
  };
  return CandidateTechnology;
};