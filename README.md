# CHC Alpha

UBC CPSC 304: Stock market trading web application
---

![Alt text](./chcalphalogin.png?raw=true "Welcome to CHCAlpha")</br>

## Requirements
1. MySQL Community Server 5.7.22
2. MySQL Connector/J 5.1.46 Platform Independent (Architecture Independent)

## Starting front-end
```bash
cd client
npm install
npm start
```
In web browser of choice, connect to...
```bash
localhost:8080
```

## Starting server and database
1. Configure IDE project structure: select the ~/server dir and source
2. When starting MySQL, configure login for user 'root' and password '123456'

```bash
mysql -u root -p
123456
source TradingSystemDB.sql
```

3. Run Main.java to complete connection between front-end, back-end, and database


## **Relation Schema (Non-DDL)**

1. `Company(_c_id_, c_name, price, ticker, **abbreviation**, **username**)`
    1. username NOT NULL
2. `Exchange(_abbreviation_, ex_name)`
    1. Cannot capture Total Participation constraint without assertions
3. `Account(_username_, first_name, last_name, password)`
4. Portfolio(_p_id_, purchase_value, title, **username**)
    1. username NOT NULL
5. Order(_o_id_, type, ticker, share_num, price, exchange, **username**)
    1. username NOT NULL
6. ClosedOrder(**_c_id_**, **_abbreviation_**, **_p_id_**, stock_num, buy_price)


* * *

## **Relation Schema (SQL DDL)**

```
CREATE TABLE Company(
    c_id INT, c_name CHAR(255), price FLOAT, ticker CHAR(20),
    abbreviation CHAR(20), username CHAR(20), PRIMARY KEY(c_id),
    FOREIGN KEY(abbreviation) REFERENCES Exchange,
    FOREIGN KEY(username) REFERENCES Account, ON DELETE CASCADE,
    ON UPDATE CASCADE)
```

* Candidate keys: c_id
* Functional dependencies: c_id → c_name
* Note: price indicates the real-time value of a company stock

```
CREATE TABLE Exchange(
    abbreviation CHAR(20),
    ex_name CHAR(255), PRIMARY KEY(abbreviation))
```

* Candidate keys: abbreviation
* Functional dependencies: abbreviation → ex_name
* Note: The schema is unable to capture total participation in the relation to Company.

```
CREATE TABLE Account(
    username CHAR(20), first_name CHAR(20), last_name CHAR(20),
    password CHAR(20), PRIMARY KEY(username))
```

* Candidate keys: username
* Functional dependencies: username → first_name, last_name

```
CREATE TABLE Portfolio(
    p_id INT, purchase_value FLOAT, title CHAR(20), username CHAR(20),
    PRIMARY KEY(p_id),username NOT NULL,FOREIGN KEY(username) REFERENCES Account,
    ON DELETE CASCADE, ON UPDATE CASCADE)
```

* Candidate keys: p_id
* Functional dependencies: p_id → title, purchase_value
* Note: purchase_value indicates the current sum a user paid for all stocks contained within a portfolio

```
CREATE TABLE Order(
    o_id INT, type NUMBER(1), ticker CHAR(20), share_num INT,
    price FLOAT, exchange CHAR(20), username CHAR(20), PRIMARY KEY(o_id),
    username NOT NULL, FOREIGN KEY(username) REFERENCES Account,
    ON DELETE CASCADE, ON UPDATE CASCADE)
```

* Candidate keys: o_id
* Functional dependencies: o_id → type, share_num, price
* Note: Attribute “type” can be either “Buy” or “Sell”, denoted by the numbers 0 and 1 respectively. Price indicates the buying or selling value, per company share, at the time the order was placed.

```
CREATE TABLE ClosedOrder(
    c_id INT, abbreviation CHAR(20), p_id INT, stock_num INT, buy_price FLOAT,
    PRIMARY KEY(c_id, abbreviation, p_id),
    FOREIGN KEY(c_id) REFERENCES Company,
    FOREIGN KEY(abbreviation) REFERENCES Exchange,
    FOREIGN KEY(p_id) REFERENCES Portfolio,
    ON DELETE CASCADE,
    ON UPDATE CASCADE)
```

* Candidate keys: (c_id, abbreviation, p_id)
* Functional dependencies:
* Note: buy_price indicates the transaction value, per company share, at the time a Buy order and Sell order were respectively matched and processed.


---
### Troubleshooting
1. download MySQL Community Server 5.7
2. download MySQL Connector/J 5.1.46 Platform Independent (Architecture Independent), ZIP Archive
3. install MySql Community Server
4. system preferences > MySQL > make sure it is running (green)
5. cd to DB folder of cpsc_304, same directory as TradingSystemDB.sql

6. `mysql` to log in (user/pass probably not needed?)
7. `sudo mysql -u root -p --local-infile`: first, enter your sudo password, then when it asks for your password again just press enter without any password
8. `show databases` to show databases

9. `source TradingSystemDB.sql` a bunch of error messages will appear; this will create & populate the database
10. `show databases`: TradingSystemDB should appear
11. `use TradingSystemDB` use this database
12. `show tables` to show current tables in the db
