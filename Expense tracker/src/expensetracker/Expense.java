package expensetracker;

/**
 * Data Model for an Expense.
 */
public class Expense {
    private Long id;
    private String text;
    private Double amount;

    public Expense() {
    }

    public Expense(Long id, String text, Double amount) {
        this.id = id;
        this.text = text;
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
