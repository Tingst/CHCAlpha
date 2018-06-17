package cs.ubc.ca;

import java.util.*;

public class Records {
    private Map<String, LinkedList<String>> records;
    private boolean isEmpty;

    public Records() {
        records = new HashMap<>();
        isEmpty = true;
    }


    public void addRecord(String fieldName, String data) {
        if(records.containsKey(fieldName)) {
            Queue<String> record = records.get(fieldName);
            record.add(data);
            if(isEmpty) isEmpty = false;
        }
        else {
            LinkedList<String> newRecord = new LinkedList<>();
            newRecord.add(data);
            records.put(fieldName, newRecord);
            if(isEmpty) isEmpty = false;
        }
    }

    public Map<String, LinkedList<String>> getRecords() {
        return Collections.unmodifiableMap(records);
    }

    public Map<String, String> getNextRecord() {
        Map<String, String> record = new HashMap<>();

        if(!isEmpty) {
            for(Map.Entry<String, LinkedList<String>> entry : records.entrySet()) {
                record.put(entry.getKey(), entry.getValue().poll());
            }
        }


        //Check if the records is empty, if so, change isEmpty to true
        for(Map.Entry<String, LinkedList<String>> entry : records.entrySet()) {
            if(entry.getValue().isEmpty()) {
                isEmpty = true;
                break;
            }
        }

        return record;
    }

    public boolean isEmpty() {
        return isEmpty;
    }
}
