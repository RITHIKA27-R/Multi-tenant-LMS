const API_BASE = 'http://localhost:8080';

// Check authentication and admin role
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token || !username) {
    window.location.href = 'login.html';
}

// Parse JWT to check if admin
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

const payload = parseJwt(token);
if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'TENANT_ADMIN' && payload.role !== 'SUPER_ADMIN')) {
    alert('Access denied. Admin role required.');
    window.location.href = 'dashboard.html';
}

// Display user info
document.getElementById('username').textContent = username;
document.getElementById('tenant').textContent = `Tenant ID: ${payload.tenantId} • ${payload.role}`;
document.getElementById('avatar').textContent = username.charAt(0).toUpperCase();

// Tab Management
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');

    // Load data for the tab
    if (tabName === 'courses') loadCourses();
    if (tabName === 'assessments') loadAssessments();
    if (tabName === 'users') loadUsers();
    if (tabName === 'grading') loadGradingSubmissions();
}

// Grading Management
async function loadGradingSubmissions() {
    try {
        const response = await fetch(`${API_BASE}/assessments/submissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const submissions = await response.json();
        const container = document.getElementById('gradingList');

        if (submissions.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No Submissions Yet</h3><p>Assessment submissions will appear here for grading</p></div>';
            return;
        }

        container.innerHTML = submissions.map(sub => `
            <div class="admin-item">
                <div>
                    <h3>User: ${escapeHtml(sub.studentUsername)}</h3>
                    <p>Assessment ID: ${sub.assessmentId} • Status: <span class="badge">${sub.status}</span></p>
                    <p>Score: <strong>${sub.score}%</strong></p>
                    <p>Feedback: ${escapeHtml(sub.feedback || 'None')}</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-primary" onclick="showGradePrompt(${sub.id})">Grade</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function showGradePrompt(id) {
    const score = prompt("Enter score (0-100):", "100");
    if (score === null) return;
    const feedback = prompt("Enter feedback:", "Great work!");
    if (feedback === null) return;

    try {
        const response = await fetch(`${API_BASE}/assessments/grade/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score: parseInt(score), feedback })
        });

        if (response.ok) {
            alert('Graded successfully!');
            loadGradingSubmissions();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Course Management
function showCourseForm() {
    document.getElementById('courseForm').style.display = 'block';
}

function hideCourseForm() {
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById('createCourseForm').reset();
}

document.getElementById('createCourseForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('courseTitle').value;
    const description = document.getElementById('courseDescription').value;

    try {
        const response = await fetch(`${API_BASE}/courses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            hideCourseForm();
            loadCourses();
            alert('Course created successfully!');
        } else {
            alert('Failed to create course');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating course');
    }
});

async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const courses = await response.json();
        const container = document.getElementById('coursesList');

        if (courses.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No Courses</h3><p>Create your first course to get started</p></div>';
            return;
        }

        container.innerHTML = courses.map(course => `
            <div class="admin-item">
                <div>
                    <h3>${escapeHtml(course.title)}</h3>
                    <p>${escapeHtml(course.description || 'No description')}</p>
                    <span class="badge">Course ID: ${course.id}</span>
                </div>
                <button class="btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
        const response = await fetch(`${API_BASE}/courses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadCourses();
            alert('Course deleted successfully');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Assessment Management
function showAssessmentForm() {
    loadCoursesForDropdown();
    document.getElementById('assessmentForm').style.display = 'block';
}

function hideAssessmentForm() {
    document.getElementById('assessmentForm').style.display = 'none';
    document.getElementById('createAssessmentForm').reset();
}

async function loadCoursesForDropdown() {
    try {
        const response = await fetch(`${API_BASE}/courses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const courses = await response.json();
        const select = document.getElementById('assessmentCourse');

        select.innerHTML = '<option value="">Select a course...</option>' +
            courses.map(c => `<option value="${c.id}">${escapeHtml(c.title)}</option>`).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('createAssessmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('assessmentTitle').value;
    const courseId = document.getElementById('assessmentCourse').value;

    try {
        const response = await fetch(`${API_BASE}/assessments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, courseId: parseInt(courseId) })
        });

        if (response.ok) {
            hideAssessmentForm();
            loadAssessments();
            alert('Assessment created successfully!');
        } else {
            alert('Failed to create assessment');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating assessment');
    }
});

async function loadAssessments() {
    try {
        const response = await fetch(`${API_BASE}/assessments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const assessments = await response.json();
        const container = document.getElementById('assessmentsList');

        if (assessments.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No Assessments</h3><p>Create your first assessment</p></div>';
            return;
        }

        container.innerHTML = assessments.map(assessment => `
            <div class="admin-item">
                <div>
                    <h3>${escapeHtml(assessment.title)}</h3>
                    <span class="badge">Course ID: ${assessment.courseId}</span>
                    <span class="badge">Assessment ID: ${assessment.id}</span>
                </div>
                <button class="btn-danger" onclick="deleteAssessment(${assessment.id})">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteAssessment(id) {
    if (!confirm('Are you sure you want to delete this assessment?')) return;

    try {
        const response = await fetch(`${API_BASE}/assessments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadAssessments();
            alert('Assessment deleted successfully');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// User Management
function showUserForm() {
    document.getElementById('userForm').style.display = 'block';
}

function hideUserForm() {
    document.getElementById('userForm').style.display = 'none';
    document.getElementById('createUserForm').reset();
}

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newUser = {
        username: document.getElementById('newUsername').value,
        email: document.getElementById('newEmail').value,
        password: document.getElementById('newPassword').value,
        role: document.getElementById('newRole').value,
        tenantId: payload.tenantId
    };

    try {
        const response = await fetch('http://localhost:8081/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            hideUserForm();
            loadUsers();
            alert('User created successfully!');
        } else {
            alert('Failed to create user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating user');
    }
});

async function loadUsers() {
    try {
        const response = await fetch('http://localhost:8081/users');
        const users = await response.json();
        const container = document.getElementById('usersList');

        // Filter by tenant
        const tenantUsers = users.filter(u => u.tenantId === payload.tenantId);

        if (tenantUsers.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No Users</h3><p>Create your first user</p></div>';
            return;
        }

        container.innerHTML = tenantUsers.map(user => `
            <div class="admin-item">
                <div>
                    <h3>${escapeHtml(user.username)}</h3>
                    <p>Email: ${escapeHtml(user.email || 'N/A')}</p>
                    <span class="badge">${user.role}</span>
                </div>
                <button class="btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`http://localhost:8081/users/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadUsers();
            alert('User deleted successfully');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Initial load
loadCourses();
loadUsers();
loadGradingSubmissions();
updateStats();

async function updateStats() {
    try {
        const [c, u, s] = await Promise.all([
            fetch(`${API_BASE}/courses`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
            fetch('http://localhost:8081/users').then(r => r.json()),
            fetch(`${API_BASE}/assessments/submissions`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
        ]);

        document.getElementById('statCourses').textContent = Array.isArray(c) ? c.length : 0;
        document.getElementById('statUsers').textContent = Array.isArray(u) ? u.filter(x => x.tenantId === payload.tenantId).length : 0;
        document.getElementById('statGrades').textContent = Array.isArray(s) ? s.length : 0;
    } catch (e) {
        console.error("Stats update failed:", e);
    }
}
