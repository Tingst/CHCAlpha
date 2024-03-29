CREATE DATABASE   stock;
USE               stock;

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
	username CHAR(20) PRIMARY KEY,
	first_name CHAR(20),
	last_name CHAR(20),
	password CHAR(20),
	funds_available FLOAT NOT NULL
);

/* We will do the portfolio purchased price on the fly by joining the Portfolio table with the ClosedOrder table*/
CREATE TABLE Portfolio (
	p_name CHAR(30),
	username CHAR(20) NOT NULL,
	PRIMARY KEY(username, p_name),
	FOREIGN KEY(username) REFERENCES Account(username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Company (
	ticker CHAR(20),
	c_name CHAR(255), 
	industry CHAR(20),
	price FLOAT,
	username CHAR(20) NOT NULL,
	abbre CHAR(10),
	FOREIGN KEY(username) REFERENCES Account(username) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(abbre) REFERENCES Exchange(abbreviation) ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY(ticker)
);

/* 0 for buy 1 for sell (Order is a keyword so cannot be used as the table name)*/
CREATE TABLE TradeOrder (
	to_id INT AUTO_INCREMENT,
	type CHAR(1) NOT NULL,
	ticker CHAR(20) NOT NULL,
	num_shares INT NOT NULL,
	price FLOAT NOT NULL,
	order_time DATETIME NOT NULL,
	p_name CHAR(30),
	username CHAR(20),
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
	username CHAR(20),
	PRIMARY KEY(o_id),
	FOREIGN KEY(ticker) REFERENCES Company(ticker) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(username, p_name) REFERENCES Portfolio(username, p_name) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO Account(username, first_name, last_name, password, funds_available)
VALUES ('bggoodman', 'Bill', 'Gates', '123', 1000000);

INSERT INTO Account(username, first_name, last_name, password, funds_available)
VALUES ('gHumpkins', 'Paul', 'Williams', '456', 2000000);

INSERT INTO Portfolio (p_name, username)
VALUES('super performance equity', 'bggoodman');

INSERT INTO Portfolio (p_name, username)
VALUES('tech sector', 'gHumpkins');

INSERT INTO Exchange (abbreviation, ex_name)
VALUES ('NASDAQ', 'National Association of Securities Dealers Automated Quotations');

INSERT INTO Company (c_name, industry, ticker, price, username, abbre)
VALUES ('Microsoft', 'Technology', 'MSFT', 100, 'bggoodman', 'NASDAQ');

INSERT INTO Company (c_name, industry, ticker, price, username, abbre)
VALUES ('Google', 'Technology', 'GOOGL', 200, 'gHumpkins', 'NASDAQ');

INSERT INTO TradeOrder (type, ticker, num_shares, price, order_time, p_name, username)
VALUES (0, 'MSFT', 120, 100, NOW(), 'tech sector', 'gHumpkins');

INSERT INTO TradeOrder (type, ticker, num_shares, price, order_time, p_name, username)
VALUES (1, 'GOOGL', 1200, 200, NOW(), 'tech sector', 'gHumpkins');

INSERT INTO ClosedOrder (ticker, num_shares, buy_price, closed_time, p_name, username)
VALUES ('GOOGL', 1200, 80, NOW(), 'tech sector', 'gHumpkins');

INSERT INTO ClosedOrder (ticker, num_shares, buy_price, closed_time, p_name, username)
VALUES ('MSFT', 120, 80, NOW(), 'super performance equity', 'bggoodman');



