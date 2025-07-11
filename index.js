const form = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const entriesList = document.getElementById('entries-list');

let entries = [];
let editId = null;


function formatCurrency(num) {
  return num.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });
}


form.addEventListener('submit', function (e) {
  e.preventDefault();

  const desc = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!desc || isNaN(amount) || amount <= 0) return;

  const entry = {
    id: editId !== null ? editId : Date.now(),
    description: desc,
    amount,
    type
  };

  if (editId !== null) {
    entries = entries.map(item => item.id === editId ? entry : item);
    editId = null;
    form.querySelector('button[type="submit"]').textContent = 'Add Entry';
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) cancelBtn.remove();
  } else {
    entries.push(entry);
  }

  form.reset();
  renderEntries();
});


function renderEntries() {
  entriesList.innerHTML = '';
  let income = 0, expense = 0;

  entries.forEach(entry => {
    const li = document.createElement('li');
    li.className = `entry ${entry.type}`;
    li.innerHTML = `
      <span>${entry.description}: ${formatCurrency(entry.amount)}</span>
      <div class="actions">
        <button class="edit" onclick="editEntry(${entry.id})">✏️</button>
        <button class="delete" onclick="deleteEntry(${entry.id})">🗑️</button>
      </div>
    `;
    entriesList.appendChild(li);

    if (entry.type === 'income') income += entry.amount;
    else expense += entry.amount;
  });

  totalIncomeEl.textContent = formatCurrency(income);
  totalExpenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(income - expense);
}


window.editEntry = function (id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;

  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editId = id;

  form.querySelector('button[type="submit"]').textContent = 'Update Entry';

  
  if (!document.getElementById('cancel-edit')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancel-edit';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel Edit';
    cancelBtn.style.marginTop = '10px';
    cancelBtn.onclick = () => {
      form.reset();
      editId = null;
      cancelBtn.remove();
      form.querySelector('button[type="submit"]').textContent = 'Add Entry';
    };
    form.appendChild(cancelBtn);
  }
}


window.deleteEntry = function (id) {
  entries = entries.filter(e => e.id !== id);
  renderEntries();
}
