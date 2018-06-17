/*
 *  QUERY:  Selection and Projection I
 *  DESC:   Gets the id, price, and post date of buy orders requested
 *          for PBR stocks
 */

SELECT  to_id, price, ticker, order_time
FROM    TradeOrder
WHERE   type = 0 AND
        ticker = 'PBR';

/*
 *  QUERY:  Selection and Projection II
 *  DESC:   Find all companies being traded on exchange NASDAQ, with
 *          share value of at least 100
 */

SELECT  DISTINCT ticker AS Ticker,
                 c_name AS Company,
                 abbre AS Exchange
FROM    Company
WHERE   abbre = 'NASDAQ' AND
        price >= 100;

/*
 *  QUERY:  Join
 *  DESC:   Display the real-time price of company stocks in specified industry
 *          and the names of traders who share ownership of the company
 */

SELECT  A.first_name, A.last_name, C.c_name, C.ticker, C.price
FROM    Account A, Company C
WHERE   A.username = C.username AND
        C.industry = 'Healthcare';

/*
 *  QUERY:  Division
 *  DESC:   Find portfolio titles containing successful transactions with every
 *          company of a specified industry.
 *  RA:     AllCompany <-- π_(ticker) [σ_(industry='Electronics') (Company)]
 *          CompanyOrder <-- π_(ticker),(username) [AllCompany ⋈ ClosedOrder]
 *          AllOrderCombos <-- π_(username),(ticker) [CompanyOrder X Portfolio]
 *          MissingOrders <-- π_(username),(ticker) [AllOrderCombos - CompanyOrder]
 *          π_(username) [CompanyOrder - MissingOrders]
 */

 /* T1 */
CREATE VIEW T1 AS (
 SELECT username, ticker
 FROM   ClosedOrder
);

 /* T2 */
CREATE VIEW T2 AS (
  SELECT  ticker
  FROM    Company
  WHERE   industry = 'Electronics'
);

SELECT  DISTINCT x.username
FROM    T1 AS x
WHERE NOT EXISTS (
  SELECT  *
  FROM    T2 y
  WHERE NOT EXISTS (
    SELECT  *
    FROM    T1 AS z
    WHERE   (z.username = x.username) AND
            (z.ticker = y.ticker)
  )
);

/*
 *  QUERY:  Aggregation I
 *  DESC:   Get number of companies belonging to each industry
 */

SELECT  industry, COUNT(*) as No_Companies
FROM    Company
GROUP BY industry;

/*
 *  QUERY:  Aggregation II
 *  DESC:   Get the lowest price a stock has sold for in each industry
 */

SELECT    C.industry, MIN(CO.buy_price) AS Min_Price
FROM      Company C, ClosedOrder CO
WHERE     C.ticker = CO.ticker
GROUP BY  C.industry;

/*
 *  QUERY:  Nested Aggregation with Group By I
 *  DESC:   Find the industries for which their average closed transaction
 *          price is the minimum/maximum across all industries
 */

SELECT    C.industry, MIN(CO.buy_price)
FROM      Company C, ClosedOrder CO
WHERE     C.ticker = CO.ticker
GROUP BY  C.industry
HAVING    AVG(CO.buy_price) < (SELECT   AVG(buy_price)
                               FROM     ClosedOrder);

/*
 *  QUERY:  Nested Aggregation with Group By II
 *  DESC:   Find the total amount made by companies who have closed at least
 *          2 orders
 */

SElECT    C.c_name, SUM(CO.buy_price) AS Total_Value
FROM      Company C, ClosedOrder CO
WHERE     C.username = CO.username AND
          C.ticker = CO.ticker
GROUP BY  C.c_name
HAVING    2 <= (SELECT   COUNT(ticker)
                FROM     ClosedOrder);

/*
 *  QUERY:  Delete operation with Cascading
 *  DESC:   Remove a specified company from an exchange, and all associated
 *          recorded orders
 */

DELETE FROM   Company
WHERE         c_name='Bosch' AND industry='Engineering';

/*
 *  QUERY:  Delete operation without Cascading
 *  DESC:   Remove all buy orders issued with a price higher than
 *          $150 per share
 */

DELETE FROM   TradeOrder
WHERE         type=0 AND price > 150;

/*
 *  QUERY:  Update operation
 *  DESC:   Change the password of an user account via the Settings interface
 */

ALTER TABLE Account
ADD CONSTRAINT ck_alphanumeric
  CHECK (password NOT LIKE '%[^a-zA-Z0-9]%');
