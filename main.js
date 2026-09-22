const mysql = require ('mysql2/promise')

const pool = mysql.createPool ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'retailstore'
})

// Part 1: Database Connection and Tables Creation
async function setup() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Suppliers (
                SupplierID INT AUTO_INCREMENT PRIMARY KEY,
                SupplierName VARCHAR(100) NOT NULL,
                ContactNumber VARCHAR(20)
            )
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Products (
                ProductID INT AUTO_INCREMENT PRIMARY KEY,
                ProductName VARCHAR(100) NOT NULL,
                Category VARCHAR(50),
                Price DECIMAL(10, 2) NOT NULL,
                StockQuantity INT NOT NULL,
                SupplierID INT,
                FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
            )
        `)

        await pool.query (`
            CREATE TABLE IF NOT EXISTS Sales (
                SaleID INT AUTO_INCREMENT PRIMARY KEY,
                ProductID INT,
                QuantitySold INT NOT NULL,
                SaleDate DATE NOT NULL,
                FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
            )
        `)

// Part 2: Data Manipulation (CRUD Operations)
        const [supplierResult] = await pool.query (
            `INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)`,
            ['FreshFoods', '0123456789']
        )
        const supplierId = supplierResult.insertId
        const products = [
            ['Milk', 'Beverages', 20.00, 50, supplierId ],
            ['Bread', 'Bakery', 20.00, 100, supplierId ],
            ['Eggs', 'Dairy', 60.00, 30, supplierId]
        ];

        for ( let p of products) {
            await pool.query (
                `INSERT INTO Products (ProductName, Category, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?, ?)`,
                p
            )
        }

        await pool.query (
            `INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)`,
            [1, 2, '2025-05-20']
        )

        await pool.query (
            `UPDATE Products SET Price = ? WHERE ProductName = ?`,
            [ 25.00, 'Bread']
        )

        await pool.query (
            `DELETE FROM Products WHERE ProductName = ?`,
            [ 'Eggs']
        )

// Part 3: Advanced Reports and SQL Joins
        const [ productsAndSuppliers] = await pool.query (`
            SELECT p.ProductName, p.Category, p.Price, s.SupplierName 
            FROM Products p 
            JOIN Suppliers s ON p.SupplierID = s.SupplierID
        `)
        console.log( "--- Products and Suppliers Report ---")
        console.table (productsAndSuppliers)

        const [ totalStockValue] = await pool.query(`
            SELECT SUM(Price * StockQuantity) AS TotalInventoryValue 
            FROM Products
        `)
        console.log ( "--- Total Inventory Value ---" )
        console.table (totalStockValue);

        const [salesReport] = await pool.query (`
            SELECT sa.SaleID, p.ProductName, sa.QuantitySold, sa.SaleDate 
            FROM Sales sa 
            JOIN Products p ON sa.ProductID = p.ProductID
        `)
        console.log ( "--- Sales Report ---")
        console.table (salesReport)

        process.exit(0)

    } catch (error){
        console.error( "Error:", error.message)
    }
}

setup()