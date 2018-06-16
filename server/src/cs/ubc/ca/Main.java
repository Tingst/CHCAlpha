package cs.ubc.ca;
import java.sql.*;
import java.util.Map;

public class Main {

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


                PriceGenerator pg = new PriceGenerator("Company");
                pg.updateStockPrices(myConnection);
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
