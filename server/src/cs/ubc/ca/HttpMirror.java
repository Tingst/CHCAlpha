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

    public void Test() {

    }

    public void run() throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(9000), 0);

        server.createContext("/test", new MyHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
    }

    static class MyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            // 1. Process Request
            Headers requestHeaders = t.getRequestHeaders();
            Headers responseHeaders = t.getResponseHeaders();
            for (Map.Entry<String, List<String>> header : requestHeaders.entrySet()) {
                responseHeaders.put(header.getKey(), header.getValue());
            }

            // 2. Extract JSON from Request Body
            // NOTE: You MUST include this outer if-statement! Otherwise,
            // the server will fail the request!
            if (t.getRequestMethod().equalsIgnoreCase("POST")) {
                String body = process(t);
                JSONObject bodyJSON;
                try {
                    JSONParser parser = new JSONParser();
                    bodyJSON = (JSONObject) parser.parse(body);
                }
                catch(Exception e) {
                    System.out.println(e.getMessage());
                    return;
                }
                System.out.println("HERE IS THE JSON");
                System.out.println(bodyJSON.get("password"));
            }

            // 3. Assemble JSON Response
            JSONObject jsonBuilder = new JSONObject();
            jsonBuilder.put("PIGGY", "BEAR");
            jsonBuilder.put("HALLOOOO", "PEOPLE");
            jsonBuilder.put("MANY WOWS", "WOWOWOW");
            String json = jsonBuilder.toString();

            // 4. Take care of CORS issues
            responseHeaders.add("Access-Control-Allow-Origin", "*");
            responseHeaders.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
            responseHeaders.add("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");

            // 5. Finish Response
            t.sendResponseHeaders(200, json.length());
            OutputStream os = t.getResponseBody();
            os.write(json.getBytes());
            os.close();
        }

        private String process(HttpExchange t) {
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
    }

}