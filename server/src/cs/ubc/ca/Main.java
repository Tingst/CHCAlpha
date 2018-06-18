package cs.ubc.ca;
import java.sql.*;
import java.util.Map;

public class Main {

    public static void main(String[] args) {
        // write your code here
        System.out.println("STARTING");
        try {
            HttpMirror server = new HttpMirror();
            server.run();

            Class.forName("com.mysql.jdbc.Driver");
            String dbURL = "jdbc:mysql://localhost:3306/stock?useSSL=false";
            String dbUsername = "root";
            String password = "123456";
            // ?autoReconnect=true&useSSL=false

            //1. Create connection
            Connection myConnection = DriverManager.getConnection(dbURL, dbUsername, password);

            //2. Create statement/result object
            Statement myStatement = myConnection.createStatement();
            ResultSet rs;

            // Test sql query
            String sq1 = "SELECT * FROM Company";
            rs = myStatement.executeQuery(sq1);
            while (rs.next()) {
                System.out.println(rs.getString(1));
            }

//            if (myStatement.execute("SELECT * FROM Company")) {
//                rs = myStatement.getResultSet();
//                System.out.println(rs.getString(1));
//            }

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
