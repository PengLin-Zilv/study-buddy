// // Get elements
// const testBtn = document.getElementById('testBtn');
// const result = document.getElementById('result');

// // Add click handler
// testBtn.addEventListener('click', testBackend);

// async function testBackend() {
//     result.textContent = 'Testing';
//     result.className = '';

//     try {
//         const response = await fetch('/api/test');
//         const data = await response.json();

//         result.textContent = `✅Success! ${data.message}`;
//         result.className = 'success';

//     }   catch (error) {
//         result.textContent = `❌Error: ${error.message}`;
//         result.className = 'error';
//     }

// }

// Get elements for onboarding

const questions = [
    "Hi, what are you studying?",
    "When is your exam?",
    "How much time can you study each day?",
    "What is your goal?"
];

let currentQuestionIndex = 0;

const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
let userData = {};
const questionKeys = ['subject', 'examDate', 'dailyTime', 'goal'];

const nextBtn = document.getElementById('next-btn');
const userAnswer = document.getElementById('user-answer');
const aiQuestion = document.getElementById('ai-question');


nextBtn.addEventListener('click', function() {
    const answer = userAnswer.value.trim();

    if (answer === '') {
        alert('Please enter answer!');
        return;
    }
     
    // if it is date question, process intellegently
    let processedAnswer = answer;

    if (currentQuestionIndex === 1) {  // second question is exam date
        processedAnswer = parseExamDate(answer);

        // if invalid date
        if (!processedAnswer) {
            alert('Please enter a valid date format (e.g., Nov 6, 11/06, 2025-11-06)');
            return; 
        }

        console.log('Date parsed:', processedAnswer);
    }

    console.log('User answered:', processedAnswer);
    userData[questionKeys[currentQuestionIndex]] = processedAnswer;

    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        console.log('All data collected:', userData);
        // aiQuestion.innerHTML = '<p>Thank you! Your study plan is being created...</p>';
        // userAnswer.style.display = 'none';
        // nextBtn.textContent = 'View My Plan';
        sendDataToBackend();
        return;
    }
    updateProgress();


    // display next question
    aiQuestion.innerHTML = '<p>' + questions[currentQuestionIndex] + '</p>';
    // base on question, set placeholder
    if (currentQuestionIndex === 1) {
        userAnswer.placeholder = 'e.g., Nov 6, 11/06, 2025-11-06';
    } else {
        userAnswer.placeholder = 'Type your answer...';
    }

    // empty the input field
    userAnswer.value = '';
});

function updateProgress () {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    // update progress bar width
    progressBar.style.width = progress + '%';
    // update text
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}


async function sendDataToBackend() {
    aiQuestion.innerHTML = '<p>⏳ Creating your study plan</p>';
    userAnswer.style.display = 'none';
    nextBtn.disabled = true;
    nextBtn.textContent = 'Creating Plan...';

    try {
        // Send data to backend
        const response = await fetch('/api/onboarding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        console.log('Received from backend:', result);

        // Success! Redirect to Dashboard

        const userId = result.userId;
        window.location.href = `/dashboard.html?userId=${userId}`;

    } catch (error) {
        console.error('Error:', error);
        aiQuestion.innerHTML = '❌ <p>Something went wrong. Please try again.</p>';
        nextBtn.disabled = false;
        nextBtn.textContent = 'Retry';
    }
}

function parseExamDate(input) {
    const currentYear = new Date().getFullYear();
    const str = input.trim().toLowerCase();
    
    // Month name to number mapping
    const months = {
        'jan': 0, 'january': 0,
        'feb': 1, 'february': 1,
        'mar': 2, 'march': 2,
        'apr': 3, 'april': 3,
        'may': 4,
        'jun': 5, 'june': 5,
        'jul': 6, 'july': 6,
        'aug': 7, 'august': 7,
        'sep': 8, 'september': 8,
        'oct': 9, 'october': 9,
        'nov': 10, 'november': 10,
        'dec': 11, 'december': 11
    };
    
    // Pattern 1: "nov 14" or "Nov 14"
    const match1 = str.match(/^([a-z]+) (\d{1,2})$/);
    if (match1) {
        const monthName = match1[1];
        const day = parseInt(match1[2]);
        const month = months[monthName];
        
        if (month === undefined) return null;
        
        let date = new Date(currentYear, month, day);
        
        // If date has passed, use next year
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            date = new Date(currentYear + 1, month, day);
        }
        
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        
        return `${y}-${m}-${d}`;
    }
    
    // Pattern 2: "11/14"
    const match2 = str.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (match2) {
        const month = parseInt(match2[1]) - 1;
        const day = parseInt(match2[2]);
        
        let date = new Date(currentYear, month, day);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            date = new Date(currentYear + 1, month, day);
        }
        
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        
        return `${y}-${m}-${d}`;
    }
    
    // Pattern 3: "2025-11-14"
    const match3 = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match3) {
        const y = match3[1];
        const m = match3[2].padStart(2, '0');
        const d = match3[3].padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    
    return null;
}