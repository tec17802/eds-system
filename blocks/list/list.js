const itemsPerPage = 10;
let currentPage = 1;
const tableBody = document.createElement('tbody');

function createTableRow(row, index) {
  const tr = document.createElement('tr');
  const cell1 = document.createElement('td');
  cell1.textContent = index;
  tr.appendChild(cell1);

  Object.values(row).forEach((item) => {
    const cell = document.createElement('td');
    cell.textContent = item;
    tr.appendChild(cell);
  });

  tableBody.appendChild(tr);
}

function createTableRows(data) {
  tableBody.innerHTML = '';
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const rowsToShow = data.slice(startIndex, endIndex);
  rowsToShow.forEach((row, i) => {
    createTableRow(row, (i + 1));
  });
}

function createTableHeader(table, titles) {
  const header = table.createTHead();
  const row = header.insertRow();

  const headerTitles = ['S.No'].concat(titles);

  headerTitles.forEach((title) => {
    const cell = document.createElement('th');
    cell.textContent = title;
    row.appendChild(cell);
  });
}

function createTable(res) {
  const table = document.createElement('table');
  createTableHeader(table, res.columns);
  createTableRows(res.data);

  table.appendChild(tableBody);

  return table;
}

function updatePaginationControls(res) {
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination';
  const numberOfPages = Math.ceil(res.total / itemsPerPage);

  /* eslint-disable no-loop-func */
  for (let i = 1; i <= numberOfPages; i += 1) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      createTableRows(res.data);
    });
    paginationContainer.appendChild(pageButton);
  }

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      createTableRows(res.data);
    }
  });
  paginationContainer.insertBefore(prevButton, paginationContainer.firstChild);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => {
    if (currentPage < numberOfPages) {
      currentPage += 1;
      createTableRows(res.data);
    }
  });
  paginationContainer.appendChild(nextButton);

  return paginationContainer;
}

async function fetchdata(jsonURL) {
  const pathname = new URL(jsonURL);
  const res = await fetch(pathname);
  const json = await res.json();

  return json;
}

export default async function decorate(block) {
  const list = block.querySelector('a[href$=".json"]');
  const parentDiv = document.createElement('div');

  if (list) {
    const res = await fetchdata(list.href);
    parentDiv.append(createTable(res));
    parentDiv.append(updatePaginationControls(res));
    list.replaceWith(parentDiv);
  }
}
