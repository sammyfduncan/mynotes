// logic for results.html

const notesContainer = document.getElementById('result-container');

if (notesContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');

    // fetch results from the API
    fetch(`/api/results/${contentId}`, { headers : headers = getApiHeaders()})
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // fill data 
            populateResultsPage(data);
        })
        .catch(error => {
            console.error('Error fetching results:', error);
            displayResultsError("Could not load your notes. The link may be invalid or the notes have been deleted.");
        });

    function populateResultsPage(data) {
        const filenameDisplay = document.getElementById('filename-display');
        const notesPreview = document.getElementById('notes-preview');
        const downloadButton = document.getElementById('download-btn');

        // update the content of the elements
        filenameDisplay.textContent = `Notes for: ${data.filename}`;
        notesPreview.textContent = data.notes;
        downloadButton.textContent = 'Download';

        // download button visible 
        downloadButton.classList.remove('d-none');
        //download button logic
        downloadButton.addEventListener('click', function() {
            // reprepare headers for download
            const downloadHeaders = new Headers();
            const authToken = localStorage.getItem('authToken');
            const guestId = localStorage.getItem('guestId');

            if (authToken) {
                downloadHeaders.append('Authorisation', `Bearer ${authToken}`);
            } else if (guestId) {
                downloadHeaders.append('X-Guest-Id', guestId);
            }
            //fetch call w/ headers
            fetch(`/download/${data.id}`, { headers: downloadHeaders })
                .then(response => {
                    if (!response.ok) throw new Error('Download failed');
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `notes_${data.filename}.md`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(() => alert('Could not download file.'));
        });
    }
    
    function displayResultsError(message) {
        notesContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
}

