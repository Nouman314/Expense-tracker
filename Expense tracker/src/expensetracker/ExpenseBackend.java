package expensetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for the Expense Tracker Backend.
 * To run this without terminal errors:
 * 1. Ensure pom.xml is in the root folder.
 * 2. Click the 'Run' or 'Debug' text that appears above the main method in VS
 * Code.
 */
@SpringBootApplication
public class ExpenseBackend {
    public static void main(String[] args) {
        SpringApplication.run(ExpenseBackend.class, args);
    }
}