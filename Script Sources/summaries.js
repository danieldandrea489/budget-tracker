
document.addEventListener('DOMContentLoaded', () => {
    const perPage = 15;
    let page = 0;

    const tbody = document.getElementById('summary-body');
    const pageInfo = document.getElementById('page-info');

    function renderTransactionsPage() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        const start = page * perPage;
        const end = start + perPage;
        const pageItems = transactions.slice().reverse().slice(start, end);

        tbody.innerHTML = '';
        pageItems.forEach(transaction => {
            tbody.innerHTML += `
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

        pageInfo.textContent = page + 1;
    }

    document.getElementById('first').onclick = () => { page = 0; renderTransactionsPage(); }
    document.getElementById('prev').onclick  = () => { if(page>0) page--; renderTransactionsPage(); }
    document.getElementById('next').onclick  = () => { 
        if(page < Math.ceil(JSON.parse(localStorage.getItem('transactions') || []).length / perPage) - 1) page++; 
        renderTransactionsPage(); 
    }
    document.getElementById('last').onclick  = () => { 
        page = Math.ceil(JSON.parse(localStorage.getItem('transactions') || []).length / perPage) - 1; 
        renderTransactionsPage(); 
    }

    renderTransactionsPage();
});


