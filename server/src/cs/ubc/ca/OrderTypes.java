package cs.ubc.ca;

public enum OrderTypes {
    BUY("0"), SELL("1");

    private final String name;

    private OrderTypes(String s) {
        name = s;
    }

    public String toString() {return name;}
}
