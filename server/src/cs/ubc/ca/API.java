package cs.ubc.ca;

import com.sun.net.httpserver.HttpExchange;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class API {

    public API() {
    }

    public static JSONObject login(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            // TODO: do something with login credentials
            System.out.println(json);
        }

        // TODO: build response
        // Assemble JSON Response; ignore the "Unchecked call" warnings
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("PIGGY", "BEAR");
        body.put("HALLOOOO", "PEOPLE");
        body.put("MANY WOWS", "WOWOWOW");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject create(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            // TODO: do something with create details
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("PIGGY", "BEAR");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject createPortfolio(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            // TODO: do something with create portfolio details
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "created portfolio");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject deletePortfolio(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("DELETE")) {
            JSONObject json = parseBody(t);
            // TODO: do something with deleting portfolio
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "deleted portfolio");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject placeOrder(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            // TODO: do something with placing orders
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "placed order");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject cancelOrder(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("DELETE")) {
            JSONObject json = parseBody(t);
            // TODO: do something with cancelling order
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "cancelled order");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject getTrends(HttpExchange t) {
        // There is no body to parse in this GET request

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "retrieved trends");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject getCompanyDetails(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            // TODO: get company trends
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "getting company details");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject createIPO(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("POST")) {
            JSONObject json = parseBody(t);
            // TODO: create IPO
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "issuing ipo");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
    }

    public static JSONObject updatePassword(HttpExchange t) {
        // Extract JSON from Request Body
        // NOTE: You MUST include this outer if-statement! Otherwise,
        // the server will fail the request!
        if (t.getRequestMethod().equalsIgnoreCase("UPDATE")) {
            JSONObject json = parseBody(t);
            // TODO: update password
            System.out.println(json);
        }

        // Assemble JSON Response; ignore the "Unchecked call" warnings
        // TODO: build response
        JSONObject body = new JSONObject();
        JSONObject jsonBuilder = new JSONObject();
        body.put("message", "updated password");
        jsonBuilder.put("code", 200);
        jsonBuilder.put("body", body);

        return jsonBuilder;
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
            System.out.println(e.toString());
        }

        return buf.toString();
    }

    private static JSONObject parseBody(HttpExchange t) {
        String body = process(t);

        try {
            JSONParser parser = new JSONParser();
            return (JSONObject) parser.parse(body);
        }
        catch(Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

}
