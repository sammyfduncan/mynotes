

document.addEventListener('DOMContentLoaded', function(){
    //if user is on results page
    const notesContainer = document.getElementById('result-container');


    //logic for upload.html here

    //get element for uploading file, and then submitting
    const uploadFile = document.getElementById('upload-form');
    const submitFile = document.getElementById('file_submit');
    const uploadSpinner = document.getElementById('upload-spinner');

    //upload.html logic
    if (submitFile) {
        submitFile.addEventListener('click', function() {

            //get the input file
            const file = uploadFile.files[0];

            //check file submitted correctly
            if (!file) {
                alert("No file selected.");
                return;
            }

            //get style of note 
            const styleSelected = document.querySelector('#style-selector .btn.active').value;

            //create formdata and make fetch call
            const formData = new FormData();
            formData.append('file', file);
            formData.append('note_style', styleSelected);

            //get user info text
            const statusText = document.getElementById('upload-status-text');

            fetch('/upload/', {
                method: 'POST',
                body: formData,
            })
            
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                //begin polling
                checkStatus(data.content_id); 
            })
            //error check
            .catch(error => {
                console.error('Error:', error);
                alert('Error occured during file upload.');

                //loading spinner
                uploadSpinner.classList.add('d-none');
            });
        });

        //fetch call logic
        function checkStatus(id) {

            fetch(`/results/${id}`)
            .then(response => {
                //check http status code
                //complete
                if (response.status === 200) {
                    return response.json();
                } //processing. start polling
                if (response.status === 202) {

                    statusText.textContent = 'Processing, please wait...';
                    console.log('Processing...');
                    setTimeout(() => checkStatus(id), 3000);
                    //stop if failed
                    return null;
                }
                //any other error:
                throw new Error('Failed to get server response');
            })
            .then(data => {
                statusText.textContent = 'Uploaded file, preparing to create notes...';
                //runs if SC is 200
                if (data) {
                    console.log('Success:', data);
                    //updates page
                    activateDownloadLink(data);
                }
            })
            .catch(error => {
                console.error('Failed to retrieve notes.');
                displayError('Error: could not retrieve notes.');
            });
        }

        //helpers
        function activateDownloadLink(data) {
            
            const downloadButton = document.getElementById('download-btn');
            downloadButton.addEventListener('click', function() {
                //when clicked goto download URL
                window.location.href = `/results.html?id=${data.id}`;
            });
        }

        function displayError(message) {
            notesContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
        }
    }

    //results.html logic
    if (notesContainer) {

        //content id from url
        const urlParams = new URLSearchParams(window.location.search);
        //holds value from url
        const contentId = urlParams.get('id');

        //fetch results from API
        fetch(`/results/${contentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('error fetching API response');
                }
                return response.json();
            }) //successful
            .then(data => {
                showResults(data);
            })
            .catch(error => {
                displayError("Failed to load notes.");
            });

            //helper
            function showResults(data) {

                //elements to update
                const fn_display = document.getElementById('filename-display');
                const prev_notes = document.getElementById('notes-preview');
                const download_btn = document.getElementById('download-btn');

                //update content
                fn_display.textContent = `${data.filename}`;
                prev_notes.textContent = data.notes;

                //download btn 
                download_btn.classList.remove('d-none');
                download_btn.addEventListener('click', function() {
                    window.location.href = `/download/${data.id}`;
                });
            }
    }
})


