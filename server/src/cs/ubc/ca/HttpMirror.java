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
import org.json.simple.parser.JSONParser;

public class HttpMirror {

    public void run() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(9000), 0);

        server.createContext("/login", new Handler("login"));
        server.createContext("/create", new Handler("create"));
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
            responseHeaders.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
            responseHeaders.add("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");

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

                default: {
                    jsonBuilder = null;
                    break;
                }

            }

            if (jsonBuilder == null) {
                return;
            }

            System.out.println("json is " + jsonBuilder.get("body"));

            // Convert to JSON string
            String json = jsonBuilder.toString();

            // Finish Response
            t.sendResponseHeaders((int)jsonBuilder.get("code"), json.length());
            OutputStream os = t.getResponseBody();
            os.write(json.getBytes());
            os.close();
        }
    }

}