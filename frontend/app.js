// Get elements
const testBtn = document.getElementById('testBtn');
const result = document.getElementById('result');

// Add click handler
testBtn.addEventListener('click', testBackend);

async function testBackend() {
    result.textContent = 'Testing';
    result.className = '';

    try {
        const response = await fetch('/api/test');
        const data = await response.json();

        result.textContent = `✅Success! ${data.message}`;
        result.className = 'success';

    }   catch (error) {
        result.textContent = `❌Error: ${error.message}`;
        result.className = 'error';
    }

}