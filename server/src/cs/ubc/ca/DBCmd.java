package cs.ubc.ca;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

public class DBCmd {

    private static final String ACCOUNTS_TABLE = "Account";
    private static final String COMPANY_TABLE = "Company";
    private static final String PORTFOLIO_TABLE = "Portfolio";
    private static final String EXCHANGE_TABLE = "Exchange";
    private static final String TRADED_ORDER_TABLE = "TradeOrder";
    private static final String CLOSED_ORDER_TABLE = "ClosedOrder";

    // Build a JSON with "body" Success
    public static JSONObject login(String username, String password, Connection con) throws Exception {
        String sql = "SELECT username, password, first_name, last_name FROM " + ACCOUNTS_TABLE + " WHERE username=?";
        PreparedStatement ps = con.prepareStatement(sql);
        ps.setString(1, username);
        System.out.println("[EXECUTING SQL]: " + ps);
        ResultSet resultsSet = ps.executeQuery();

        JSONObject obj = new JSONObject();
        JSONObject body = new JSONObject();
        if(resultsSet.next()) {
            String fn = resultsSet.getString("first_name");
            String ln = resultsSet.getString("last_name");
            String pw = resultsSet.getString("password");
            if(password.equals(pw)) {
                body.put("fname", fn);
                body.put("lname", ln);
                obj.put("body", body);
                obj.put("code", 200);
                return obj;
            }
        }
        body.put("text", "Incorrect username and/or password");
        obj.put("body", body);
        obj.put("code", 400);
        return obj;
    }

    public static JSONObject createAccount(String username, String password, String firstName, String lastName, Connection con) throws Exception {
        JSONObject obj = new JSONObject();
        JSONObject body = new JSONObject();

        // check if username already exists
        String sql1 = "SELECT username, first_name, last_name FROM " + ACCOUNTS_TABLE + " WHERE username=?";
        PreparedStatement checkExisting = con.prepareStatement(sql1);
        checkExisting.setString(1, username);
        System.out.println("[EXECUTING SQL]: " + checkExisting);
        ResultSet resultsSet = checkExisting.executeQuery();

        if(resultsSet.next()) {
            body.put("text", "Username " + username + " already exists");
            obj.put("code", 400);
            obj.put("body", body);
            return obj;
        }

        // create account operation
        String sql2 = "INSERT INTO " + ACCOUNTS_TABLE + " (username, password, first_name, last_name, funds_available) VALUES (?, ?, ?, ?, ?);";
        PreparedStatement createUsrAcc = con.prepareStatement(sql2);
        createUsrAcc.setString(1, username);
        createUsrAcc.setString(2, password);
        createUsrAcc.setString(3, firstName);
        createUsrAcc.setString(4, lastName);
        createUsrAcc.setFloat(5, 0);
        System.out.println("[EXECUTING SQL]: " + createUsrAcc);
        createUsrAcc.executeUpdate();

        body.put("body", "User " + username + " created successfully");
        body.put("fname", firstName);
        body.put("lname", lastName);
        obj.put("code", 200);
        obj.put("body", body);
        return obj;
    }

    public static void addFunds(String username, Float amount, Connection con) throws Exception {
        String addFundsQuery = "SELECT username,funds_available FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'";
        Statement addFunds = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet accountInfo = addFunds.executeQuery(addFundsQuery);

        if(accountInfo.next()) {
            Float test = accountInfo.getFloat("funds_available");
            Float sum = accountInfo.getFloat("funds_available") + amount;
            accountInfo.updateFloat("funds_available", accountInfo.getFloat("funds_available") + amount);
            accountInfo.updateRow();
        }
    }


