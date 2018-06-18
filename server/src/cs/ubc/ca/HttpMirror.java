package cs.ubc.ca;

import java.io.*;
import java.net.InetSocketAddress;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.simple.JSONObject;

public class HttpMirror {
    Connection conn;

    public HttpMirror(Connection conn) {
        this.conn = conn;
    }

    public void run() throws Exception {
        System.out.println("Listening to port 9000...");
        HttpServer server = HttpServer.create(new InetSocketAddress(9000), 0);

        server.createContext("/login", new Handler("login", this.conn));
        server.createContext("/create", new Handler("create", this.conn));
        server.createContext("/createportfolio", new Handler("createportfolio", this.conn));
        server.createContext("/deleteportfolio", new Handler("deleteportfolio", this.conn));
        server.createContext("/orders", new Handler("orders", this.conn));
        server.createContext("/placeorder", new Handler("placeorder", this.conn));
        server.createContext("/cancelorder", new Handler("cancelorder", this.conn));
        server.createContext("/trends", new Handler("trends", this.conn));
        server.createContext("/stocks", new Handler("stocks", this.conn));
        server.createContext("/company", new Handler("company", this.conn));
        server.createContext("/ipo", new Handler("ipo", this.conn));
        server.createContext("/password", new Handler("password", this.conn));
        server.setExecutor(null); // creates a default executor
        server.start();
    }

    static class Handler implements HttpHandler {
        private String endpoint;
        Connection conn;

        public Handler(String endpoint, Connection conn) {
            this.endpoint = endpoint;
            this.conn = conn;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            // Receive Request
            Headers requestHeaders = t.getRequestHeaders();
            Headers responseHeaders = t.getResponseHeaders();
            for (Map.Entry<String, List<String>> header : requestHeaders.entrySet()) {
                responseHeaders.put(header.getKey(), header.getValue());
            }

            // Take care of CORS issues
            responseHeaders.add("Access-Control-Allow-Origin", "*");
            responseHeaders.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE");
            responseHeaders.add("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");

            if (t.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                System.out.println("[" + t.getRequestMethod() + "] " + "Preflight Request");
            }

            // Logging
            if (!t.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                System.out.print("[" + t.getRequestMethod() + "] " + "/" + this.endpoint + " ");
            }

            // Delegate to appropriate API endpoint
            JSONObject jsonBuilder;
            switch(this.endpoint) {

                case "login": {
                    jsonBuilder = API.login(t, this.conn);
                    break;
                }
                case "create": {
                    jsonBuilder = API.create(t, this.conn);
                    break;
                }
                case "createportfolio": {
                    jsonBuilder = API.createPortfolio(t, this.conn);
                    break;
                }
                case "deleteportfolio": {
                    jsonBuilder = API.deletePortfolio(t, this.conn);
                    break;
                }
                case "orders": {
                    jsonBuilder = API.getOrders(t, this.conn);
                    break;
                }
                case "placeorder": {
                    jsonBuilder = API.placeOrder(t, this.conn);
                    break;
                }
                case "cancelorder": {
                    jsonBuilder = API.cancelOrder(t, this.conn);
                    break;
                }
                case "trends": {
                    jsonBuilder = API.getTrends();
                    break;
                }
                case "stocks": {
                    jsonBuilder = API.getAllStocks();
                    break;
                }
                case "company": {
                    jsonBuilder = API.getCompanyDetails(t, this.conn);
                    break;
                }
                case "ipo": {
                    jsonBuilder = API.createIPO(t, this.conn);
                    break;
                }
                case "password": {
                    jsonBuilder = API.updatePassword(t, this.conn);
                    break;
                }

                default: {
                    jsonBuilder = null;
                    break;
                }

            }

            if (jsonBuilder == null) {
                return;
            }

            // Convert to JSON string
            String json = jsonBuilder.toString();

            // Logging
            if (!t.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                System.out.println("[RESPONSE] " + json);
            }

            // Finish Response
            t.sendResponseHeaders((int)jsonBuilder.get("code"), json.length());
            OutputStream os = t.getResponseBody();
            os.write(json.getBytes());
            os.close();
        }
    }

}