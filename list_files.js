async function listFiles(directory) {
    const apiURL = `https://api.github.com/repos/wbhart/ProofDroid/contents/${directory}`;

    const response = await fetch(apiURL);
    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error('GitHub API returned non-array data');
    }

    return data.filter(item => item.name.endsWith('.json')).map(item => item.name);
}

export { listFiles };