    // We don't allow two portfolio to have the same name for one particular user
    public static JSONObject createPortfolio(String username, String portName, Connection con) throws Exception {
        JSONObject obj = new JSONObject();
        JSONObject body = new JSONObject();

        // check if portfolio reserved for IPO
        String sql1 = "SELECT * FROM " + COMPANY_TABLE + " WHERE username=?";
        PreparedStatement checkCompany = con.prepareStatement(sql1);
        checkCompany.setString(1, username);
        System.out.println("[EXECUTING SQL]: " + checkCompany);
        ResultSet companyRecord = checkCompany.executeQuery();

        if(portName.toLowerCase().equals("ipo") && !companyRecord.next()) {
            body.put("text", "Portfolio of name " + portName + " reserved for IPO");
            obj.put("body", body);
            obj.put("code", 400);
            return obj;
        }

        // Check if the user already have a portfolio with this name
        String sql2 = "SELECT p_name FROM " + PORTFOLIO_TABLE + " WHERE username=? AND p_name=?";
        PreparedStatement checkUsrPortfolio = con.prepareStatement(sql2);
        checkUsrPortfolio.setString(1, username);
        checkUsrPortfolio.setString(2, portName);
        System.out.println("[EXECUTING SQL]: " + checkUsrPortfolio);
        ResultSet usrPortInfo = checkUsrPortfolio.executeQuery();

        if(usrPortInfo.next()){
            body.put("text", "Portfolio of name " + portName + " already exists");
            obj.put("body", body);
            obj.put("code", 400);
            return obj;
        }

        // insert new portfolio
        String sql3 = "INSERT INTO " + PORTFOLIO_TABLE + " (username, p_name)" + " VALUES(?, ?)";
        PreparedStatement addUsrPortfolio = con.prepareStatement(sql3);
        addUsrPortfolio.setString(1, username);
        addUsrPortfolio.setString(2, portName);
        System.out.println("[EXECUTING SQL]: " + addUsrPortfolio);
        addUsrPortfolio.executeUpdate();

        body.put("text", "Portfolio of name " + portName + " created successfully");
        obj.put("body", body);
        obj.put("code", 200);

        return obj;
    }

    public static JSONObject deletePortfolio(String username, String portName, Connection con) throws Exception {
        JSONObject obj = new JSONObject();
        JSONObject body = new JSONObject();

        String sql = "DELETE FROM " + PORTFOLIO_TABLE + " WHERE username=? AND p_name=?";
        PreparedStatement deletePortfolio = con.prepareStatement(sql);
        deletePortfolio.setString(1, username);
        deletePortfolio.setString(2, portName);
        System.out.println("[EXECUTING SQL]: " + deletePortfolio);
        deletePortfolio.executeUpdate();

        body.put("text", "Portfolio " + portName + " successfully deleted");
        obj.put("body", body);
        obj.put("code", 200);

        return obj;
    }

    public static JSONArray getTradesByPortfolio(String username, String portName, Connection con) throws Exception {
        String query = "SELECT C.ticker, abbre, num_shares, buy_price, price FROM Company C, ClosedOrder CO WHERE C.ticker=CO.ticker AND " +
                "CO.username='" + username + "' AND p_name='" + portName + "'";
        Statement getTradesByPort = con.createStatement();
        ResultSet tradesByPort = getTradesByPort.executeQuery(query);

        Map<String, String> mp = new HashMap<>();
        mp.put("ticker", "ticker");
        mp.put("exchange", "abbre");
        mp.put("numShares", "num_shares");
        mp.put("purchasePrice", "buy_price");
        mp.put("currentPrice", "price");

        return DataProvider.getAllData(mp, tradesByPort);
    }

    public static JSONArray getPendingOrders(String username, Connection con) throws Exception{
        String query = "SELECT to_id,type,ticker,order_time,num_shares,price FROM TradeOrder WHERE username=?";
        PreparedStatement getPendingOrders = con.prepareStatement(query);
        getPendingOrders.setString(1, username);
        ResultSet pendingOrders = getPendingOrders.executeQuery();

        Map<String, String> mp = new HashMap<>();
        mp.put("id", "to_id");
        mp.put("type", "type");
        mp.put("ticker", "ticker");
        mp.put("date", "order_time");
        mp.put("number", "num_shares");
        mp.put("price", "price");

        return DataProvider.getAllData(mp, pendingOrders);
    }

