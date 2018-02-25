# bamazon

Bamazon is an Amazon-like storefront with MySQL database. The app will take in orders from customers and deplete stock from the store's inventory. It is programed to track product sales across store's departments and provide a summary.

## Bamazon Customer ##
Running this application will first display all of the items available for sale. Once the customer has placed the order, Bamazon Customer will check if the store has enough of the product to meet the customer's request. If not, it will prompt "Insufficient quantity!", and prevent the order from going through.

![Bamazon Customer](/gif/customer.gif)

## Bamazon Manager ##
Bamazon Manager will allow you to:
* View Products for Sale
* View Low Inventory
* Add to Inventory
* Add New Product

"View Products for Sale" will list every available item. 
"View Low Inventory" will list all items with an inventory count lower than 5.

If a manager selects "Add to Inventory", Bamazon Manager will display a prompt that will let the manager "add more" of any item currently in the store.

![Bamazon Manager](/gif/manager1.gif)

If a manager selects "Add New Product", Bamazon Manager will allow the manager to add a completely new product to the store.

![Bamazon Manager](/gif/manager2.gif)

## Bamazon Supervisor ##
Bamazon Supervisor will allow the user to to "View Product Sales by Department" or "Create New Department". 

"View Product Sales by Department" will display a summarized table of each department, costs and sales. 
"Create New Department" will allow the user to add a new department to the store.

![Bamazon Supervisor](/gif/supervisor.gif)
