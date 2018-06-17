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
 *  DESC:   Display the company, exchange, and real-time price of
 *          technology stocks
 */

SELECT  C.c_name AS Company,
        E.abbreviation AS Abbrev,
        E.ex_name AS Exchange
        C.price AS Price
FROM    Company C, Exchange E
WHERE   C.abbre = E.abbreviation AND
        C.industry = 'Healthcare';


/*
 *  QUERY:  Division
 *  DESC:   Find portfolio titles containing successful transactions with every
 *          company of a specified industry.
 *  RA:     AllCompany <-- π_(ticker) [σ_(industry='Energy') (Company)]
 *          CompanyOrder <-- π_(ticker),(p_name),(username) [AllCompany ⋈ ClosedOrder]
 *          AllOrderCombos <-- π_(p_name),(username),(ticker) [CompanyOrder X Portfolio]
 *          MissingOrders <-- π_(p_name),(username),(ticker) [AllOrderCombos - CompanyOrder]
 *          π_(p_name) [CompanyOrder - MissingOrders]
 */

SELECT  P.p_name
FROM    Portfolio P, ClosedOrder CO
WHERE   P.username = CO.username AND
        P.p_name = CO.p_name AND
        NOT EXISTS (SElECT   *
                    FROM     ClosedOrder CO)
                    EXCEPT   (SELECT  *
                              FROM    Company C, ClosedOrder CO
                              WHERE   C.ticker = CO.ticker AND
                                      C.industry = 'Energy');

/*
 *  QUERY:  Aggregation I
 *  DESC:   Get number of accounts sharing ownership of a company
 *          called Microsoft
 */

SELECT  COUNT(A.username) as TotalAccounts
FROM    Account A, Company C
WHERE   C.username = A.username AND
        C.c_name = 'Microsoft';

/*
 *  QUERY:  Aggregation II
 *  DESC:   Get the lowest price a stock has sold for in each industry
 */

SELECT    C.industry, MIN(CO.buy_price) AS MinPrice
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
 *  DESC:   Find the total value of all portfolios which have at least
 *          5 closed orders
 */

SELECT    SUM(purchase_value) AS Total
FROM      Portfolio P, ClosedOrder C
WHERE     P.p_name = C.p_name AND
          P.username = C.username
HAVING    5 < (SELECT   COUNT(ticker)
               FROM     ClosedOrder);

/*
 *  QUERY:  Delete operation with Cascading
 *  DESC:   Remove a specified company from an exchange, and all associated
 *          recorded orders
 */

DELETE FROM   Company
WHERE         c_name='Enron' AND industry='Energy';

/*
 *  QUERY:  Delete operation without Cascading
 *  DESC:   Remove all buy orders issued with a price higher than
 *          $1000
 */

DELETE FROM   TradeOrder
WHERE         type=0 AND price > 1000;

/*
 *  QUERY:  Update operation
 *  DESC:   Change the password of an user account via the Settings interface
 */

ALTER TABLE Account
ADD CONSTRAINT ck_alphanumeric
  CHECK (password NOT LIKE '%[^A-Z0-9]%');
