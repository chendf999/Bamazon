
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
var items = [];

connection.connect(function(err){
	if (err) {
		console.log(err);
	} else {
		connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products', function (err, data) {
			if (err) {
				console.log(err);
			} else {
				itemNum = data.length;
				for (var i = 0; i < data.length; i++) {
					items.push(data[i]);
				}
				list_item();
			}
		});
	}
});

function list_item(){
	for (var i = 0; i < items.length; i++) {
		console.log(items[i].item_id + '. ' + items[i].product_name + '\n Department: ' + items[i].department_name + '\n Price: ' + items[i].price + '   Stock: ' + items[i].stock_quantity);
	}
	add_item();
}

function add_item(){
	inquirer.prompt([
		// question 1: select item -------------------------------/
		{
			type: "input",
			message: "Enter the item id of the book you would like to buy",
			name: "item_id",
			validate: function(value){
				if(isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= itemNum){
					return true
				} else {
					console.log('\n Input item id between 1-' + itemNum + '.');
					return false;
				}
			}
		},
		// question 2: quantity -------------------------------/
		{
			type: "input",
			message: "How many do you need?",
			name: "quantity",
			validate: function(value){
				if (!isNaN(value) && parseInt(value) > 0) {
					return true;
				} else {
					console.log('Please enter a valid number.');
				}
			}
		}
	]).then(function(value){
		connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE item_id = ' + value.item_id, function(err, data) {
			if (err) {
				console.log(err);
			} else {
				if (value.quantity > data[0].stock_quantity) {
					console.log('\n Insufficient quantity. Only ' + data[0].stock_quantity + ' available.');
					add_item();
				} else {
					var total = parseInt(data[0].price) * parseInt(value.quantity);
					var quantity_update = data[0].stock_quantity - value.quantity;

					connection.query('UPDATE products SET stock_quantity = ' + quantity_update + ' WHERE item_id = ' + value.item_id);
					console.log('Your total is $' + total + '.');
					continue_shopping();
				}
			}
		});
	});
}

function continue_shopping(){
	inquirer.prompt([
		{
			type: "list",
			message: "Continue Shopping?",
			choices: ['Yes, please.', 'No, thanks'],
			name: "next"
		}
	]).then(function(value){
		if (value.next === 'Yes, please.') {
			list_item();
		} else {
			console.log('Thank you for shopping with us!');
		}
	});
}
