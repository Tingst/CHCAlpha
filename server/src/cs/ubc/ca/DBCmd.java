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

        ResultSet resultsSet = loginCmd.executeQuery("SELECT username, password FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'");

        JSONObject obj = new JSONObject();
        if(resultsSet.next()) {
            String pw = resultsSet.getString("password");
            if(password.equals(pw)) {
                obj.put("body", "Login successful");
                obj.put("code", 200);
                return obj;
            }
        }
        obj.put("code", 400);
        obj.put("body", "Login failed");
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


        createUsrAcc.executeUpdate("INSERT INTO " + ACCOUNTS_TABLE + " (username, password, first_name, last_name)" +
                " VALUES('" + username + "','" + password + "','" + firstName + "','" + lastName + "')");

        obj.put("body", "User " + username + " created successfully");
        return obj;
    }

    // We don't allow two portfolio to have the same name for one particular user
    public static JSONObject createPortfolio(String username, String portName, Connection con) throws Exception {
        // Check if the user already have a portfolio with this name
        Statement checkUsrPortfolio = con.createStatement();
        ResultSet usrPortInfo = checkUsrPortfolio.executeQuery("SELECT p_id FROM " + PORTFOLIO_TABLE + " WHERE username='" + username + "'AND p_name='" + portName + "'");
        JSONObject obj = new JSONObject();
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

    public static void createIPO(String username, String ticker, String companyName, String exchange, Float startingPrice, int numShares) {
        //Company Creation
        //Sell order creation

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

    public static JSONObject executeOrder(OrderTypes type, String username, String ticker, String exchange, int numShares, String portName, Connection con) throws Exception {

        // Check if company is traded on the particular exchange in the company table if so pick out the record.
        Statement checkTradedStock = con.createStatement();
        ResultSet tickerInfo = checkTradedStock.executeQuery("SELECT ticker, price, abbre FROM " + COMPANY_TABLE + " WHERE ticker='" + ticker + "' AND abbre='" + exchange + "'");
        JSONObject obj = new JSONObject();

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

        Order buyOrder = new Order(type, username, ticker, exchange, portName, numShares, tickerInfo.getFloat("price"));

        //Insert into database and select last_insert_id()
        Statement insertUserPort = con.createStatement();
        insertUserPort.executeUpdate("INSERT INTO " + TRADED_ORDER_TABLE + " " + buyOrder.getTradedOrderFields() + "VALUES " + buyOrder.getTradedOrder());

        Statement lastInsertId = con.createStatement();
        ResultSet insertID = lastInsertId.executeQuery("SELECT last_insert_id()");

        if(!insertID.next()) {
            obj.put("body", "Order not placed successfully");
            return obj;
        }

        int test = insertID.getInt("last_insert_id()");
        buyOrder.addOrderID(test);

        closeOrder(buyOrder, con);

        obj.put("body", "Order placed successfully");
        return obj;
    }

    public static void deletePendingOrder(int orderID, Connection con) throws Exception {
        String query = "DELETE FROM " + TRADED_ORDER_TABLE + " WHERE to_id=" + orderID;
        Statement deletePendingOrder = con.createStatement();

        deletePendingOrder.executeUpdate(query);
    }

    private static void closeOrder(Order order, Connection con) throws Exception{

        // Select all opposite orders (i.e if order is buy, then we select all sell orders) and group by ascending order by order_time
        OrderTypes oppositeType = order.getType() == OrderTypes.BUY ? OrderTypes.SELL : OrderTypes.BUY;
        String query = "SELECT * FROM " + TRADED_ORDER_TABLE + " WHERE type=" + oppositeType + " AND to_id<>" + order.getOrderID() +
                " AND ticker='" + order.getTicker() + "' ORDER BY order_time ASC";

        Statement selectClosingCandidates = con.createStatement();
        ResultSet closingCandidates = selectClosingCandidates.executeQuery(query);

        while(closingCandidates.next()) {

            int numShares = closingCandidates.getInt("num_shares");
            if(numShares > order.getNumShares()) {
                String updateOrderQuery = "UPDATE " + TRADED_ORDER_TABLE + " SET num_shares=" +
                        (numShares - order.getNumShares()) + " WHERE to_id=" + closingCandidates.getInt("to_id");
                Statement updateOppositeOrder = con.createStatement();
                updateOppositeOrder.executeUpdate(updateOrderQuery);

                //Delete Placed Order
                String removePlacedOrderQuery = "DELETE FROM " + TRADED_ORDER_TABLE + " WHERE to_id=" + order.getOrderID();
                Statement removePlacedOrder = con.createStatement();
                removePlacedOrder.executeUpdate(removePlacedOrderQuery);

                //add order for user
                String addOrder = "INSERT INTO " + CLOSED_ORDER_TABLE + " " + order.getClosedOrderFields() +
                        " VALUES " + order.getCloseOrder();

                Statement addClosedOrder = con.createStatement();
                addClosedOrder.executeUpdate(addOrder);
                return;
            }
            else {

                //TODO:
            }
        }
    }
}
