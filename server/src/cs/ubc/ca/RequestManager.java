package cs.ubc.ca;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class RequestManager {

    private ServerSocket serverSocket;
    Socket clientsSocket;
    PrintWriter out;
    BufferedReader in;

    public RequestManager(int portNumber) {
        try {
            serverSocket = new ServerSocket(portNumber);
            clientsSocket = serverSocket.accept();
            System.out.println("Connection created on port " + portNumber + ". Servicing client.");
            out = new PrintWriter(clientsSocket.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(clientsSocket.getInputStream()));
        }
        catch (IOException e) {
            System.out.println("Exception caught when trying to listen on port " + portNumber + ".");
        }

    }

    // Test reading, use void for now
    public void getClientCommand() throws IOException {
        String line;
        while(in.ready()) {
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }
        }
    }
}
