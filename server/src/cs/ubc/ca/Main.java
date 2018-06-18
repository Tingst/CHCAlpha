package cs.ubc.ca;
import java.sql.*;

public class Main {

    public static void main(String[] args) {
        // write your code here
        System.out.println("STARTING");
        try {

            Class.forName("com.mysql.jdbc.Driver");
            String dbURL = "jdbc:mysql://localhost:3306/stock?useSSL=false";
            String dbUsername = "root";
            String password = "";
            // ?autoReconnect=true&useSSL=false

            //1. Create connection
            Connection myConnection = DriverManager.getConnection(dbURL, dbUsername, password);

            //2. Create statement object
            Statement myStatement = myConnection.createStatement();
            ResultSet rs;

            HttpMirror server = new HttpMirror(myConnection);
            server.run();

            //PriceGenerator pg = new PriceGenerator("Company");
            //pg.updateStockPrices(myConnection);
            //while (true) {
                //RequestManager req = new RequestManager(8001);
                //req.getClientCommand();
            //}
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
