const form = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const entriesList = document.getElementById('entries-list');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const resetBtn = document.getElementById('reset-btn');
const filters = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem('entries')) || [];
let currentFilter = 'all';

function updateSummary() {
  const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const expense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  balanceEl.textContent = (income - expense).toFixed(2);
  totalIncomeEl.textContent = income.toFixed(2);
  totalExpenseEl.textContent = expense.toFixed(2);
}

function renderEntries() {
  entriesList.innerHTML = '';

  const filtered = entries.filter(entry => {
    if (currentFilter === 'all') return true;
    return entry.type === currentFilter;
  });

  filtered.forEach((entry, index) => {
    const li = document.createElement('li');
    li.classList.add('entry', entry.type);
    li.innerHTML = `
      <span>${entry.description} - ₹${entry.amount.toFixed(2)}</span>
      <div class="actions">
        <button class="edit" onclick="editEntry(${index})">✏️</button>
        <button class="delete" onclick="deleteEntry(${index})">🗑️</button>
      </div>
    `;
    entriesList.appendChild(li);
  });

  updateSummary();
  localStorage.setItem('entries', JSON.stringify(entries));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (description && !isNaN(amount) && amount > 0) {
    entries.push({ description, amount, type });
    renderEntries();
    form.reset();
  }
});

resetBtn.addEventListener('click', () => {
  form.reset();
});

function deleteEntry(index) {
  entries.splice(index, 1);
  renderEntries();
}

function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  deleteEntry(index);
}

filters.forEach(filter => {
  filter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderEntries();
  });
});

// Initial render
renderEntries();
window.deleteEntry = deleteEntry;
window.editEntry = editEntry;

