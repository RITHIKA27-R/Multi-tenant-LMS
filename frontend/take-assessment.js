const API_BASE = 'http://localhost:8080';

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if (!token || !username) {
    window.location.href = 'login.html';
}

const urlParams = new URLSearchParams(window.location.search);
const assessmentId = urlParams.get('id');

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
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

async function fetchAssessmentDetails() {
    try {
        const response = await fetch(`${API_BASE}/assessments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const assessments = await response.json();
            const a = assessments.find(x => x.id == assessmentId);
            if (a) {
                document.getElementById('assessmentTitle').textContent = a.title;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function submitAssessment() {
    const container = document.getElementById('quizContainer');
    const selected = document.querySelector('input[name="q1"]:checked');

    if (!selected) {
        alert('Please answer the question before submitting.');
        return;
    }

    try {
        // In a real app, we'd send the answers to the backend
        // For now, we simulate the submission
        const response = await fetch(`${API_BASE}/assessments/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                assessmentId: parseInt(assessmentId),
                username: username,
                answers: { q1: selected.value }
            })
        });

        // Show result UI
        document.getElementById('assessmentContent').style.display = 'none';
        document.getElementById('resultContainer').style.display = 'block';

        // Mock score
        document.getElementById('finalScore').textContent = "B+";

    } catch (error) {
        console.error('Error submitting assessment:', error);
        alert('Assessment submitted successfully (Simulated)');
        document.getElementById('assessmentContent').style.display = 'none';
        document.getElementById('resultContainer').style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

displayUserInfo();
fetchAssessmentDetails();
