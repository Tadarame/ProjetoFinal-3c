
import { apiFetch, getToken, logout } from './api.js';

if (!getToken()) {
    window.location.href = "index.html";
}

const postsContainer = document.getElementById('postsContainer');
const createPostForm = document.getElementById('createPostForm');

//listar

async function loadPosts(){
    const response = await apiFetch('/posts');
    const data = await response.json();

    postsContainer.innerHTML = '';

    data.data.forEach(post => {
        const postE1 = document.createElement('div');
        postE1.className = 'post-card';
        postE1.innerHTML = `
            <div class="post-header">
                <strong>${post.user.username}</strong>
            </div>
            <img src="${post.image_url}" class="post-image" alt="Post">
            <div class="post-actions">
                <button class="like-btn" data-id="${post.id}">❤️ ${post.likes_count}</button>
            </div>
            <p class="post-caption"><strong>${post.user.username}</strong> ${post.caption ?? ''}</p>
            <div class="comments" id="comments-${post.id}">
                ${(post.comments || []).map(c => `<p><strong>${c.user.username}</strong> ${c.body}</p>`).join('')}
            </div>
            <form class="comment-form" data-id="${post.id}">
                <input type="text" placeholder="Adicione um comentário..." required>
                <button type="submit">Enviar</button>
            </form>
        `;

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

document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});
loadPosts();