// DOM Elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const statusEl = document.getElementById('connection-status');
const toastEl = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

// Config
// Note: This URL expects a standard Spring Boot app running locally
const API_URL = 'http://localhost:8080/api/expenses';

let transactions = [];
let isBackendAvailable = false;

// --- Toast Notification ---
function showToast(message, type = 'info') {
    toastMsg.innerText = message;
    toastEl.classList.remove('translate-y-20', 'opacity-0');

    // Optional color logic based on type
    if (type === 'error') toastEl.querySelector('i').className = 'fas fa-exclamation-circle text-red-400';
    else toastEl.querySelector('i').className = 'fas fa-info-circle text-blue-400';

    setTimeout(() => {
        toastEl.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// --- Data Fetching Logic (Hybrid: API + LocalStorage) ---

async function init() {
    try {
        // Try to fetch from Java Backend
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Backend error');
        const data = await res.json();

        transactions = data;
        isBackendAvailable = true;
        updateStatus(true);
    } catch (err) {
        // Fallback to Local Storage
        console.log('Backend not reachable, switching to local mode.');
        const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
        transactions = localStorageTransactions !== null ? localStorageTransactions : [];
        isBackendAvailable = false;
        updateStatus(false);
    }
    updateDOM();
}

function updateStatus(online) {
    statusEl.classList.remove('hidden');
    const dot = statusEl.querySelector('div');
    const txt = statusEl.querySelector('span');

    if (online) {
        dot.classList.remove('bg-orange-400');
        dot.classList.add('bg-green-400');
        txt.innerText = "Java Backend";
    } else {
        dot.classList.remove('bg-green-400');
        dot.classList.add('bg-orange-400');
        txt.innerText = "Local Mode";
        showToast('Backend not detected. Using local storage.', 'error');
    }
}

// --- Core Functions ---

async function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        showToast('Please add a text and amount', 'error');
        return;
    }

    const transaction = {
        id: isBackendAvailable ? null : generateID(), // Backend usually generates ID
        text: text.value,
        amount: +amount.value
    };

    if (isBackendAvailable) {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            });
            const data = await res.json();
            transactions.push(data);
        } catch (err) {
            showToast('Error saving to backend', 'error');
        }
    } else {
        transactions.push(transaction);
        updateLocalStorage();
    }

    addTransactionDOM(isBackendAvailable ? transactions[transactions.length - 1] : transaction);
    updateValues();

    text.value = '';
    amount.value = '';
}

// Generate random ID for local mode
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    // Remove "No transactions" message if exists
    const emptyMsg = document.getElementById('empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Tailwind classes for list item
    item.className = `bg-white shadow-sm rounded p-3 border-r-4 flex justify-between items-center group relative hover:bg-gray-50 transition-colors ${transaction.amount < 0 ? 'border-red-500' : 'border-green-500'
        }`;

    item.innerHTML = `
        <span class="font-medium text-gray-700">${transaction.text}</span>
        <span class="font-semibold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}">
            ${sign}${Math.abs(transaction.amount)}
        </span>
        <button class="delete-btn opacity-0 group-hover:opacity-100 absolute right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md transition-all hover:bg-red-600 transform hover:scale-110" 
            onclick="removeTransaction(${transaction.id})">
            <i class="fas fa-times"></i>
        </button>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}

async function removeTransaction(id) {
    if (isBackendAvailable) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            transactions = transactions.filter(transaction => transaction.id !== id);
        } catch (err) {
            showToast('Error deleting from backend', 'error');
        }
    } else {
        transactions = transactions.filter(transaction => transaction.id !== id);
        updateLocalStorage();
    }
    updateDOM();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateDOM() {
    list.innerHTML = '';

    if (transactions.length === 0) {
        list.innerHTML = '<li class="text-center text-gray-400 text-sm py-4 italic" id="empty-msg">No transactions yet</li>';
    } else {
        transactions.forEach(addTransactionDOM);
    }
    updateValues();
}

form.addEventListener('submit', addTransaction);

// Start App
init();