    public static JSONObject getAllTradedStocks(Connection con) throws Exception {
        JSONObject allTradedStocksInfo = new JSONObject();

        String query = "SELECT ticker,abbre,price,industry,c_name FROM Company";
        Statement getAllTradedStocks = con.createStatement();

        ResultSet allTradedStocks = getAllTradedStocks.executeQuery(query);

        Map<String, String> mp = new HashMap<>();
        mp.put("ticker", "ticker");
        mp.put("exchange", "abbre");
        mp.put("price", "price");
        mp.put("industry", "industry");
        mp.put("companyName", "c_name");

        //Get all exchanges
        String allExchangesQuery = "SELECT abbreviation FROM " + EXCHANGE_TABLE;
        Statement getAllExchanges = con.createStatement();
        ResultSet allExchanges = getAllExchanges.executeQuery(allExchangesQuery);
        JSONArray exchanges = new JSONArray();
        while(allExchanges.next()) {
            exchanges.add(allExchanges.getString("abbreviation"));
        }

        //Get all tickers
        String allTickersQuery = "SELECT ticker FROM " + COMPANY_TABLE;
        Statement getAllTickers = con.createStatement();
        ResultSet allTickers = getAllTickers.executeQuery(allTickersQuery);
        JSONArray tickers = new JSONArray();
        while(allTickers.next()) {
            tickers.add(allTickers.getString("ticker"));
        }


        allTradedStocksInfo.put("exchanges", exchanges);
        allTradedStocksInfo.put("symbols", tickers);
        allTradedStocksInfo.put("stocks", DataProvider.getAllData(mp, allTradedStocks));

        return allTradedStocksInfo;
    }

    public static JSONObject changePassword(String username, String oldPassword, String newPassword, Connection con) throws Exception {
        Statement checkExisting = con.createStatement();
        Statement updatePassword = con.createStatement();

        JSONObject obj = new JSONObject();

        ResultSet resultsSet = checkExisting.executeQuery("SELECT username, password FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'");

        if(resultsSet.next()) {
            String pw = resultsSet.getString("password");
            if(oldPassword.equals(pw)) {
                String updateQuery = "UPDATE " + ACCOUNTS_TABLE + " SET password='" + newPassword + "' WHERE username='" + username + "'" ;
                updatePassword.executeUpdate(updateQuery);
                obj.put("body", "Password changed successfully");
                return obj;
            }

            obj.put("body", "Existing password mismatch, please try again");
            return obj;
        }

        obj.put("body", "Username doesn't exist");
        return obj;
    }

    public static JSONObject findMarketTrend(Connection con) throws Exception{
        JSONObject trends = new JSONObject();
        // highest price
        String highestPriceQuery = "SELECT ticker,c_name,industry,username,abbre,MAX(price) AS price FROM " + COMPANY_TABLE + " GROUP BY ticker";
        Statement getHighestPriceTrade = con.createStatement();
        System.out.println("[EXECUTING SQL]: " + highestPriceQuery);
        ResultSet highestPriceTrade = getHighestPriceTrade.executeQuery(highestPriceQuery);
        if(highestPriceTrade.next()) {
            JSONObject highest = new JSONObject();
            highest.put("ticker", highestPriceTrade.getString("ticker"));
            highest.put("exchange", highestPriceTrade.getString("abbre"));
            highest.put("price", highestPriceTrade.getFloat("price"));
            highest.put("industry", highestPriceTrade.getString("industry"));
            highest.put("companyName", highestPriceTrade.getString("c_name"));
            trends.put("stockTrendHighest", highest);
        }

        // lowest price
        String lowestPriceQuery = "SELECT ticker,c_name,industry,username,abbre,MIN(price) AS price FROM " + COMPANY_TABLE + " GROUP BY ticker";
        Statement getLowestPriceTrade = con.createStatement();
        System.out.println("[EXECUTING SQL]: " + lowestPriceQuery);
        ResultSet lowestPriceTrade = getLowestPriceTrade.executeQuery(lowestPriceQuery);
        if(lowestPriceTrade.next()) {
            JSONObject lowest = new JSONObject();
            lowest.put("ticker", lowestPriceTrade.getString("ticker"));
            lowest.put("exchange", lowestPriceTrade.getString("abbre"));
            lowest.put("price", lowestPriceTrade.getFloat("price"));
            lowest.put("industry", lowestPriceTrade.getString("industry"));
            lowest.put("companyName", lowestPriceTrade.getString("c_name"));
            trends.put("stockTrendLowest", lowest);
        }

        // mostFrequentlyTraded
        String frequentQuery = "SELECT ticker, COUNT(ticker) AS ticker_occurrence FROM " + TRADED_ORDER_TABLE + " GROUP BY ticker ORDER BY ticker_occurrence DESC";
        Statement getMostFrequentTrade = con.createStatement();
        System.out.println("[EXECUTING SQL]: " + frequentQuery);
        ResultSet mostFrequentTrade = getMostFrequentTrade.executeQuery(frequentQuery);
        if(mostFrequentTrade.first()) {
            String mostFrequentQuery = "SELECT * FROM " + COMPANY_TABLE + " WHERE ticker='" + mostFrequentTrade.getString("ticker") + "'";
            Statement getMostFrequent = con.createStatement();
            System.out.println("[EXECUTING SQL]: " + mostFrequentQuery);
            ResultSet res = getMostFrequent.executeQuery(mostFrequentQuery);
            if(res.first()) {
                JSONObject mostFrequent = new JSONObject();
                mostFrequent.put("ticker", res.getString("ticker"));
                mostFrequent.put("exchange", res.getString("abbre"));
                mostFrequent.put("price", res.getFloat("price"));
                mostFrequent.put("industry", res.getString("industry"));
                mostFrequent.put("companyName", res.getString("c_name"));
                trends.put("stockTrendMostFrequent", mostFrequent);
            }
        }

        // leastFrequentlyTraded
        if(mostFrequentTrade.last()) {
            String leastFrequentQuery = "SELECT * FROM " + COMPANY_TABLE + " WHERE ticker='" + mostFrequentTrade.getString("ticker") + "'";
            Statement getMostFrequent = con.createStatement();
            System.out.println("[EXECUTING SQL]: " + leastFrequentQuery);
            ResultSet res = getMostFrequent.executeQuery(leastFrequentQuery);

            if(res.first()) {
                JSONObject leastFrequent = new JSONObject();
                leastFrequent.put("ticker", res.getString("ticker"));
                leastFrequent.put("exchange", res.getString("abbre"));
                leastFrequent.put("price", res.getFloat("price"));
                leastFrequent.put("industry", res.getString("industry"));
                leastFrequent.put("companyName", res.getString("c_name"));
                trends.put("stockTrendLeastFrequent", leastFrequent);
            }
        }

        trends.put("code", 200);
        return trends;
    }

