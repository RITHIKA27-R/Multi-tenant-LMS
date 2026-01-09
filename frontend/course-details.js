const API_BASE = 'http://localhost:8080';

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token || !username) {
    window.location.href = 'login.html';
}

const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');

if (!courseId) {
    window.location.href = 'dashboard.html';
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

function displayUserInfo() {
    const payload = parseJwt(token);
    if (payload) {
        document.getElementById('username').textContent = username;
        document.getElementById('tenant').textContent = `Tenant ID: ${payload.tenantId} • ${payload.role}`;
        document.getElementById('avatar').textContent = username.charAt(0).toUpperCase();
    }
}

async function fetchCourseDetails() {
    try {
        const response = await fetch(`${API_BASE}/courses/${courseId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const course = await response.json();
            document.getElementById('courseTitle').textContent = course.title;
            document.getElementById('courseDescription').textContent = course.description || 'No description available.';
        }
    } catch (error) {
        console.error('Error fetching course:', error);
    }
}

async function fetchAssessments() {
    try {
        const response = await fetch(`${API_BASE}/assessments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const assessments = await response.json();
            // Filter assessments for this course
            const filtered = assessments.filter(a => a.courseId == courseId);
            displayAssessments(filtered);
        }
    } catch (error) {
        console.error('Error fetching assessments:', error);
    }
}

function displayAssessments(assessments) {
    const container = document.getElementById('assessmentsContainer');
    if (assessments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Assessments Available</h3>
                <p>There are no assessments assigned to this course yet.</p>
            </div>`;
        return;
    }

    container.innerHTML = `
        <div class="assessment-list">
            ${assessments.map(a => `
                <div class="assessment-card" onclick="takeAssessment(${a.id})">
                    <h3>${escapeHtml(a.title)}</h3>
                    <div class="status pending">Available</div>
                </div>
            `).join('')}
        </div>`;
}

function takeAssessment(id) {
    window.location.href = `take-assessment.html?id=${id}`;
}

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

displayUserInfo();
fetchCourseDetails();
fetchAssessments();
