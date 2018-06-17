# CPSC 304 Project

MySQL installation process for Linux, Mac should follow a very similar process

1. sudo apt-get install mysql-server mysql-client libmysql-java **Note MySQL 8 doesn't work, have to get MySQL 5.7.22
2. during the installation process, you will be prompt to input the MySQL password, use 123456.

How to use MySQL:
Below commands are typed into the terminal without logging into the MySQL server.
1. service mysql status: check if the server is running.
2. service mysql stop: stop the MySQL server.
3. service mysql start: start the MySQL server.
4. service mysql restart: restart the MySQL server.
5. [sudo] mysql -u root  -p --local-infile: login to the MySQL server.

Below commands are typed into the terminal after logging into the MySQL server.
1. show databases: show the available database.
2. create database <database name>: creates a database in the MySQL server.
3. use database: change to a specific data base (you need to use the database before you can type in any SQL commands).
4. source <filename>: run a file that contains the SQL code, in our case the TradingSystemDB file.
5. drop database <database name>
