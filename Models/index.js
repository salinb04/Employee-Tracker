const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

// Department
export const Department = sequelize.define("Department", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

// Role
export const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  salary: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: "id",
    },
  },
});

// Employee
export const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INT,
    allowNull: false,
    references: {
      model: Role,
      key: "id",
    },
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Employee,
      key: "id",
    },
  },
});
