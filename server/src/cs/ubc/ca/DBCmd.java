package cs.ubc.ca;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

public class DBCmd {

    private static final String ACCOUNTS_TABLE = "Account";
    private static final String COMPANY_TABLE = "Company";
    private static final String PORTFOLIO_TABLE = "Portfolio";
    private static final String EXCHANGE_TABLE = "Exchange";
    private static final String TRADED_ORDER_TABLE = "TradeOrder";
    private static final String CLOSED_ORDER_TABLE = "ClosedOrder";

    public static boolean login(String username, String password, Connection con) throws Exception {
        Statement loginCmd = con.createStatement();

        ResultSet resultsSet = loginCmd.executeQuery("SELECT username, password FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'");

        if(resultsSet.next()) {
            String pw = resultsSet.getString("password");
            if(password.equals(pw))
                return true;
        }

        return false;
    }

    public static boolean createAccount(String username, String password, String firstName, String lastName, Connection con) throws Exception {
        Statement checkExisting = con.createStatement();
        Statement createUsrAcc = con.createStatement();

        ResultSet resultsSet = checkExisting.executeQuery("SELECT username FROM " + ACCOUNTS_TABLE + " WHERE username='" + username + "'");

        if(resultsSet.next())
            return false;

        createUsrAcc.executeUpdate("INSERT INTO " + ACCOUNTS_TABLE + " (username, password, first_name, last_name)" +
                " VALUES('" + username + "','" + password + "','" + firstName + "','" + lastName + "')");

        return true;
    }

    // We don't allow two portfolio to have the same name for one particular user
    public static boolean createPortfolio(String username, String portName, Connection con) throws Exception {
        // Check if the user already have a portfolio with this name
        Statement checkUsrPortfolio = con.createStatement();
        ResultSet usrPortInfo = checkUsrPortfolio.executeQuery("SELECT p_id FROM " + PORTFOLIO_TABLE + " WHERE username='" + username + "'AND p_name='" + portName + "'");

        if(usrPortInfo.next())
            return false;

        Statement addUsrPortfolio = con.createStatement();

        addUsrPortfolio.executeUpdate("INSERT INTO " + PORTFOLIO_TABLE + " (username,p_name)" + " VALUES('" + username + "','" + portName + "')");

        return true;
    }

    public static boolean buyShares(String username, String ticker, String exchange, int numShares, String portName, Connection con) throws Exception {

        // Check if company is traded on the particular exchange in the company table if so pick out the record.
        Statement checkTradedStock = con.createStatement();
        ResultSet tickerInfo = checkTradedStock.executeQuery("SELECT ticker, price, abbre FROM " + COMPANY_TABLE + " WHERE ticker='" + ticker + "' AND abbre='" + exchange + "'");

        if(!tickerInfo.next())
            return false;

        // Check portfolio exist for this user
        Statement checkUserPort = con.createStatement();
        ResultSet usrPortInfo = checkUserPort.executeQuery("SELECT p_name, username FROM " + PORTFOLIO_TABLE + " WHERE username='" + username + "'AND p_name='" + portName + "'");

        if(!usrPortInfo.next())
            return false;

        Order buyOrder = new Order(OrderTypes.BUY, username, ticker, exchange, portName, numShares, tickerInfo.getFloat("price"));

        //Insert into database and select last_insert_id()
        Statement insertUserPort = con.createStatement();
        insertUserPort.executeUpdate("INSERT INTO " + TRADED_ORDER_TABLE + " " + buyOrder.getTradedOrderFields() + "VALUES " + buyOrder.getTradedOrder());

        Statement lastInsertId = con.createStatement();
        ResultSet insertID = lastInsertId.executeQuery("SELECT last_insert_id()");

        if(!insertID.next())
            return false;

        buyOrder.addOrderID(insertID.getInt("last_insert_id()"));

        return true;
    }


    public static boolean sellShares() {

        return false;
    }

    private static boolean closeOrder(Order order) {

        // Select all orders except for the one that we are trying to close and group by ascending order by order_time

        return false;
    }
}
