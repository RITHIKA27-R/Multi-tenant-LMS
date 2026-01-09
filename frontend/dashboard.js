const API_BASE = 'http://localhost:8080';

// Check authentication
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token || !username) {
    window.location.href = 'login.html';
}

// Parse JWT to get user info
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

// Display user info
function displayUserInfo() {
    const payload = parseJwt(token);
    if (payload) {
        document.getElementById('username').textContent = username;
        document.getElementById('tenant').textContent = `Tenant ID: ${payload.tenantId} • ${payload.role}`;

        // Avatar initial
        const initial = username.charAt(0).toUpperCase();
        document.getElementById('avatar').textContent = initial;

        // Show admin button if user is admin
        if (payload.role === 'ADMIN') {
            document.getElementById('adminBtn').style.display = 'block';
        }
    }
}

// Fetch and display courses
async function fetchCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        const courses = await response.json();
        displayCourses(courses);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('coursesContainer').innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="4"/>
                    <path d="M45 60L60 75L85 50" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                </svg>
                <h3>Error Loading Courses</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Display courses
function displayCourses(courses) {
    const container = document.getElementById('coursesContainer');

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 120 120" fill="none">
                    <rect x="30" y="30" width="60" height="60" rx="8" stroke="currentColor" stroke-width="4"/>
                    <path d="M45 55H75M45 65H65" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                </svg>
                <h3>No Courses Yet</h3>
                <p>Your courses will appear here once you enroll</p>
            </div>
        `;
        return;
    }

    const coursesHTML = courses.map(course => `
        <div class="course-card" onclick="location.href='course-details.html?id=${course.id}'" style="cursor: pointer;">
            <h3>${escapeHtml(course.title)}</h3>
            <p>${escapeHtml(course.description || 'No description available')}</p>
            <div class="course-meta">
                <span class="badge">Tenant ${course.tenantId}</span>
                <span>Course ID: ${course.id}</span>
            </div>
        </div>
    `).join('');

    container.innerHTML = `<div class="courses-grid">${coursesHTML}</div>`;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Notification Management
async function fetchNotifications() {
    try {
        const response = await fetch(`${API_BASE}/notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const notifications = await response.json();
            displayNotifications(notifications);
        }
    } catch (e) { console.error(e); }
}

function displayNotifications(notifs) {
    const list = document.getElementById('notifList');
    const count = document.getElementById('notifCount');

    if (notifs.length > 0) {
        count.textContent = notifs.length;
        count.style.display = 'inline';
        list.innerHTML = notifs.map(n => `
            <div style="padding: 8px; border-bottom: 1px solid #eee;">
                ${escapeHtml(n.message)}
            </div>
        `).join('');
    } else {
        count.style.display = 'none';
        list.innerHTML = '<p style="color: grey; padding: 10px;">No new notifications</p>';
    }
}

function toggleNotifications() {
    const dropdown = document.getElementById('notifDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Close dropdown on click outside
window.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notifDropdown');
    const btn = document.getElementById('notifBtn');
    if (dropdown.style.display === 'block' && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Initialize
displayUserInfo();
fetchCourses();
fetchNotifications();
