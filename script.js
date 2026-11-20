// Get HTML Elements

let balance = document.getElementById("balance");
let income = document.getElementById("income");
let expense = document.getElementById("expense");

let form = document.getElementById("transaction-form");
let description = document.getElementById("description");
let amount = document.getElementById("amount");
let type = document.getElementById("type");

let transactionList = document.getElementById("transaction-list");

// Get saved transactions from Local Storage

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

// Add Transaction Function

function addTransaction(event) {

    event.preventDefault();

    let desc = description.value.trim();
    let money = Number(amount.value);
    let transactionType = type.value;

    // Empty form validation

    if (desc === "" || amount.value === "" ||
        !Number.isFinite(money) || money <= 0) {

        alert("Please enter valid description and amount!");
        return;
    }

    // Create Transaction Object

    let transaction = {
        id: Date.now(),
        description: desc,
        amount: money,
        type: transactionType
    };

    // Add object into array

    transactions.push(transaction);

    // Save data

    saveData();

    // Update website

    displayTransactions();

    // Reset form

    form.reset();
}

// Display Transactions Function

function displayTransactions() {

    transactionList.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        let li = document.createElement("li");

        let info = document.createElement("div");
        info.className = "transaction-info";

        let title = document.createElement("strong");
        title.innerText = transaction.description;

        let amountText = document.createElement("span");

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

            amountText.innerText =
                " +₹" + transaction.amount;

            amountText.className = "income-text";

        } else {

            totalExpense += transaction.amount;

            amountText.innerText =
                " -₹" + transaction.amount;

            amountText.className = "expense-text";
        }

        let deleteButton = document.createElement("button");

        deleteButton.innerText = "Delete";
        deleteButton.className = "delete-btn";

        // Delete Transaction

        deleteButton.addEventListener("click", function() {

            transactions = transactions.filter(function(item) {
                return item.id !== transaction.id;
            });

            saveData();
            displayTransactions();

        });

        info.appendChild(title);
        info.appendChild(document.createElement("br"));
        info.appendChild(amountText);

        li.appendChild(info);
        li.appendChild(deleteButton);

        transactionList.appendChild(li);

    });

    // Calculate Balance

    let totalBalance = totalIncome - totalExpense;

    balance.innerText = "₹" + totalBalance.toFixed(2);
    income.innerText = "₹" + totalIncome.toFixed(2);
    expense.innerText = "₹" + totalExpense.toFixed(2);

}

// Save Data in Local Storage

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// Submit Event

form.addEventListener("submit", addTransaction);

// Show old transactions when page loads

displayTransactions();