    public static void createIPO(String username, String ticker, String industry, String companyName, String exchange, Float startingPrice, int numShares, Connection con) throws Exception {
        String ipoPortName = "IPO";

        //Company Creation
        String createCompanyQuery = "INSERT INTO " + COMPANY_TABLE + " (c_name, industry, ticker, price, username, abbre) VALUES " +
                "('" + companyName + "','" + industry + "','" + ticker + "'," + startingPrice + ",'" + username + "','" + exchange + "')";

        System.out.println(createCompanyQuery);

        Statement createCompany = con.createStatement();
        createCompany.executeUpdate(createCompanyQuery);

        //Create portfolio
        createPortfolio(username, ipoPortName, con);

        Order sellOrder = new Order(OrderTypes.SELL, username, ticker, exchange, "IPO", numShares, startingPrice);

        // Add stock to ClosedTrade
        String addClosedTradeQuery = "INSERT INTO " + CLOSED_ORDER_TABLE + " " +sellOrder.getClosedOrderFields() + " VALUES " +
                sellOrder.getClosedOrder();
        Statement ipo = con.createStatement();
        ipo.executeUpdate(addClosedTradeQuery);

        //Sell order creation
        executeSell(username, ticker, exchange, numShares, ipoPortName, con);
    }

    public static void deleteCompany(String username, String ticker, Connection con) throws Exception {
        // User has to be the owner of the company in order to be able to delete the company.
        Statement checkOwner = con.createStatement();
        ResultSet companyRecord = checkOwner.executeQuery("SELECT ticker, username FROM " + COMPANY_TABLE + " WHERE ticker='" + ticker + "' AND username='" + username + "'");

        if(companyRecord.next()) {
            String query = "DELETE FROM " + COMPANY_TABLE + " WHERE ticker='" + ticker + "'";
            Statement removeCompany = con.createStatement();
            removeCompany.executeUpdate(query);
        }
    }

