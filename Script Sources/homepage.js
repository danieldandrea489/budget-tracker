
document.addEventListener('DOMContentLoaded', () => {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let TotalBalance = transactions.length
        ? Number(transactions[transactions.length - 1].total)
        : 0;

    const submitBtn = document.getElementById('submit-button');

    function addTransaction() {
        submitBtn.addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.getElementById('action-select').value;
            const category = document.getElementById('category').value;

            if (isNaN(amount) || !type || !category) {
                alert("Please enter a valid amount, select an action, and choose a category.");
                return;
            }

            const today = new Date();
            const dateOnly = today.toLocaleDateString('en-US');

            if (type === 'Expense') {
                TotalBalance -= amount;
            } else {
                TotalBalance += amount;
            }

            const total = Number(TotalBalance.toFixed(2));

            if (type === 'Expense' && TotalBalance < 0) {
                alert("Warning: Your total balance is negative!");
            }

            transactions.push({
                date: dateOnly,
                amount: amount,
                type: type,
                category: category,
                total: total
            });

            localStorage.setItem('transactions', JSON.stringify(transactions));

            renderLast5Transactions();

            document.getElementById('amount').value = '';
            document.getElementById('action-select').value = '';
            document.getElementById('category').value = '';
        });
    }

    addTransaction();

    function renderLast5Transactions() {
        let table = document.getElementById('summary-body');
        table.innerHTML = '';

        const last5Transactions = transactions.slice(-5).reverse();

        last5Transactions.forEach(transaction => {
            table.innerHTML += `
                <tr>
                    <td class="td-element">${transaction.date}</td>
                    <td class="${transaction.type === 'Expense' ? 'expense' : 'income'} td-element">
                        ${transaction.amount.toFixed(2)}
                    </td>
                    <td class="td-element">${transaction.category}</td>
                    <td class="td-element">${transaction.type}</td>
               <td class="total td-element ${transaction.total <0 ? 'expense' : 'income'} ">${transaction.total.toFixed(2)}</td>
                </tr>
            `;
        });

    }

    renderLast5Transactions();
});


