// Get userId from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

if (!userId) {
    alert('No userID found!');
    window.location.href = '/';
}

// Load user data
async function loadUserData() {
    try {
        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();

        if (data.success) {
            displayPlan(data.data);
        } else {
            throw new Error('Failed to load data'); 
        }
    

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load your study plan. Please try again.');
        window.location.href = '/';
    }
}

function displayPlan(userData) {
    document.getElementById('subject-name').textContent = userData.subject;
    
    // ✅ fix: avoid timezone issues
    const [year, month, day] = userData.examDate.split('-');
    const examDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    examDate.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    // friendly countdown text
    let countdownText;
    if (daysLeft === 0) {
        countdownText = "Your exam is TODAY! 🎯";
    } else if (daysLeft === 1) {
        countdownText = "Your exam is TOMORROW! 🔥";
    } else if (daysLeft < 0) {
        countdownText = "Exam has passed";
    } else {
        countdownText = `${daysLeft} days until your exam! 🔥`;
    }
    
    document.getElementById('exam-countdown').textContent = countdownText;

    // Format date nicely
    const formattedDate = examDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric' 
    });

    document.getElementById('exam-date-display').textContent = formattedDate;
    document.getElementById('daily-time').textContent = userData.dailyTime;
    document.getElementById('goal').textContent = userData.goal;
}

// Start Button
document.getElementById('start-studying').addEventListener('click', () => {
    alert('🎉 Study session feature coming soon!');
});

// Load data on page load
loadUserData();