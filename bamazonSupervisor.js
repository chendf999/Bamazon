require('dotenv').config();

const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

const password = process.env.PASSWORD;

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: password,
	database: "bamazon"
});

connection.connect(function(err){
	if (err) {
		console.log(err);
	} else {
		supervisor();
	}
});

function supervisor(){
	inquirer.prompt([
		{
			type: "list",
			message: "Welcome to supervisor! How can I help?",
			choices: ['View Product Sales by Department', 'Create New Department'],
			name: "option"
		}
	]).then(function(value){
		if (value.option === 'View Product Sales by Department') {
			view_sales();
		} else {
			new_dept();
		}
	});
}

function view_sales(){
	var table = new Table({
		head: ['ID', 'Department', 'Overhead Costs', 'Product Sales', 'Total Profit'],
		colWidths: [5, 20, 16, 16, 16]
	});

	connection.query('SELECT * FROM departments', function(err, data){
		if (err) {
			console.log(err);
		} else {
			for (var i = 0; i < data.length; i++) {
				var content = [
					data[i].department_id,
					data[i].department_name,
					data[i].over_head_costs,
					data[i].product_sales,
					data[i].over_head_costs - data[i].product_sales
				];

				table.push(content);
			}
			console.log(table.toString());
			supervisor();
		}
	});
}

function new_dept(){
	inquirer.prompt([
		{
			type: "input",
			message: "Enter new department name",
			name: "name",
			validate: function(value){
				if (value === '') {
					console.log('\x1b[33m%s\x1b[0m', 'Please enter a valid product name');
					return false;
				} else {
					return true;
				}
			}
		},
		{
			type: "input",
			message: "Enter overhead costs",
			name: "cost",
			validate: function(value){
				if (isNaN(value) && parseInt(value) < 0) {
					console.log('\x1b[33m%s\x1b[0m', 'Please enter a valid number');
					return false;
				} else {
					return true;
				}
			}
		}
	]).then(function(value){
		connection.query(`INSERT INTO departments(department_name, over_head_costs, product_sales) VALUES ("${value.name}", "${value.cost}", 0);`, function(err){
			if (err) {
				console.log(err);
			} else {
				console.log('\x1b[33m%s\x1b[0m', 'New department added: ' + value.name + '\nOverhead Costs: ' + value.cost);
				supervisor();
			}
		});
	});
}