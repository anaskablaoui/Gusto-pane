const tableBody = document.querySelector('#stock-table tbody');

let stock = [];

function clearTable() {
  if (tableBody) tableBody.innerHTML = '';
}

function renderStocks(list) {
  if (!tableBody) return;
  clearTable();
  list.forEach((element, idx) => {
    const tr = document.createElement('tr');

    const noTd = document.createElement('td');
    noTd.textContent = element.no;
    tr.appendChild(noTd);

    const prodTd = document.createElement('td');
    prodTd.textContent = element.produit;
    tr.appendChild(prodTd);

    const qteTd = document.createElement('td');
    qteTd.textContent = element.qte_stock;
    tr.appendChild(qteTd);

    const actionTd = document.createElement('td');
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-stock');
    editBtn.textContent = 'Modifier';
    editBtn.dataset.index = idx;
    actionTd.appendChild(editBtn);
    tr.appendChild(actionTd);

    tableBody.appendChild(tr);
  });
  attachEditHandlers();
}

function attachEditHandlers() {
  const edits = document.querySelectorAll('.edit-stock');
  edits.forEach(btn => btn.addEventListener('click', onEditClick));
}

function onEditClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  const item = stock[idx];
  if (!item) return;
  const sIndex = document.getElementById('sIndex');
  const sNo = document.getElementById('sNo');
  const sProdNo = document.getElementById('sProdNo');
  const sQte = document.getElementById('sQte');
  const sSubmit = document.getElementById('sSubmit');

  if (sIndex) sIndex.value = idx;
  if (sNo) sNo.value = item.no;
  if (sProdNo) sProdNo.value = item.produit;
  if (sQte) sQte.value = item.qte_stock;
  if (sSubmit) sSubmit.textContent = 'Enregistrer';
}

// form handling
const stock_form = document.getElementById('stock-form');
if (stock_form) {
  stock_form.addEventListener('submit', function (e) {
    e.preventDefault();
    const sIndex = document.getElementById('sIndex');
    const sNo = document.getElementById('sNo');
    const sProdNo = document.getElementById('sProdNo');
    const sQte = document.getElementById('sQte');
    const sSubmit = document.getElementById('sSubmit');

    const newItem = {
      no: sNo ? Number(sNo.value) : null,
      produit: sProdNo ? sProdNo.value : '',
      qte_stock: sQte ? Number(sQte.value) : 0
    };

    if (sIndex && sIndex.value !== '') {
      // modify existing
      const i = Number(sIndex.value);
      if (stock[i]) {
        stock[i] = newItem;
      }
    } else {
      // add new
      stock.push(newItem);
    }

    stock_form.reset();
    if (sIndex) sIndex.value = '';
    if (sSubmit) sSubmit.textContent = 'Ajouter';
    renderStocks(stock);
  });
}

// load initial data
fetch('../data/stock.json')
  .then(response => response.json())
  .then(data => {
    stock = data.stock || [];
    renderStocks(stock);
  })
  .catch(error => console.log(`erreur json: ${error}`));