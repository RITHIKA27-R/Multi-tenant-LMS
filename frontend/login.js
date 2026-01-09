const API_BASE = 'http://localhost:8080';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    errorDiv.style.display = 'none';

    try {
        const response = await fetch(`http://localhost:8081/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: username, password }) // Changed username to email
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Invalid credentials');
        }

        const token = await response.text();

        // Store token and username
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

        // Redirect based on role
        const payload = parseJwt(token);
        if (payload.role === 'SUPER_ADMIN') {
            window.location.href = 'super-admin/dashboard.html'; // Added .html
        } else if (payload.role === 'TENANT_ADMIN' || payload.role === 'ADMIN') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }

    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
});

// Helper to parse JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// Auto-fill demo accounts on click
document.querySelectorAll('.demo-account').forEach(account => {
    account.addEventListener('click', () => {
        const text = account.textContent;
        if (text.includes('superadmin@lms.com')) {
            document.getElementById('username').value = 'superadmin@lms.com';
            document.getElementById('password').value = 'superpassword';
        } else if (text.includes('alice@acme.com')) {
            document.getElementById('username').value = 'alice@acme.com';
            document.getElementById('password').value = 'password';
        } else if (text.includes('bob@beta.com')) {
            document.getElementById('username').value = 'bob@beta.com';
            document.getElementById('password').value = 'password';
        }
    });
});
