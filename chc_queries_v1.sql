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
 *  DESC:   Get the id and name of companies being traded on all exchanges
 *  RA:     AllCombos <-- π_(c_id),(c_name) (Company) X (Exchange)
 *          NotPossible <-- π_(c_id),(c_name) (AllCombos - (Company))
 *          π_(c_id),(c_name) (Company) - NotPossible
 */

SELECT  c_id, c_name
FROM    Company
WHERE   NOT EXISTS
  ((SELECT   *
   FROM     Exchange E)
   EXCEPT
     (SELECT *
     FROM   Company C
     WHERE  C.abbreviation = E.abbreviation
   ));

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
 *  DESC:
 */



/*
 *  QUERY:  Nested Aggregation with Group By II
 *  DESC:
 */


/*
 *  QUERY:  Delete operation with Cascading
 *  DESC:
 */

/*
 *  QUERY:  Delete operation without Cascading
 *  DESC:
 */

/*
 *  QUERY:  Update operation
 *  DESC:
 */

/*
 *  QUERY:
 *  DESC:
 */
