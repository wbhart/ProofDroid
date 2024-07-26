document.addEventListener('DOMContentLoaded', () => {
    const fileListElement = document.getElementById('fileList');

    // GitHub API URL
    const apiURL = `https://api.github.com/repos/wbhart/ProofDroid/contents/systems`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            // Filter the response to get only JSON files
            const jsonFiles = data.filter(item => item.name.endsWith('.json'));

            // List the JSON files
            jsonFiles.forEach(file => {
                const listItem = document.createElement('li');
                listItem.textContent = file.name;
                fileListElement.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching the directory contents:', error));
});

