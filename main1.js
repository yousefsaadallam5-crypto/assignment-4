/* 
part 2 
Schema Mapping Solution
Based on the provided ERD diagram for User and Product, the entities and attributes are mapped into the following database tables:

1. User Table
This table stores the core information for each user in the system, with a primary key to ensure uniqueness.
id: Primary Key   
firstName: First name of the user   
lastName: Last name of the user   
userName: Unique username   
email: Email address   password: 
User password   
role: User role or permission  

2. User_Phone Table
Since the phone attribute is enclosed in a double oval in the ERD, it represents a multi-valued attribute. 
According to database normalization rules, it must be separated into its own table:   
user_id: Foreign Key referencing id in the User table   
phone: Phone number 

3. Product Table
This table represents the product entity, linked to the user who owns or manages it.   
id: Primary Key   
name: Product name   
stock: Stock quantity   
price: Product price   
isDeleted: Soft deletion flag   
user_id: Foreign Key referencing id in the User table



*/