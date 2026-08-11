import { apiFetch, getToken, logout } from './api.js';

if (!getToken()) {
    window.location.href = '/index.html';
}

// Pega o ID do usuário pela URL: profile.html?id=3
// Se não tiver ID na URL, mostra o próprio perfil (usuário logado)
const params = new URLSearchParams(window.location.search);
let profileId = params.get('id');

let currentUserId = null; // ID de quem está logado

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
    const user = data.user;
    const posts = data.posts;

    document.getElementById('profileAvatar').src = user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}`;
    document.getElementById('profileUsername').textContent = '@' + user.username;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileBio').textContent = user.bio || '';
    document.getElementById('postsCount').textContent = user.posts_count ?? posts.length;
    document.getElementById('followersCount').textContent = user.followers_count ?? 0;
    document.getElementById('followingCount').textContent = user.following_count ?? 0;

    const isOwnProfile = Number(profileId) === Number(currentUserId);
    const followBtn = document.getElementById('followBtn');
    const editBtn = document.getElementById('editBtn');

    if (isOwnProfile) {
        editBtn.style.display = 'inline-block';
        followBtn.style.display = 'none';
    } else {
        followBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
        followBtn.textContent = user.is_following ? 'Deixar de seguir' : 'Seguir';
    }

    // Grade de posts
    const grid = document.getElementById('profilePosts');
    grid.innerHTML = '';
    posts.forEach(post => {
        const img = document.createElement('img');
        img.src = post.image_url;
        img.className = 'grid-post';
        grid.appendChild(img);
    });

    attachProfileEvents(user);
}

function attachProfileEvents(user) {
    const followBtn = document.getElementById('followBtn');
    followBtn.onclick = async () => {
        const response = await apiFetch(`/users/${profileId}/follow`, { method: 'POST' });
        const data = await response.json();
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

// Salvar edição de perfil
const updateProfileForm = document.getElementById('updateProfileForm');
updateProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('editName').value);
    formData.append('username', document.getElementById('editUsername').value);
    formData.append('bio', document.getElementById('editBio').value);

    const avatarFile = document.getElementById('editAvatar').files[0];
    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }

    // Laravel espera POST com _method=PUT quando manda FormData
    formData.append('_method', 'PUT');

    const errorMsg = document.getElementById('editErrorMsg');

    const response = await apiFetch('/profile', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        document.getElementById('editForm').style.display = 'none';
        loadProfile();
    } else {
        const data = await response.json();
        const firstError = data.errors ? Object.values(data.errors)[0][0] : data.message;
        errorMsg.textContent = firstError || 'Erro ao atualizar perfil';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});

loadCurrentUser();