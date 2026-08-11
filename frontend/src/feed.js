
import { apiFetch, getToken, logout } from './api.js';

if (!getToken()) {
    window.location.href = "index.html";
}

const postsContainer = document.getElementById('postsContainer');
const createPostForm = document.getElementById('createPostForm');

//listar

function formatDate(dateString) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString));
}

async function loadPosts(){
    const response = await apiFetch('/posts');
    const data = await response.json();

    postsContainer.innerHTML = '';

    data.data.forEach(post => {
        console.log(post.iamge_url);
        const postE1 = document.createElement('div');
        postE1.className = 'post-card';
        
        postE1.innerHTML = `
    <div class="post-header">
        <a href="/profile.html?id=${post.user.id}"><strong>${post.user.username}</strong></a>
        <span class="post-date">${formatDate(post.created_at)}</span>
    </div>

    <img src="${post.image_url}" class="post-image" alt="Post" style="cursor:pointer;">

    <div class="post-actions">
        <button class="like-btn" data-id="${post.id}">❤️ ${post.likes_count}</button>
        <a href="/post.html?id=${post.id}" class="comment-link">💬 Ver comentários</a>
    </div>

    <p class="post-caption"><strong>${post.user.username}</strong> ${post.caption ?? ''}</p>

    <div class="comments" id="comments-${post.id}">
        ${(post.comments || []).map(c => `
            <p>
                <strong>${c.user.username}</strong> ${c.body}
                <span class="comment-date">${formatDate(c.created_at)}</span>
            </p>
        `).join('')}
    </div>

    <form class="comment-form" data-id="${post.id}">
        <input type="text" placeholder="Adicione um comentário..." required>
        <button type="submit">Enviar</button>
    </form>
`;

        postE1.querySelector('.post-image').addEventListener('click', () => {
            window.location.href = `/post.html?id=${post.id}`;
        });

        postsContainer.appendChild(postE1);
        
    });

    attachEvent();
}

//criar

    if (createPostForm) {
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const caption = document.getElementById('caption').value;
            const imageFile = document.getElementById('image').files[0];

            const formData = new FormData();
            formData.append('caption', caption);
            formData.append('image', imageFile);

            const response = await apiFetch('/posts', {
                method :'POST',
                body: formData,
            });

            if (response.ok){
                createPostForm.reset();
                loadPosts();
            } else {
                const data = await response.json();
                alert(data.message || 'Erro ao criar o Post');
            }
        });
    }

//like e comentarios

    function attachEvent() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const postId = btn.dataset.id;
                const response =  await apiFetch(`/posts/${postId}/like`, { method: 'POST' });
                const data = await response.json();
                btn.textContent = `❤️ ${data.likes_count}`;
            });
        });

        document.querySelectorAll('.comment-form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const postId = form.dataset.id;
                const input = form.querySelector('input');
                const body = input.value;

                const response = await apiFetch(`/posts/${postId}/comments`, {
                    method : 'POST',
                    headers : {'Content-Type': 'application/json'},
                    body: JSON.stringify({body}),
                });

                if (response.ok) {
                    const comment = await response.json();
                    const commentsDiv = document.getElementById(`comments-${postId}`);
                    commentsDiv.innerHTML += `<p><strong>${comment.user.username}</strong> ${comment.body}</p>`;
                    input.value = '';
                }
            });
        });
    }

    //sujestieos
    async function loadSuggestions() {
        const container = document.getElementById('suggestionsContainer');
        if (!container) return;

        const response = await apiFetch('/search');
        const result = await response.json();

        const users = result.data || [];

        container.innerHTML = users.slice(0, 5).map(user => `
            <div class="suggestion-row">
                <img src="${user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}`}" alt="Avatar">
                <div>
                    <a href="/profile.html?id=${user.id}"><strong>${user.username}</strong></a>
                    <span>${user.name}</span>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        logout();
    });

    loadPosts();
    loadSuggestions();