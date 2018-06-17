package cs.ubc.ca;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.sql.ResultSet;
import java.util.Map;

public class DataProvider {

    public static JSONArray getAllData(Map<String, String> mp, ResultSet rs) throws Exception {
        JSONArray allRecords = new JSONArray();

        while(rs.next()) {
            JSONObject record = new JSONObject();
            for (Map.Entry e : mp.entrySet()) {
                record.put(e.getKey(),rs.getString(e.getValue().toString()));
            }
            allRecords.add(record);
        }
        return allRecords;
    }
}
