package expensetracker;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * REST Controller providing the API endpoints.
 */
@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*") // Crucial for allowing the HTML frontend to communicate
public class ExpenseController {
    private List<Expense> expenses = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public ExpenseController() {
        // Mock data to verify connection on first load
        expenses.add(new Expense(counter.incrementAndGet(), "Initial Balance", 1000.0));
        expenses.add(new Expense(counter.incrementAndGet(), "Sample Expense", -50.0));
    }

    @GetMapping
    public List<Expense> getExpenses() {
        return expenses;
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        expense.setId(counter.incrementAndGet());
        expenses.add(expense);
        return expense;
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenses = expenses.stream()
                .filter(e -> !e.getId().equals(id))
                .collect(Collectors.toList());
    }
}
