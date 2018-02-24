require('dotenv').config();

const mysql = require('mysql');
const inquirer = require('inquirer');

const password = process.env.PASSWORD;

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: password,
	database: "bamazon"
});

var itemNum = 0;

connection.connect(function(err, data){
	if (err) {
		console.log(err);
	} else {
		itemNum = data.length;
		shop_manager();
	}
});

// print management options
function shop_manager(){
	inquirer.prompt([
		{
			type: "list",
			message: "Welcome to Shop Manager! How can I help?",
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			name: "option"
		}
	]).then(function(value){
		switch(value.option){
			case 'View Products for Sale':
			list_item();
			break;
			case 'View Low Inventory':
			low_inventory();
			break;
			case 'Add to Inventory':
			add_stock();
			break;
			case 'Add New Product':
			new_product();
			break;
		}
	});
}

function list_item(){
	connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products', function (err, data) {
		if (err) {
			console.log(err);
		} else {
			for (var i = 0; i < data.length; i++) {
				console.log('\x1b[33m%s\x1b[0m', data[i].item_id + '. ' + data[i].product_name + '\n Department: ' + data[i].department_name + '\n Price: ' + data[i].price + '\n Stock: ' + data[i].stock_quantity);
			}
			shop_manager();
		}
	});
}

function low_inventory(){
	connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity BETWEEN 0 AND 5', function(err, data){
		if (err) {
			console.log(err);
		} else {
			if (data.length === 0) {
				console.log('\x1b[33m%s\x1b[0m', '\n No low inventory item found.');
			} else {
				console.log('\x1b[33m%s\x1b[0m', '\n Low inventory items: \n');
				for (var i = 0; i < data.length; i++) {
					console.log('\x1b[33m%s\x1b[0m', data[i].item_id + '. ' + data[i].product_name + '\n Department: ' + data[i].department_name + '\n Price: ' + data[i].price + '\n Stock: ' + data[i].stock_quantity);
				}
				shop_manager();
			}
		}
	});
}

function add_stock(){
	inquirer.prompt([
		{
			type: "input",
			message: "Enter the id of the item you would like to add",
			name: "id",
			validate: function(value){
				if (isNaN(value) && parseInt(value) < 0) {
					console.log('\x1b[33m%s\x1b[0m', 'Please enter a valid number');
					return false;
				} else if (parseInt(value) > itemNum) {
					console.log('Please enter between 0 - ' + itemNum + '.');
					return false;
				} else {
					return true;
				}
			}
		},
		{
			type: "input",
			message: "How many items would you like to add to stock?",
			name: "number",
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
		connection.query('SELECT * FROM products WHERE item_id = ' + value.id, function(err, data){
			if (err) {
				console.log(err);
			} else {
				var quantity_update = parseInt(data[0].stock_quantity) + parseInt(value.number);
				connection.query('UPDATE products SET stock_quantity = ' + quantity_update + ' WHERE item_id = ' + value.id, function(err){
					if (err) {
						console.log(err);
					} else {
						console.log('\x1b[33m%s\x1b[0m', '\n Stock quantity changed: \n ' + data[0].item_id + '. ' + data[0].product_name + '\n Department: ' + data[0].department_name + '\n Price: ' + data[0].price + '\n Stock: ' + quantity_update);

						shop_manager();
					}
				});
			}
		});
	});
}

function new_product(){
	inquirer.prompt([
		{
			type: "input",
			message: "Enter new product name",
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
			type: "list",
			message: "Select product department",
			choices: ['Art & Design', 'Computer Science', 'History'],
			name: "dept"
		},
		{
			type: "input",
			message: "Enter new product price",
			name: "price",
			validate: function(value){
				if (isNaN(value) && parseInt(value) < 0) {
					console.log('\x1b[33m%s\x1b[0m', 'Please enter a valid number');
					return false;
				} else {
					return true;
				}
			}
		},
		{
			type: "input",
			message: "Enter new product quantity",
			name: "quantity",
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
		connection.query(`INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ("${value.name}", "${value.dept}", ${value.price}, ${value.quantity});`, function(err){
			if (err) {
				console.log(err);
			} else {
				console.log('\x1b[33m%s\x1b[0m', 'Item added: \n' + value.name + ' \n Department: ' + value.dept + '\n Price: ' + value.price + '\n Stock: ' + value.quantity);

				itemNum++
				shop_manager();
			}
		});
	});
}