    public static JSONObject executeBuy(String username, String ticker, String exchange, int numShares, String portName, Connection con) throws Exception {
        JSONObject obj = new JSONObject();

        // Check if company is traded on the particular exchange in the company table if so pick out the record.
        Statement checkTradedStock = con.createStatement();
        ResultSet tickerInfo = checkTradedStock.executeQuery("SELECT ticker, price, abbre FROM " + COMPANY_TABLE + " WHERE ticker='" + ticker + "' AND abbre='" + exchange + "'");

        if(!tickerInfo.next()) {
            obj.put("body", "Stock is not traded on the exchange");
            return obj;
        }

        // Check portfolio exist for this user
        Statement checkUserPort = con.createStatement();
        ResultSet usrPortInfo = checkUserPort.executeQuery("SELECT p_name, username FROM " + PORTFOLIO_TABLE + " WHERE username='" + username + "' AND p_name='" + portName + "'");

        if(!usrPortInfo.next()) {
            obj.put("body", "Portfolio doesn't exist");
            return obj;
        }

        // Check if sufficient fund
        Float currentPrice = tickerInfo.getFloat("price");
        Statement checkFund = con.createStatement();
        ResultSet accountInfo = checkFund.executeQuery("SELECT funds_available FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'");
        accountInfo.next();
        Float fundsAvailable  = accountInfo.getFloat("funds_available");
        if(fundsAvailable < currentPrice * numShares) {
            obj.put("body", "Insufficient fund");
            return obj;
        }

        Order buyOrder = new Order(OrderTypes.BUY, username, ticker, exchange, portName, numShares, currentPrice);

        //Insert into database and select last_insert_id()
        Statement insertUserPort = con.createStatement();
        insertUserPort.executeUpdate("INSERT INTO " + TRADED_ORDER_TABLE + " " + buyOrder.getTradedOrderFields() + "VALUES " + buyOrder.getTradedOrder());

        Statement lastInsertId = con.createStatement();
        ResultSet insertID = lastInsertId.executeQuery("SELECT last_insert_id()");

        if(!insertID.next()) {
            obj.put("body", "Order not placed successfully");
            return obj;
        }

        int orderId = insertID.getInt("last_insert_id()");
        buyOrder.addOrderID(orderId);

        closeOrder(buyOrder, con);

        obj.put("body", "Order placed successfully");
        return obj;
    }

    public static JSONObject executeSell(String username, String ticker, String exchange, int numShares, String portName, Connection con) throws Exception {
        JSONObject obj = new JSONObject();

        // Check if company is traded on the particular exchange in the company table if so pick out the record.
        Statement checkTradedStock = con.createStatement();
        ResultSet tickerInfo = checkTradedStock.executeQuery("SELECT ticker, price, abbre FROM " + COMPANY_TABLE + " WHERE ticker='" + ticker + "' AND abbre='" + exchange + "'");

        if(!tickerInfo.next()) {
            obj.put("body", "Stock is not traded on the exchange");
            return obj;
        }

        // Check user has the amount to sell;
        String checkOwnershipQuery = "SELECT * FROM " + CLOSED_ORDER_TABLE + " WHERE username='"+ username +
                "' AND p_name='" + portName +"' AND ticker='" + ticker + "'";
        Statement checkOwnership = con.createStatement();
        ResultSet ownedStock = checkOwnership.executeQuery(checkOwnershipQuery);

        if(!ownedStock.next()) {
            obj.put("body", ticker + " does not exist in portfolio: " + portName);
            return obj;
        }

        if(ownedStock.getInt("num_shares") < numShares)
        {
            obj.put("body", ticker + " not enough shares in portfolio: " + portName);
            return obj;
        }

        Float currentPrice = tickerInfo.getFloat("price");

        Order sellOrder = new Order(OrderTypes.SELL, username, ticker, exchange, portName, numShares, currentPrice);

        //Insert into database and select last_insert_id()
        Statement insertUserPort = con.createStatement();
        insertUserPort.executeUpdate("INSERT INTO " + TRADED_ORDER_TABLE + " " + sellOrder.getTradedOrderFields() + "VALUES " + sellOrder.getTradedOrder());

        Statement lastInsertId = con.createStatement();
        ResultSet insertID = lastInsertId.executeQuery("SELECT last_insert_id()");

        if(!insertID.next()) {
            obj.put("body", "Order not placed successfully");
            return obj;
        }

        int orderId = insertID.getInt("last_insert_id()");
        sellOrder.addOrderID(orderId);

        closeOrder(sellOrder, con);

        obj.put("body", "Order closed successfully");
        return obj;
    }

