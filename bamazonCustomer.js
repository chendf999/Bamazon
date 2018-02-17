
require('dotenv').config();

const mysql = require('mysql');
const inquirer = require('inquirer');

const mysqlPass = process.env.PASSWORD;

const connection = mysql.createConnection({
	host: "localhost",
    port: 3306,
    user: "root",
    password: mysqlPass,
    database: "bamazon"
});

connection.connect(function(err){
	if (err) {
		console.log(err);
	} else {
		connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products', function (err, data) {
			if (err) {
				console.log(err);
			} else {
				console.log(data);
			}
		});
	}
});

