let currentPage = 1;
const perPage = 1000;

async function fetchData(page) {
    const response = await fetch(`/data?page=${page}&per_page=${perPage}`);
    const data = await response.json();
    displayData(data);
}

function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchData(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchData(currentPage);
});

// Initial data fetch
fetchData(currentPage);