    //  order must have been inserted into the TradeOrder table
    public static void deletePendingOrder(int orderID, Connection con) throws Exception {
        String query = "DELETE FROM " + TRADED_ORDER_TABLE + " WHERE to_id=" + orderID;
        Statement deletePendingOrder = con.createStatement();

        deletePendingOrder.executeUpdate(query);
    }

    public static JSONObject getCompanyTrends(String ticker, Connection con) throws Exception {
        JSONObject obj = new JSONObject();
        JSONObject body = new JSONObject();

        String query = "SELECT * FROM " + COMPANY_TABLE + " WHERE ticker=?";
        PreparedStatement getCompanyDetails = con.prepareStatement(query);
        getCompanyDetails.setString(1, ticker);
        System.out.println("[EXECUTING SQL]: " + getCompanyDetails);
        ResultSet company = getCompanyDetails.executeQuery();

        if (!company.next()) {
            obj.put("code", 400);
            body.put("text", "Company does not exist");
            return obj;
        }

        obj.put("code", 200);
        obj.put("ticker",company.getString("ticker"));
        obj.put("exchange",company.getString("abbre"));
        obj.put("price",company.getFloat("price"));
        obj.put("industry",company.getString("industry"));
        obj.put("companyName",company.getString("c_name"));

        return obj;
    }

    private static void closeOrder(Order order, Connection con) throws Exception{

        // Select all opposite orders (i.e if order is buy, then we select all sell orders) and group by ascending order by order_time
        OrderTypes oppositeType = order.getType() == OrderTypes.BUY ? OrderTypes.SELL : OrderTypes.BUY;
        String oppositeOrdersQuery = "SELECT * FROM " + TRADED_ORDER_TABLE + " WHERE type=" + oppositeType + " AND to_id<>" + order.getOrderID() +
                " AND ticker='" + order.getTicker() + "' ORDER BY order_time ASC";

        Statement selectClosingCandidates = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet closingCandidates = selectClosingCandidates.executeQuery(oppositeOrdersQuery);

        // Select closing target
        String closingTargetQuery = "SELECT * FROM " + TRADED_ORDER_TABLE + " WHERE to_id=" + order.getOrderID();
        Statement selectClosingTarget = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet closingTarget = selectClosingTarget.executeQuery(closingTargetQuery);
        closingTarget.next();

        while(closingCandidates.next()) {
            if(closingCandidates.getFloat("price") == order.getPrice()) {
                int numShares = closingCandidates.getInt("num_shares");
                if (numShares > order.getNumShares()) {
                    closingCandidates.updateInt("num_shares", numShares - order.getNumShares());

                    String updateClosingCandidateQuery = "UPDATE " + TRADED_ORDER_TABLE +
                            " SET num_shares=" + (numShares - order.getNumShares()) + " WHERE to_id=" + closingCandidates.getInt("to_id");

                    Statement updateClosingCandidate = con.createStatement();
                    updateClosingCandidate.executeUpdate(updateClosingCandidateQuery);
                    closingTarget.deleteRow();


                    Order counterPartyOrder = new Order(oppositeType,
                            closingCandidates.getString("username"),
                            closingCandidates.getString("ticker"),
                            "",
                            closingCandidates.getString("p_name"),
                            order.getNumShares(),
                            closingCandidates.getFloat("price"));

                    updateValues(order, con);
                    updateValues(counterPartyOrder, con);

                } else if (numShares < order.getNumShares()) {
                    String updateClosingTargetQuery = "UPDATE " + TRADED_ORDER_TABLE +
                            " SET num_shares=" + (order.getNumShares() - numShares) + " WHERE to_id=" + closingTarget.getInt("to_id");
                    Statement updateClosingTarget = con.createStatement();
                    updateClosingTarget.executeUpdate(updateClosingTargetQuery);

                    Order closedPortion = new Order(order);
                    closedPortion.updateQty(numShares);

                    Order counterPartyOrder = new Order(oppositeType,
                            closingCandidates.getString("username"),
                            closingCandidates.getString("ticker"),
                            "",
                            closingCandidates.getString("p_name"),
                            numShares,
                            closingCandidates.getFloat("price"));

                    updateValues(closedPortion, con);
                    updateValues(counterPartyOrder, con);

                    order.updateQty(order.getNumShares() - numShares);
                    closingCandidates.deleteRow();
                } else {

                    Order counterPartyOrder = new Order(oppositeType,
                            closingCandidates.getString("username"),
                            closingCandidates.getString("ticker"),
                            "",
                            closingCandidates.getString("p_name"),
                            numShares,
                            closingCandidates.getFloat("price"));

                    closingTarget.deleteRow();
                    closingCandidates.deleteRow();

                    updateValues(order, con);
                    updateValues(counterPartyOrder, con);
                }
            }
        }
    }

