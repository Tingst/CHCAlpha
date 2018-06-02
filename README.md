# CPSC 304 Project

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



