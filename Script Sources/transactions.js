import { db } from './firebase-config.js';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';
Chart.register(...registerables);
const monthMap = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
};


const MonthButton = document.getElementById('month');
const YearButton = document.getElementById('year');

const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

let incomeExpenseChart;
let expenseCategoryChart;

MonthButton.addEventListener('change', updateChartData);
YearButton.addEventListener('change', updateChartData);

function updateChartData() {
    const selectedMonth = MonthButton.value; // '01', '02', etc.
    const selectedYear = YearButton.value;   // '2026', '2025', etc.
    // Only continue if both are selected
    if (!selectedMonth || !selectedYear) {
        // Destroy any existing charts if they exist
        if (incomeExpenseChart) incomeExpenseChart.destroy();
        if (expenseCategoryChart) expenseCategoryChart.destroy();
        return;
    }

    const filteredTransactions = transactions.filter(transaction => {
        if (!transaction.date) return false;

        // Split date into month/day/year
        const [month, day, year] = transaction.date.split("/");

        // Pad month with zero for comparison ('1' -> '01')
        const paddedMonth = month.padStart(2, "0");

        return paddedMonth === selectedMonth && year === selectedYear;
    });

  
    renderIncomeExpenseChart(filteredTransactions);
    renderExpenseCategoryPieChart(filteredTransactions);
}


function CalculateNetIncome(data1, data2) {
 let netIncome = document.querySelector('.Net-income');
 let netIncomeValue = (data1 - data2).toFixed(2);
 if(netIncomeValue < 0){
 netIncome.innerHTML = '<p class ="expense"> $' + netIncomeValue + '</p>';
 }
    else{
    netIncome.innerHTML = '<p class ="income"> $' + netIncomeValue + '</p>';
}
}


function CalculateIncomeExpense(data1, data2) {
let NumberStuff = document.querySelector('.Numbers');
const Income = data1.toFixed(2);
const Expense = data2.toFixed(2);
NumberStuff.innerHTML = `
  <h2 class = "income">$${Income}</h2>
  <h2 class = "expense">$${Expense}</h2>
`;
}

function GenerateTable(categories,data)
{
      let incomeData = 0;
        data.forEach(transaction => {
        if (transaction.type === 'Income') {
            incomeData += Number(transaction.amount);
        }
});
let tableBody = document.getElementById('data-body');
 tableBody.innerHTML = '';
            tableBody.innerHTML = `
                <tr>
                <td class="td-element"> Entertainment</td>
                <td class="td-element expense"> ${Number(categories.Entertainment.toFixed(2))} </td>
                </tr>
                 <tr>
                <td class="td-element"> Bills</td>
                <td class="td-element expense"> ${Number(categories.Bills.toFixed(2))} </td>
                </tr>
                 <tr>
                <td class="td-element"> MISC</td>
                <td class="td-element expense"> ${Number(categories.Misc.toFixed(2))} </td>
                </tr>
                 <tr>
                <td class="td-element"> Food </td>
                <td class="td-element expense"> ${Number(categories.Food.toFixed(2))} </td>
                </tr>
                 <tr>
                <td class="td-element "> Income </td>
                <td class="td-element income"> ${Number(incomeData.toFixed(2))} </td>
             
                </tr>
            `;
        };
    








function renderIncomeExpenseChart(data) {
    let incomeData = 0;
    let expenseData = 0;

    data.forEach(transaction => {
        if (transaction.type === 'Income') {
            incomeData += Number(transaction.amount);
        } else if (transaction.type === 'Expense') {
            expenseData +=  Number(transaction.amount);
        }
    });
    console.log(incomeData, expenseData);
    CalculateNetIncome(incomeData,expenseData);
    CalculateIncomeExpense(incomeData,expenseData);
    const ctx = document.getElementById('incomeExpenseBarChart').getContext('2d');

 
    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }

   
    incomeExpenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Amount ($)',
                data: [incomeData, expenseData],
                backgroundColor: ['#4caf50', '#f44336'] 
            }]
        },
        options: {
            responsive: true,
              maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Income vs Expense'
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}


function renderExpenseCategoryPieChart(data) {
    let categories = {
        Entertainment: 0,
        Food: 0,
        Bills: 0,
        Misc: 0
    };

    data.forEach(transaction => {
    
        if (transaction.type !== 'Expense') return;

        switch (transaction.category) {
            case 'entertainment':
                categories.Entertainment += transaction.amount;
                break;
            case 'groceries':
                categories.Food += transaction.amount;
                break;
            case 'utilities':
                categories.Bills += transaction.amount;
                break;
            case 'others':
                categories.Misc += transaction.amount;
                break;
        }
    });
  GenerateTable(categories, data)
    const ctx = document.getElementById('expensePieChart').getContext('2d');

    if (expenseCategoryChart) {
        expenseCategoryChart.destroy();
    }

    expenseCategoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Entertainment', 'Food', 'Bills', 'Misc'],
            datasets: [{
                data: [
                    categories.Entertainment,
                    categories.Food,
                    categories.Bills,
                    categories.Misc
                ],
                backgroundColor: ['#ff9800', '#2196f3', '#9c27b0', '#607d8b']
            }]
        },
        options: {
            responsive: true,
              maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Expense by Category' }
            }
        }
    });
}

if (MonthButton.value && YearButton.value) {
    updateChartData();
}
