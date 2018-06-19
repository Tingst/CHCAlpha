package cs.ubc.ca;

import com.sun.net.httpserver.HttpExchange;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.Connection;

public class API {

    public static JSONObject login(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);

            try {
                result = DBCmd.login(
                        (String) json.get("username"),
                        (String) json.get("password"),
                        conn
                 );
            } catch(Exception e) {
                e.printStackTrace(System.out);
                return null;
            }
        } else {
            result.put("code", 404);
        }

        return result;
    }

    public static JSONObject create(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);

            try {
                result = DBCmd.createAccount(
                        (String) json.get("username"),
                        (String) json.get("password"),
                        (String) json.get("fname"),
                        (String) json.get("lname"),
                        conn
                );
            } catch(Exception e) {
                e.printStackTrace(System.out);
                return null;
            }
        } else {
            result.put("code", 404);
        }

        return result;
    }

    public static JSONObject createPortfolio(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);

            try {
                result = DBCmd.createPortfolio(
                        (String) json.get("username"),
                        (String) json.get("name"),
                        conn
                );
            } catch(Exception e) {
                e.printStackTrace(System.out);
                return null;
            }
        } else {
            result.put("code", 404);
        }

        return result;
    }

    public static JSONObject getPortfolio(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);

            try {
                // TODO: do this one
                //result = DBCmd.getPortfolio(
                //        (String) json.get("username"),
                //        (String) json.get("name"),
                //        conn
                //);
            } catch(Exception e) {
                e.printStackTrace(System.out);
                return null;
            }
        } else {
            result.put("code", 404);
        }
        result.put("code", 200);
        return result;
    }

    public static JSONObject deletePortfolio(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("DELETE")) {
            JSONObject json = parseBody(t);

            try {
                result = DBCmd.deletePortfolio(
                        (String) json.get("username"),
                        (String) json.get("name"),
                        conn
                );
            } catch(Exception e) {
                e.printStackTrace(System.out);
                return null;
            }
        } else {
            result.put("code", 404);
        }

        return result;
    }

    public static JSONObject getOrders(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            try {
                result = DBCmd.getPendingOrders(
                        (String) json.get("username"),
                        conn
                );
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return null;
            }
        }

        result.put("code", 200);
        return result;
    }

    public static JSONObject placeOrder(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);

            try {
                // Grab args from json body
                int type = ((Long) json.get("type")).intValue();
                String username = (String) json.get("username");
                String ticker = (String) json.get("ticker");
                int numShares = ((Long) json.get("number")).intValue();
                String p_name = (String) json.get("portfolio");

                if (type == 0) {
                    result = DBCmd.executeBuy(username, ticker, numShares, p_name, conn);
                } else {
                    result = DBCmd.executeSell(username, ticker, numShares, p_name, conn);
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return null;
            }
        }

        return result;
    }

    public static JSONObject cancelOrder(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("DELETE")) {
            JSONObject json = parseBody(t);

            try {
                result = DBCmd.deletePendingOrder(Integer.parseInt((String) json.get("id")), conn);
            } catch (Exception e) {
                System.out.println(e.getMessage());
                e.printStackTrace();
                return null;
            }
        }

        return result;
    }

    public static JSONObject getTrends(Connection conn) {
        JSONObject result;
        // There is no body to parse in this GET request

        try {
            result = DBCmd.findMarketTrend(conn);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
        return result;
    }

    public static JSONObject getAllStocks(Connection conn) {
        JSONObject result;

        try {
            // There is no body to parse in this GET request
            result = DBCmd.getAllTradedStocks(conn);

            result.put("code", 200);
        }
        catch(Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
        return result;
    }

    public static JSONObject getCompanyDetails(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            try {
                result = DBCmd.getCompanyTrends((String) json.get("ticker"), conn);
            }
            catch(Exception e) {
                System.out.println(e.getMessage());
                return null;
            }
        }

        return result;
    }

    public static JSONObject createIPO(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            long startPriceLong = (long)json.get("startingPrice");
            float startPrice = (float) (long) startPriceLong;

            long numSharesLong = (long) json.get("numShares");
            Integer numShares = (int) (long) numSharesLong;

            // TODO: build response
            try {
                DBCmd.createIPO(
                        (String) json.get("username"),
                        (String) json.get("ticker"),
                        (String) json.get("industry"),
                        (String) json.get("companyName"),
                        (String) json.get("exchange"),
                        (String) json.get("portfolio"),
                        startPrice,
                        numShares,
                        conn

                 );
                result.put("code", 200);

            } catch (Exception e) {
                e.printStackTrace();
            }

        }

        return result;
    }

    public static JSONObject updatePassword(HttpExchange t, Connection conn) {
        JSONObject result = new JSONObject();

        if (t.getRequestMethod().equalsIgnoreCase("UPDATE")) {
            JSONObject json = parseBody(t);

            try {
                result = DBCmd.changePassword(
                        (String) json.get("username"),
                        (String) json.get("oldPassword"),
                        (String) json.get("newPassword"),
                        conn
                 );
                result.put("code", 200);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }


        return result;
    }

    // ------------------------------------------------
    // Helper Functions
    // ------------------------------------------------

    private static String process(HttpExchange t) {
        // Helper function to read a byte stream
        StringBuilder buf = new StringBuilder(512);

        try {
            InputStreamReader isr =  new InputStreamReader(t.getRequestBody(),"utf-8");
            BufferedReader br = new BufferedReader(isr);

            // Converting bytes to UTF-8:
            int b;
            while ((b = br.read()) != -1) {
                buf.append((char) b);
            }

            br.close();
            isr.close();
        }
        catch(Exception e) {
            e.printStackTrace(System.out);
        }

        return buf.toString();
    }

    private static JSONObject parseBody(HttpExchange t) {
        String body = process(t);

        try {
            JSONParser parser = new JSONParser();
            JSONObject result = (JSONObject) parser.parse(body);
            System.out.print(result);
            System.out.println();
            return result;
        }
        catch(Exception e) {
            e.printStackTrace(System.out);
            return null;
        }
    }

}
