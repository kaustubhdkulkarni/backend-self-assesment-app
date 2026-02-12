'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'notes', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Stores optional structured notes, remarks, or history related to this transaction',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'notes');
  },
};
