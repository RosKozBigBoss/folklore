document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generation-form');
    const resultsDiv = document.getElementById('results');
    const statusSpan = document.getElementById('status');
    const scoreSpan = document.getElementById('score');
    const elementsUl = document.getElementById('elements');
    const playerDiv = document.getElementById('player');
    const historyBody = document.getElementById('history-body');
    const filterRegion = document.getElementById('filter-region');
    const sortAuthenticity = document.getElementById('sort-authenticity');

    let musicHistory = [];

    async function fetchHistory() {
        try {
            const response = await fetch('/api/history');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            musicHistory = await response.json();
            renderHistory();
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    }

    function renderHistory() {
        let filteredHistory = [...musicHistory];

        if (filterRegion.value !== 'All') {
            filteredHistory = filteredHistory.filter(item => item.region === filterRegion.value);
        }

        filteredHistory.sort((a, b) => {
            if (sortAuthenticity.value === 'asc') {
                return a.score - b.score;
            }
            return b.score - a.score;
        });

        historyBody.innerHTML = '';
        filteredHistory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="border: 1px solid #ccc; padding: 0.5em;">${item.description}</td>
                <td style="border: 1px solid #ccc; padding: 0.5em;">${item.region}</td>
                <td style="border: 1px solid #ccc; padding: 0.5em;">${item.score}</td>
                <td style="border: 1px solid #ccc; padding: 0.5em;"><audio controls src="${item.audioUrl}"></audio></td>
            `;
            historyBody.appendChild(row);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        resultsDiv.style.display = 'block';
        statusSpan.textContent = 'Processing...';
        scoreSpan.textContent = '';
        elementsUl.innerHTML = '';
        playerDiv.innerHTML = '';

        const formData = new FormData(form);
        const instruments = Array.from(formData.getAll('instruments'));
        const data = {
            description: formData.get('description'),
            region: formData.get('region'),
            instruments,
            rhythm: formData.get('rhythm'),
            duration: formData.get('duration'),
            authenticity: formData.get('authenticity'),
            style: formData.get('style'),
        };

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const result = await response.json();

            statusSpan.textContent = result.status;
            scoreSpan.textContent = result.score;
            result.elements.forEach(element => {
                const li = document.createElement('li');
                li.textContent = element;
                elementsUl.appendChild(li);
            });
            playerDiv.innerHTML = `<audio controls src="${result.audioUrl}"></audio>`;

            fetchHistory(); // Refresh history
        } catch (error) {
            statusSpan.textContent = 'Failed';
            console.error('There was a problem with the fetch operation:', error);
        }
    });

    filterRegion.addEventListener('change', renderHistory);
    sortAuthenticity.addEventListener('change', renderHistory);

    fetchHistory(); // Initial fetch
});
