package cs.ubc.ca;
import java.io.PrintStream;
import java.sql.*;

public class Main {

    public static void main(String[] args) {
        // write your code here
        try {
            Class.forName("com.mysql.jdbc.Driver");
            String dbURL = "jdbc:mysql://localhost:3306/stock?useSSL=false";
            String dbUsername = "root";
            String password = "123456";

            //1. Create connection
            Connection myConnection = DriverManager.getConnection(dbURL, dbUsername, password);

            //2. Create statement/result object
            HttpMirror server = new HttpMirror(myConnection);
            server.run();

        }
        catch(Exception e)
        {
            e.printStackTrace(System.out);
        }
    }
}
