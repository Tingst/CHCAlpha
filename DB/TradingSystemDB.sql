CREATE DATABASE   TradingSystemDB;
USE               TradingSystemDB;

DROP TABLE ClosedOrder;
DROP TABLE TradeOrder;
DROP TABLE Company;
DROP TABLE Exchange;
DROP TABLE Portfolio;
DROP TABLE Account;

CREATE TABLE Exchange (
	abbreviation CHAR(10) PRIMARY KEY,
	ex_name CHAR(80)
);

CREATE TABLE Account (
	username CHAR(50) PRIMARY KEY,
	first_name CHAR(20),
	last_name CHAR(20),
	password CHAR(20),
	funds_available FLOAT NOT NULL
);

/* We will do the portfolio purchased price on the fly by joining the Portfolio table with the ClosedOrder table*/
CREATE TABLE Portfolio (
	p_name CHAR(30),
	username CHAR(50) NOT NULL,
	PRIMARY KEY(username, p_name),
	FOREIGN KEY(username) REFERENCES Account(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Company (
	ticker CHAR(20),
	c_name CHAR(255),
	industry CHAR(50),
	price FLOAT,
	username CHAR(50) NOT NULL,
	abbre CHAR(10),
	FOREIGN KEY(username) REFERENCES Account(username) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(abbre) REFERENCES Exchange(abbreviation) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY(ticker)
);

/* 0 for buy 1 for sell (Order is a keyword so cannot be used as the table name)*/
CREATE TABLE TradeOrder (
	to_id INT AUTO_INCREMENT,
	type BOOL NOT NULL,
	ticker CHAR(20) NOT NULL,
	num_shares INT NOT NULL,
	price FLOAT NOT NULL,
	order_time DATETIME NOT NULL,
	p_name CHAR(30),
	username CHAR(50),
	PRIMARY KEY(to_id),
	FOREIGN KEY(ticker) REFERENCES Company(ticker) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(username, p_name) REFERENCES Portfolio(username, p_name) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE ClosedOrder (
	o_id INT AUTO_INCREMENT,
	ticker CHAR(20) NOT NULL,
	num_shares INT NOT NULL,
	buy_price FLOAT NOT NULL,
	closed_time DATETIME NOT NULL,
	p_name CHAR(30),
	username CHAR(50),
	PRIMARY KEY(o_id),
	FOREIGN KEY(ticker) REFERENCES Company(ticker) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(username, p_name) REFERENCES Portfolio(username, p_name) ON DELETE CASCADE ON UPDATE CASCADE
);

/*
 *  Populate database script:
 */

LOAD DATA LOCAL INFILE './exchange.txt' INTO TABLE Exchange LINES TERMINATED BY '\r';
LOAD DATA LOCAL INFILE './account.txt' INTO TABLE Account LINES TERMINATED BY '\r';
LOAD DATA LOCAL INFILE './portfolio.txt' INTO TABLE Portfolio LINES TERMINATED BY '\r';
LOAD DATA LOCAL INFILE './company.txt' INTO TABLE Company LINES TERMINATED BY '\r';
LOAD DATA LOCAL INFILE './tradeorder.txt' INTO TABLE TradeOrder LINES TERMINATED BY '\r';
LOAD DATA LOCAL INFILE './closedorder.txt' INTO table ClosedOrder LINES TERMINATED BY '\r';
