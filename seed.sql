DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

create table department (
  id INT not null AUTO_INCREMENT,
  name VARCHAR(30) not null,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
  id int not null AUTO_INCREMENT,
  first_name VARCHAR (30) not null,
  last_name VARCHAR (30) not null,
  role_id int not null,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (manager_id) REFERENCES employee (id),
  FOREIGN KEY (role_id) REFERENCES role (id)
);


insert into department (name)
values
('Accounting'),
('Sales'),
('Engineering');


insert into role 
(title, salary, department_id)
values
(
  'Accountant', 
  100000.00, 
  (select id from department where name = 'Accounting')
),
(
  'Salesperson', 
  80000.00, 
  (select id from department where name = 'Sales')
),
(
  'Lead Engineer', 
  120000.00, 
  (select id from department where name = 'Engineering')
),
(
  'Engineer', 
  100000.00, 
  (select id from department where name = 'Engineering')
);

insert into employee
(first_name, last_name, role_id, manager_id)
values
(
  'Bob',
  'Martinez',
  (select id from role where title = 'Lead Engineer'),
  null
),
(
  'Lynn',
  'Ngyuen',
  (select id from role where title = 'Engineer'),
  1  
);

-- id first last title department salary manager

-- Details Query
select e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, (select first_name from employee emp where emp.id = e.manager_id) Manager
from role r, employee e, department d
where e.role_id = r.id and r.department_id = d.id;


select * from employee;






