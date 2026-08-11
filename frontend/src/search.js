import { apiFetch, getToken, logout } from './api.js';

if (!getToken()) {
    window.location.href = '/index.html';
}

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('searchResults');

let debounceTimer = null;

async function search(query = '') {
    const response = await apiFetch(`/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
        resultsContainer.innerHTML = '<p>Erro ao buscar usuários.</p>';
        return;
    }

    const data = await response.json();
    renderResults(data.data || []);
}

function renderResults(users) {
    resultsContainer.innerHTML = '';

    if (users.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-msg">Nenhum usuário encontrado.</p>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('div');
        row.className = 'search-result-row';

        row.innerHTML = `
            <img src="${user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}" class="search-avatar" alt="${user.username}">
            <div class="search-user-info">
                <strong>@${user.username}</strong>
                <span>${user.name}</span>
            </div>
        `;

        row.addEventListener('click', () => {
            window.location.href = `/profile.html?id=${user.id}`;
        });

        resultsContainer.appendChild(row);
    });
}

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        search(searchInput.value.trim());
    }, 300);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});

// carrega a listagem inicial (sem termo) ao abrir a tela
search();
