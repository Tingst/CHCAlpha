package cs.ubc.ca;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.simple.JSONObject;

public class HttpMirror {

    public void run() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(9000), 0);

        server.createContext("/login", new Handler("login"));
        server.createContext("/create", new Handler("create"));
        server.createContext("/createportfolio", new Handler("createportfolio"));
        server.createContext("/deleteportfolio", new Handler("deleteportfolio"));
        server.createContext("/orders", new Handler("orders"));
        server.createContext("/placeorder", new Handler("placeorder"));
        server.createContext("/cancelorder", new Handler("cancelorder"));
        server.createContext("/trends", new Handler("trends"));
        server.createContext("/stocks", new Handler("stocks"));
        server.createContext("/company", new Handler("company"));
        server.createContext("/ipo", new Handler("ipo"));
        server.createContext("/password", new Handler("password"));
        server.setExecutor(null); // creates a default executor
        server.start();
    }

    static class Handler implements HttpHandler {
        private String endpoint;

        public Handler(String endpoint) {
            this.endpoint = endpoint;
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
                    jsonBuilder = API.login(t);
                    break;
                }
                case "create": {
                    jsonBuilder = API.create(t);
                    break;
                }
                case "createportfolio": {
                    jsonBuilder = API.createPortfolio(t);
                    break;
                }
                case "deleteportfolio": {
                    jsonBuilder = API.deletePortfolio(t);
                    break;
                }
                case "orders": {
                    jsonBuilder = API.getOrders(t);
                    break;
                }
                case "placeorder": {
                    jsonBuilder = API.placeOrder(t);
                    break;
                }
                case "cancelorder": {
                    jsonBuilder = API.cancelOrder(t);
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
                    jsonBuilder = API.getCompanyDetails(t);
                    break;
                }
                case "ipo": {
                    jsonBuilder = API.createIPO(t);
                    break;
                }
                case "password": {
                    jsonBuilder = API.updatePassword(t);
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