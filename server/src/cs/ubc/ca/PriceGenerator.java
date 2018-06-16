package cs.ubc.ca;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Random;

public class PriceGenerator {

    private Random rand;
    private static final int SEED = 1234;
    private static final String CMD = "UPDATE";
    private static String tableName;
    private static final String ACTION = "SET price=";

    private static final Float miu = 0.1f;
    private static final Float sigma = 0.20f;
    private static final Float dt = 0.05f;


    public PriceGenerator (String tableName) {
        rand = new Random(SEED);
        this.tableName = tableName;
    }

    public void updateStockPrices (Connection con) throws Exception{
        Statement stat = con.createStatement();

        while(true) {
            ResultSet resultsSet = stat.executeQuery("SELECT c_id, price FROM IsTraded");
            while (resultsSet.next()) {
                int curr_cid = resultsSet.getInt("c_id");
                double curr_price = resultsSet.getFloat("price");
                Statement update = con.createStatement();
                int res = update.executeUpdate(CMD + " " + tableName + " " + ACTION + curr_price * Math.exp((miu - Math.pow(sigma, 2) / 2) * dt + sigma * rand.nextGaussian() * Math.sqrt(dt)) + " WHERE c_id=" + curr_cid + ";");
                Thread.sleep(5 * 1000);
            }
        }
    }
}
