package cs.ubc.ca;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
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
        Statement loginCmd = con.createStatement();

        ResultSet resultsSet = loginCmd.executeQuery("SELECT username, password, first_name, last_name FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'");

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
        body.put("text", "error");
        obj.put("body", body);
        obj.put("code", 400);
        return obj;
    }

    public static JSONObject createAccount(String username, String password, String firstName, String lastName, Connection con) throws Exception {
        Statement checkExisting = con.createStatement();
        Statement createUsrAcc = con.createStatement();

        JSONObject obj = new JSONObject();

        ResultSet resultsSet = checkExisting.executeQuery("SELECT username FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'");

        if(resultsSet.next()) {
            obj.put("body", "Username " + username + " already existed");
            return obj;
        }

        createUsrAcc.executeUpdate("INSERT INTO " + ACCOUNTS_TABLE + " (username, password, first_name, last_name, funds_available)" +
                " VALUES('" + username + "','" + password + "','" + firstName + "','" + lastName + "',"+ 0 + ")");

        obj.put("body", "User " + username + " created successfully");
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
        String checkCompanyQuery = "SELECT * FROM " + COMPANY_TABLE + " WHERE username='" + username + "'";
        Statement checkCompany = con.createStatement();
        ResultSet companyRecord = checkCompany.executeQuery(checkCompanyQuery);

        if(portName.toLowerCase().equals("ipo") && !companyRecord.next()) {
            obj.put("body", "Portfolio of name " + portName + " reserved for IPO");
            return obj;
        }

        // Check if the user already have a portfolio with this name
        Statement checkUsrPortfolio = con.createStatement();
        ResultSet usrPortInfo = checkUsrPortfolio.executeQuery("SELECT p_name FROM " + PORTFOLIO_TABLE + " WHERE username='" + username + "'AND p_name='" + portName + "'");

        if(usrPortInfo.next()){
            obj.put("body", "Portfolio of name " + portName + " already existed");
            return obj;
        }

        Statement addUsrPortfolio = con.createStatement();

        addUsrPortfolio.executeUpdate("INSERT INTO " + PORTFOLIO_TABLE + " (username,p_name)" + " VALUES('" + username + "','" + portName + "')");

        obj.put("body", "Portfolio of name " + portName + " created successfully");

        return obj;
    }

    public static void deletePortfolio(String username, String portName, Connection con) throws Exception {
        String query = "DELETE FROM " + PORTFOLIO_TABLE + " WHERE username='" + username + "' AND p_name='" + portName + "'";
        Statement deletePortfolio = con.createStatement();

        deletePortfolio.executeUpdate(query);
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
        String query = "SELECT to_id,type,ticker,order_time,num_shares,price FROM TradeOrder WHERE username='" + username + "'";
        Statement getPendingOrders = con.createStatement();

        ResultSet pendingOrders = getPendingOrders.executeQuery(query);

        Map<String, String> mp = new HashMap<>();
        mp.put("id", "to_id");
        mp.put("type", "type");
        mp.put("ticker", "ticker");
        mp.put("date", "order_time");
        mp.put("number", "num_shares");
        mp.put("price", "price");

        return DataProvider.getAllData(mp, pendingOrders);
    }

    public static JSONArray getAllTradedStocks(Connection con) throws Exception {
        String query = "SELECT ticker,abbre,price,industry,c_name FROM Company";
        Statement getAllTradedStocks = con.createStatement();

        ResultSet allTradedStocks = getAllTradedStocks.executeQuery(query);

        Map<String, String> mp = new HashMap<>();
        mp.put("ticker", "ticker");
        mp.put("exchange", "abbre");
        mp.put("price", "price");
        mp.put("industry", "industry");
        mp.put("companyName", "c_name");

        return DataProvider.getAllData(mp, allTradedStocks);
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

    public static JSONArray findMarketTrend() {
        // mostFrequenlyTraded
        // leastFrequenlyTraded
        // highest price
        // lowest price
        return new JSONArray();
    }

    public static void createIPO(String username, String ticker, String industry, String companyName, String exchange, Float startingPrice, int numShares, Connection con) throws Exception {
        String ipoPortName = "IPO";

        //Company Creation
        String createCompanyQuery = "INSERT INTO " + COMPANY_TABLE + " (c_name, industry, ticker, price, username, abbre) VALUES " +
                "('" + companyName + "','" + industry + "','" + ticker + "'," + startingPrice + ",'" + username + "','" + exchange + "')";

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
