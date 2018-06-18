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

            //2. Create statement/result object
            HttpMirror server = new HttpMirror(myConnection);
            server.run();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