    private static void updateValues(Order order, Connection con) throws Exception {
        // If buy order add closed order, if sell order remove from closed order
        if (order.getType() == OrderTypes.BUY) {
            String addClosedOrderQuery = "INSERT INTO " + CLOSED_ORDER_TABLE + " " + order.getClosedOrderFields() +
                    " VALUES " + order.getClosedOrder();
            Statement addClosedOrder = con.createStatement();
            addClosedOrder.executeUpdate(addClosedOrderQuery);
            mergeOrders(order, con);
            addFunds(order.getUsername(), -order.getPrice() * order.getNumShares(), con);
        } else {
            //Update the orders first
            String selectClosedOrderQuery = "SELECT * FROM " + CLOSED_ORDER_TABLE + " WHERE username='" + order.getUsername() + "' AND ticker='" +
                    order.getTicker() + "' AND p_name='" + order.getPortName() + "'";
            Statement selectClosedOrder = con.createStatement();
            ResultSet orderToBeClosed = selectClosedOrder.executeQuery(selectClosedOrderQuery);
            orderToBeClosed.next();
            int numShares = orderToBeClosed.getInt("num_shares");

            if(numShares > order.getNumShares()) {
                String updateOrderQuery = "UPDATE " + CLOSED_ORDER_TABLE + "SET num_shares=" + (numShares - order.getNumShares()) + " WHERE o_id=" + orderToBeClosed.getInt("o_id");
                Statement updateOrder = con.createStatement();
                updateOrder.executeUpdate(updateOrderQuery);
            }
            else {
                String removeOrderQuery = "DELETE FROM " + CLOSED_ORDER_TABLE + " WHERE o_id=" + orderToBeClosed.getInt("o_id");
                Statement removeOrder = con.createStatement();
                removeOrder.executeUpdate(removeOrderQuery);
            }
            addFunds(order.getUsername(), order.getPrice() * order.getNumShares(), con);
        }
    }

    private static void mergeOrders(Order order, Connection con) throws Exception {
        String selectFromClosedQuery = "SELECT o_id,buy_price,num_shares FROM ClosedOrder WHERE " +
                "ticker='" + order.getTicker() + "' AND username='" + order.getUsername() + "' AND p_name='" + order.getPortName() + "'";

        int totalNumShares = 0;
        Float totalBuyPrice = 0f;
        boolean merged = false;

        Statement getMergedCandidate = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet mergedCandidate = getMergedCandidate.executeQuery(selectFromClosedQuery);

        if (mergedCandidate.last()) {
            int rowCount = mergedCandidate.getRow();
            mergedCandidate.beforeFirst();
            if(rowCount > 1)
                merged = true;
        }

        while(mergedCandidate.next() && merged) {
            int currNumShares = mergedCandidate.getInt("num_shares");
            totalNumShares += currNumShares;
            totalBuyPrice += mergedCandidate.getFloat("buy_price") * currNumShares;
            mergedCandidate.deleteRow();
        }

        if(merged) {
            Float newAvgPrice = totalBuyPrice / totalNumShares;
            Order newClosedOrder = new Order(order);
            newClosedOrder.updateQty(totalNumShares);
            newClosedOrder.updatePrice(newAvgPrice);

            String updateTrade = "INSERT INTO " + CLOSED_ORDER_TABLE + " " + newClosedOrder.getClosedOrderFields() + " VALUES " +
                    newClosedOrder.getClosedOrder();
            Statement updateClosedOrder = con.createStatement();
            updateClosedOrder.executeUpdate(updateTrade);
        }
    }
}
