var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  runApp();
});

function runApp() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;
      }
    });
}

function viewAllEmployees() {
  const query = `
    select e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, (select first_name from employee emp where emp.id = e.manager_id) Manager
    from role r, employee e, department d
    where e.role_id = r.id and r.department_id = d.id;
  `;

  connection.query(query, function (err, res) {
    // TODO: Format Output
    console.table(res);
    runApp();
  });
}

function viewAllDepartments() {
  const query = `
    select id, name department from department;
  `;

  connection.query(query, function (err, res) {
    // TODO: Format Output
    console.table(res);
    runApp();
  });
}

function viewAllRoles() {
  const query = `
    select r.id id, r.title role, r.salary salary, d.name department
    from role r, department d
    where r.department_id = d.id;
  `;

  connection.query(query, function (err, res) {
    // TODO: Format Output
    console.table(res);
    runApp();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the department?",
    })
    .then((response) => {
      const query = `
        insert into department (name)
        values
        (?)
      `;

      connection.query(query, [response.department], function (err, res) {
        if (err) {
          console.log(err);
        }
        runApp();
      });
    });
}

function addEmployee() {
  getEmployeeList(function (empErr, employees) {
    getRolesList(function (err, roles) {
      if (err || empErr) {
        return console.log(err);
      }

      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is their first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is their last name?",
          },
          {
            name: "role",
            type: "list",
            message: "What is their new role?",
            choices: roles,
          },
          {
            name: "manager",
            type: "list",
            message: "Who is this employee's manager?",
            choices: [...employees, { name: "None", value: null }],
          },
        ])
        .then((response) => {
          const query = `
          insert into employee (first_name, last_name, role_id, manager_id)
          values
            (?, ?, ?, ?)
      `;

          connection.query(
            query,
            [
              response.first_name,
              response.last_name,
              response.role,
              response.manager,
            ],
            function (err, res) {
              if (err) {
                console.log(err);
              }
              runApp();
            }
          );
        });
    });
  });
}

function updateEmployeeRole() {
  getEmployeeList(function (employeesErr, employees) {
    getRolesList(function (roleError, roles) {
      if (employeesErr || roleError) {
        return console.log(employeesErr, roleError);
      }

      inquirer
        .prompt([
          {
            name: "employee_id",
            type: "list",
            message: "Which employees role do want to update?",
            choices: employees,
          },
          {
            name: "new_role",
            type: "list",
            message: "What is their new role?",
            choices: roles,
          },
        ])
        .then((response) => {
          const query = `
            UPDATE employee
            SET ?
            WHERE ? 
          `;

          connection.query(
            query,
            [
              {
                role_id: response.new_role,
              },
              {
                id: response.employee_id,
              },
            ],
            function (err, res) {
              if (err) throw err;
              console.log("Role updated!\n");
              runApp();
            }
          );
        });
    });
  });
}

function addRole() {
  // title salary department_id

  getDepartmentList(function (err, departments) {
    if (err) {
      return console.log(err);
    }

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "Which is the title of the new role?",
        },
        {
          name: "salary",
          type: "number",
          message: "What is the new role's salary?",
        },
        {
          name: "department",
          type: "list",
          message: "What is the new role's department?",
          choices: departments,
        },
      ])
      .then((response) => {
        const query = `
            insert into role (title, salary, department_id)
            values
            (?, ?, ?)
          `;

        connection.query(
          query,
          [response.role, response.salary, response.department],
          function (err, res) {
            if (err) throw err;
            else {
              console.log("Role added!\n");
            }
            runApp();
          }
        );
      });
  });
}

function getEmployeeList(cb) {
  const query = `SELECT concat(first_name, " ", last_name) name, id value FROM employee;`;
  connection.query(query, function (err, res) {
    cb(err, res);
  });
}

function getRolesList(cb) {
  const query = `select title name, id value from role;`;
  connection.query(query, function (err, res) {
    cb(err, res);
  });
}

function getDepartmentList(cb) {
  const query = `select name, id value from department;`;
  connection.query(query, function (err, res) {
    cb(err, res);
  });
}
