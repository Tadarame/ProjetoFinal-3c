import { apiFetch, getToken, logout } from './api.js';

if (!getToken()) {
    window.location.href = '/index.html';
}

const params = new URLSearchParams(window.location.search);
let profileId = params.get('id');

let currentUserId = null;

async function loadCurrentUser() {
    const response = await apiFetch('/me');
    const data = await response.json();

    currentUserId = data.id;

    if (!profileId) {
        profileId = currentUserId;
    }

    loadProfile();
}

async function loadProfile() {
    const response = await apiFetch(`/users/${profileId}`);
    const data = await response.json();

    if (!response.ok) {
        alert(data.message || 'Erro ao carregar perfil');
        return;
    }

    const user = data.user;
    const posts = data.posts || [];
    const isOwnProfile = Number(profileId) === Number(currentUserId);

    document.getElementById('profileAvatar').src =
        user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}`;

    document.getElementById('profileUsername').textContent = '@' + user.username;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileBio').textContent = user.bio || '';
    document.getElementById('postsCount').textContent = user.posts_count ?? posts.length;
    document.getElementById('followersCount').textContent = user.followers_count ?? 0;
    document.getElementById('followingCount').textContent = user.following_count ?? 0;

    const followBtn = document.getElementById('followBtn');
    const editBtn = document.getElementById('editBtn');

    if (isOwnProfile) {
        editBtn.style.display = 'inline-block';
        followBtn.style.display = 'none';
    } else {
        editBtn.style.display = 'none';
        followBtn.style.display = 'inline-block';
        followBtn.textContent = user.is_following ? 'Deixar de seguir' : 'Seguir';
    }

    renderPosts(posts, isOwnProfile);
    attachProfileEvents(user);
}

function renderPosts(posts, isOwnProfile) {
    const grid = document.getElementById('profilePosts');
    grid.innerHTML = '';

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'profile-post-card';

        postCard.innerHTML = `
            <img src="${post.image_url}" class="grid-post" alt="Post">
            ${
                isOwnProfile
                    ? `<button class="delete-post-btn" data-id="${post.id}">Excluir</button>`
                    : ''
            }
        `;

        postCard.querySelector('img').addEventListener('click', () => {
            window.location.href = `post.html?id=${post.id}`;
        });

        grid.appendChild(postCard);
    });

    attachDeletePostEvents();
}

function attachProfileEvents(user) {
    const followBtn = document.getElementById('followBtn');

    followBtn.onclick = async () => {
        const response = await apiFetch(`/users/${profileId}/follow`, {
            method: 'POST',
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || 'Erro ao seguir usuário');
            return;
        }

        followBtn.textContent = data.following ? 'Deixar de seguir' : 'Seguir';
        document.getElementById('followersCount').textContent = data.followers_count;
    };

    const editBtn = document.getElementById('editBtn');

    editBtn.onclick = () => {
        const editForm = document.getElementById('editForm');
        editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';

        document.getElementById('editName').value = user.name;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editBio').value = user.bio || '';
    };
}

function attachDeletePostEvents() {
    document.querySelectorAll('.delete-post-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const postId = button.dataset.id;

            if (!confirm('Deseja excluir este post?')) {
                return;
            }

            const response = await apiFetch(`/posts/${postId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                loadProfile();
                return;
            }

            const data = await response.json();
            alert(data.message || 'Erro ao excluir post');
        });
    });
}

const updateProfileForm = document.getElementById('updateProfileForm');

if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', async e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('editName').value);
        formData.append('username', document.getElementById('editUsername').value);
        formData.append('bio', document.getElementById('editBio').value);

        const avatarFile = document.getElementById('editAvatar').files[0];

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        formData.append('_method', 'PUT');

        const errorMsg = document.getElementById('editErrorMsg');
        errorMsg.textContent = '';

        const response = await apiFetch('/profile', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('editForm').style.display = 'none';
            loadProfile();
            return;
        }

        const firstError = data.errors
            ? Object.values(data.errors)[0][0]
            : data.message;

        errorMsg.textContent = firstError || 'Erro ao atualizar perfil';
    });
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});

loadCurrentUser();