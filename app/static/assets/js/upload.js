// logic for upload.html

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

        //headers for authentication or guest tracking
        const headers = new Headers();
        //store auth token here after login
        const authToken = localStorage.getItem('authToken');
        const guestId = localStorage.getItem('guestId');

        if (authToken) {
            headers.append('Authorisation', `Bearer ${authToken}`);
        } else if (guestId) {
            //use custom header for guest id 
            headers.append('Guest-Id', guestId);
        }

        // Update UI to show processing has started
        if(uploadSpinner) uploadSpinner.classList.remove('d-none');
        submitFileButton.disabled = true;
        submitFileButton.textContent = 'Processing...';
        statusText.textContent = 'Uploading your file...';
        
        // upload fetch call
        fetch('/upload/', {
        method: 'POST',
        headers: headers, // Use the headers we just prepared
        body: formData,
        })
        .then(response => {
            if (response.status === 403) { // 403 Forbidden
                throw new Error('Guest limit reached');
            }
            if (!response.ok) {
                // Catches 500 errors and other issues
                throw new Error('Upload failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Upload successful, start status check for ID', data.content_id);
            
            // If the server sent back a new guest_id, store it
            if (data.guest_id) {
                localStorage.setItem('guestId', data.guest_id);
                console.log('New guest ID stored:', data.guest_id);
            }
            
            // Start polling for results
            checkStatus(data.content_id);
        })
        .catch(error => {
            console.error('Error during initial upload:', error);
            if (error.message === 'Guest limit reached') {
                displayUploadError('You have used your one free note. Please create an account to generate more.');
            } else {
                displayUploadError('The initial file upload failed. Please try again.');
            }
        });
    });
    
    //checking status
    function checkStatus(id) {

        //header preparation
        const headers = new Headers();
        const authToken = localStorage.getItem('authToken');
        const guestId = localStorage.getItem('guestId');

        if (authToken) {
            headers.append('Authorisation', `Bearer ${authToken}`);
        } else if (guestId) {
            headers.append('Guest-Id', guestId);
        }

        fetch(`/api/results/${id}`, { headers : headers })
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
