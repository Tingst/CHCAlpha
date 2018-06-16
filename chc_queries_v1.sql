/*
 *  QUERY:  Selection and Projection I
 *  DESC:   Gets the id, price, and post date of buy orders listed
 *          on exchange NASDAQ
 */

SELECT  o_id, price, ticker, o_date
FROM    TradeOrder
WHERE   type = 'buy' AND
        exchange = 'NASDAQ';

/*
 *  QUERY:  Selection and Projection II
 *  DESC:   Display the portfolio titles, whose purchase value is at least
 *          $5000, that are owned and maintained by a trader's account
 */

SELECT  DISTINCT title, purchase_value
FROM    Portfolio
WHERE   purchase_value >= 5000;

/*
 *  QUERY:  Join
 *  DESC:   Display the company, exchange, and real-time price of
 *          technology stocks
 */

SELECT  c_name AS Company,
        abbreviation AS Exchange,
        price AS Price
FROM    Company, Exchange
WHERE   industry = 'Technology';


/*
 *  QUERY:  Division
 *  DESC:   Find portfolio titles containing successful transactions with every
 *          company of a specified industry.
 *  RA:     AllCompany <-- π_(c_id) [σ_(industry='Energy') (Company)]
 *          CompanyOrder <-- π_(c_id),(p_id) [AllCompany ⋈ ClosedOrder]
 *          AllOrderCombos <-- π_(title),(c_id),(p_id) [CompanyOrder X Portfolio]
 *          MissingOrders <-- π_(title),(c_id),(p_id) [AllOrderCombos - CompanyOrder]
 *          π_(title) [CompanyOrder - MissingOrders]
 */

SELECT  P.title
FROM    Portfolio P, ClosedOrder CO
WHERE   P.p_id = CO.p_id AND
        NOT EXISTS (SElECT   *
                    FROM     ClosedOrder CO)
                    EXCEPT   (SELECT  *
                              FROM    Company C, ClosedOrder CO
                              WHERE   C.c_id = CO.c_id AND
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
WHERE     C.c_id = CO.c_id
GROUP BY  C.industry;

/*
 *  QUERY:  Nested Aggregation with Group By I
 *  DESC:   Find the industries for which their average closed transaction
 *          price is the minimum/maximum across all industries
 */

SELECT    C.industry, MIN(CO.buy_price)
FROM      Company C, ClosedOrder CO
WHERE     C.c_id = CO.c_id
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
WHERE     P.p_id = C.p_id
HAVING    5 < (SELECT   COUNT(c_id)
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
