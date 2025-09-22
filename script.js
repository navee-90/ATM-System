// Dummy accounts data
let accounts = [
    { accountNumber: '123456', pin: '1234', balance: 5000, transactions: [] },
    { accountNumber: '987654', pin: '9876', balance: 3000, transactions: [] }
];

let currentAccount = null;

// ---------------- LOGIN FUNCTIONALITY ----------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const accNum = document.getElementById('accountNumber').value;
        const pin = document.getElementById('pin').value;
        const account = accounts.find(a => a.accountNumber === accNum && a.pin === pin);
        if(account){
            currentAccount = account;
            localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
            window.location.href = 'atm.html';
        } else {
            document.getElementById('loginError').innerText = 'Invalid Account Number or PIN';
        }
    });
}

// ---------------- ATM DASHBOARD ----------------
const balanceEl = document.getElementById('balance');
const depositBtn = document.getElementById('depositBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const transactionList = document.getElementById('transactionList');
const logoutBtn = document.getElementById('logoutBtn');
const balanceEnquiryBtn = document.getElementById('balanceEnquiryBtn');
const balanceEnquiryEl = document.getElementById('balanceEnquiry');
const printStatementBtn = document.getElementById('printStatementBtn');
const statementList = document.getElementById('statementList');

// Restore logged in account
if(localStorage.getItem('currentAccount')){
    currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
}

// Helper: Add transaction with timestamp
function addTransaction(type, amount){
    const date = new Date();
    currentAccount.transactions.push({
        type: type,
        amount: amount,
        date: date.toLocaleString()
    });
    localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
}

// Update dashboard (Balance + Transactions + Statement)
function updateDashboard(){
    if(balanceEl) balanceEl.innerText = `₹${currentAccount.balance}`;

    if(transactionList){
        transactionList.innerHTML = '';
        currentAccount.transactions.slice().reverse().forEach(t => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerText = `${t.date} - ${t.type}: ₹${t.amount}`;
            transactionList.appendChild(li);
        });
    }

    if(statementList){
        statementList.innerHTML = '';
        currentAccount.transactions.forEach(t => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerText = `${t.date} - ${t.type}: ₹${t.amount}`;
            statementList.appendChild(li);
        });
    }
}

// ---------------- DEPOSIT ----------------
if(depositBtn){
    depositBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('depositAmount').value);
        if(amount > 0){
            currentAccount.balance += amount;
            addTransaction('Deposit', amount);
            updateDashboard();
            document.getElementById('depositAmount').value = '';
        } else {
            alert('Enter valid amount');
        }
    });
}

// ---------------- WITHDRAW ----------------
if(withdrawBtn){
    withdrawBtn.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        if(amount > 0 && amount <= currentAccount.balance){
            currentAccount.balance -= amount;
            addTransaction('Withdraw', amount);
            updateDashboard();
            document.getElementById('withdrawAmount').value = '';
        } else {
            alert('Insufficient balance or invalid amount');
        }
    });
}

// ---------------- BALANCE ENQUIRY ----------------
if(balanceEnquiryBtn){
    balanceEnquiryBtn.addEventListener('click', () => {
        balanceEnquiryEl.innerText = `₹${currentAccount.balance}`;
        alert(`Your current balance is ₹${currentAccount.balance}`);
    });
}

// ---------------- PRINT STATEMENT ----------------
if(printStatementBtn){
    printStatementBtn.addEventListener('click', () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Account Statement</title></head><body>');
        printWindow.document.write('<h2>Account Statement</h2><hr>');
        printWindow.document.write('<ul>');
        currentAccount.transactions.forEach(t => {
            printWindow.document.write(`<li>${t.date} - ${t.type}: ₹${t.amount}</li>`);
        });
        printWindow.document.write('</ul>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });
}

// ---------------- LOGOUT ----------------
if(logoutBtn){
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentAccount');
        window.location.href = 'index.html';
    });
}

// Initialize dashboard on load
if(balanceEl) updateDashboard();
