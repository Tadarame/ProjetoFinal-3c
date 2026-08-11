import { apiFetch, getToken, logout } from './api.js';

if (!getToken()) {
    window.location.href = '/index.html';
}

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

const container = document.getElementById('postDetailContainer');

let currentUserId = null;

if (!postId) {
    container.innerHTML = '<p>Post não encontrado.</p>';
} else {
    init();
}

async function init() {
    const meResponse = await apiFetch('/me');
    const me = await meResponse.json();
    currentUserId = me.id;

    await loadPost();
}

async function loadPost() {
    const response = await apiFetch(`/posts/${postId}`);

    if (!response.ok) {
        container.innerHTML = '<p>Post não encontrado.</p>';
        return;
    }

    const result = await response.json();
    const post = result.data;

    renderPost(post);

    await loadComments();
}

function renderPost(post) {
    const isOwnPost = Number(post.user.id) === Number(currentUserId);

    container.innerHTML = `
        <div class="post-card post-detail-card">
            <div class="post-header">
                <a href="/profile.html?id=${post.user.id}"><strong>${post.user.username}</strong></a>
                ${isOwnPost ? `<button id="deletePostBtn" class="delete-post-btn-inline">Excluir post</button>` : ''}
            </div>
            <img src="${post.image_url}" class="post-image" alt="Post">
            <div class="post-actions">
                <button class="like-btn" id="likeBtn" data-liked="${post.liked ?? false}">
                    ${post.liked ? '❤️' : '🤍'} <span id="likesCount">${post.likes_count}</span>
                </button>
            </div>
            <p class="post-caption"><strong>${post.user.username}</strong> ${post.caption ?? ''}</p>
        </div>

        <section class="comments-section">
            <h3>Comentários</h3>
            <div class="comments" id="commentsList"></div>

            <form class="comment-form" id="commentForm">
                <input type="text" id="commentInput" placeholder="Adicione um comentário..." required>
                <button type="submit">Enviar</button>
            </form>
        </section>
    `;

    document.getElementById('likeBtn').addEventListener('click', toggleLike);

    const deleteBtn = document.getElementById('deletePostBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deletePost(post.id));
    }

    document.getElementById('commentForm').addEventListener('submit', (e) => submitComment(e, post.id));
}

async function loadComments() {
    const response = await apiFetch(`/posts/${postId}/comments`);
    const comments = await response.json();

    const list = document.getElementById('commentsList');
    list.innerHTML = comments.map(renderComment).join('') || '<p class="empty-msg">Nenhum comentário ainda.</p>';
}

function renderComment(c) {
    return `<p class="comment-item"><a href="/profile.html?id=${c.user.id}"><strong>${c.user.username}</strong></a> ${c.body}</p>`;
}

async function toggleLike() {
    const response = await apiFetch(`/posts/${postId}/like`, { method: 'POST' });

    if (!response.ok) return;

    const data = await response.json();
    document.getElementById('likesCount').textContent = data.likes_count;

    const likeBtn = document.getElementById('likeBtn');
    likeBtn.innerHTML = `${data.liked ? '❤️' : '🤍'} <span id="likesCount">${data.likes_count}</span>`;
}

async function submitComment(e, postId) {
    e.preventDefault();

    const input = document.getElementById('commentInput');
    const body = input.value.trim();
    if (!body) return;

    const response = await apiFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
    });

    if (response.ok) {
        input.value = '';
        await loadComments();
    } else {
        const data = await response.json();
        alert(data.message || 'Erro ao comentar');
    }
}

async function deletePost(id) {
    if (!confirm('Deseja excluir este post?')) return;

    const response = await apiFetch(`/posts/${id}`, { method: 'DELETE' });

    if (response.ok) {
        window.location.href = '/profile.html';
        return;
    }

    const data = await response.json();
    alert(data.message || 'Erro ao excluir post');
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});
