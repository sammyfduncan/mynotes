document.addEventListener('DOMContentLoaded', function() {

    // for upload.html
    const submitFileButton = document.getElementById('file_submit');
    if (submitFileButton) {
        const uploadFileInput = document.getElementById('upload-form');
        const uploadSpinner = document.getElementById('upload-spinner');
        const statusText = document.getElementById('upload-status-text');

        submitFileButton.addEventListener('click', function() {
            const file = uploadFileInput.files[0];
            if (!file) {
                alert("Please select a file.");
                return;
            }

            //file validation
            const MAX_FILE_SIZE = 10 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert(`The file is larger than the maximum of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
                return;
            }


            const styleSelected = document.querySelector('#style-selector .btn.active').value;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('note_style', styleSelected);

            // Update UI to show processing has started
            if(uploadSpinner) uploadSpinner.classList.remove('d-none');
            submitFileButton.disabled = true;
            submitFileButton.textContent = 'Processing...';
            statusText.textContent = 'Uploading your file...';

            // upload fetch call
            fetch('/upload/', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Upload successful, start status check for ID', data.content_id);
                // start polling 
                checkStatus(data.content_id);
            })
            .catch(error => {
                console.error('Error during initial upload:', error);
                displayUploadError('The initial file upload failed. Please try again.');
            });
        });
//
        function checkStatus(id) {
            fetch(`/api/results/${id}`)
            .then(response => {
                if (response.status === 200) { // complete
                    //get JSON
                    response.json().then(data => {
                        console.log("Processing complete, redirecting...");
                        statusText.textContent = 'Notes generated, please wait...';
                        window.location.href = `/results.html?id=${data.id}`;
                    });
                } else if (response.status === 202) { // processing
                    statusText.textContent = 'Your file is being processed, please wait...';
                    console.log("Status is 'processing', checking again in 3 seconds...");
                    setTimeout(() => checkStatus(id), 3000); // continue polling 
                } else { // any error
                    throw new Error(`Server responded with status: ${response.status}`);
                }
            })
            .then(data => {
                if (data) {
                    // runs when SC 200 
                    console.log("Processing complete! Redirecting...");
                    statusText.textContent = 'Notes created, please wait...';
                    // redirect results.html
                    window.location.href = `/results.html?id=${data.id}`;
                }
            })
            .catch(error => {
                console.error('Error during status check:', error);
                displayUploadError('An error occurred while generating notes. Please try uploading again.');
            });
        }
        
        function displayUploadError(message) {
            if(uploadSpinner) uploadSpinner.classList.add('d-none');
            submitFileButton.disabled = false;
            submitFileButton.textContent = 'Generate Notes';
            statusText.textContent = message;
            statusText.style.color = 'red';
        }
    }

    // --- LOGIC FOR RESULTS.HTML ---
    const notesContainer = document.getElementById('result-container');
    if (notesContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get('id');

        // fetch results from the API
        fetch(`/api/results/${contentId}`)
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

            // download button visible 
            downloadButton.classList.remove('d-none');
            downloadButton.addEventListener('click', function() {
                window.location.href = `/download/${data.id}`;
            });
        }
        
        function displayResultsError(message) {
            notesContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
        }
    }
});
