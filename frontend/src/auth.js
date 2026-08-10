// login

import { apiFetch, setToken } from "./api.js";

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');

        try {
            const response = await apiFetch('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (!response.ok) {
                errorMsg.textContent = data.message || 'Erro ao fazer login';
                return;
            }

            setToken(data.token);
            window.location.href = "feed.html";

        } catch (error) {
            errorMsg.textContent = 'Erro ao conectar com o servidor';
        }
    });
}

// registro

const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');

        try {
            const response = await apiFetch('/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, username, email, password}),
            });

            const data = await response.json();

            if (!response.ok) {
                const firstError = data.errors
                    ? Object.values(data.errors)[0][0]
                    : data.message;
                errorMsg.textContent = firstError || 'Erro ao registrar';
                return;
            }

            setToken(data.token);
            window.location.href = "feed.html";
        } catch (error) {
            errorMsg.textContent = "Erro ao conectar com o servidor";
        }
    });
}