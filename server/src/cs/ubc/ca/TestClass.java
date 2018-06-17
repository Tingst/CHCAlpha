package cs.ubc.ca;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.Iterator;
import java.util.Map;

public class TestClass {

    public static void main(String[] args) {
        // write your code here
        try {
            Class.forName("com.mysql.jdbc.Driver");

            String dbURL = "jdbc:mysql://localhost:3306/trading_system_DB?useSSL=false";
            String dbUsername = "root";
            String password = "123456";
            // ?autoReconnect=true&useSSL=false

            //1. Create connection
            Connection myConnection = DriverManager.getConnection(dbURL, dbUsername, password);

            //2. Create statement object
            Statement myStatement = myConnection.createStatement();


//            JSONArray jArr = DBCmd.getTradesByPortfolio("bggoodman", "super performance equity", myConnection);
//            JSONArray jArr = DBCmd.getPendingOrders("bggoodman", myConnection);

//            for(int i = 0; i < jArr.size();i++) {
//                JSONObject innerObj = (JSONObject) jArr.get(i);
//                System.out.print(innerObj);
//            }

//            DBCmd.deletePortfolio("bggoodman", "super performance equity", myConnection);
//            DBCmd.deleteCompany("bggoodman", "MSFT", myConnection);

//            DBCmd.changePassword("bggoodman", "123", "234", myConnection);
//            Order order = new Order(OrderTypes.BUY , "bggoodman", "GOOGL", "NASDAQ", "super performance equity", 3, 123f);
//            DBCmd.mergeOrders(order, myConnection);

//            DBCmd.addFunds("gHumpkins", 20000000f, myConnection);
//            DBCmd.executeBuy("gHumpkins", "GOOGL", "NASDAQ", 1500, "tech sector", myConnection);

//            DBCmd.executeSell("gHumpkins", "GOOGL", "NASDAQ", 1200, "tech sector", myConnection);

            DBCmd.createIPO("gHumpkins", "AMZN", "Technology", "Amazon", "NASDAQ", 200f, 1000000, myConnection);

        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
