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

    form.addEventListener('submit', function(e) {
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
        form.querySelector('button').textContent = 'Add Entry';
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
          <span>${entry.description}: ₹${entry.amount}</span>
          <div class="actions">
            <button class="edit" onclick="editEntry(${entry.id})">✏️</button>
            <button class="delete" onclick="deleteEntry(${entry.id})">🗑️</button>
          </div>
        `;
        entriesList.appendChild(li);

        if (entry.type === 'income') income += entry.amount;
        else expense += entry.amount;
      });

      totalIncomeEl.textContent = income;
      totalExpenseEl.textContent = expense;
      balanceEl.textContent = income - expense;
    }

    window.editEntry = function(id) {
      const entry = entries.find(e => e.id === id);
      descriptionInput.value = entry.description;
      amountInput.value = entry.amount;
      typeInput.value = entry.type;
      editId = id;
      form.querySelector('button').textContent = 'Update Entry';
    }

    window.deleteEntry = function(id) {
      entries = entries.filter(e => e.id !== id);
      renderEntries();
    }