

document.addEventListener('DOMContentLoaded', function(){
    //if user is on results page
    const notesContainer = document.getElementById('result-container');


    //logic for upload.html here

    //get element for uploading file, and then submitting
    const uploadFile = document.getElementById('upload-form');
    const submitFile = document.getElementById('file_submit');
    const uploadSpinner = document.getElementById('upload-spinner');

    //add listener for submit button click
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
            const styleSelected = document.querySelector('input[name="note_style"]:checked').value;

            //create formdata and make fetch call
            const formData = new FormData();
            formData.append('file', file);
            formData.append('note_style', styleSelected);

            //show spinner 
            uploadSpinner.classList.remove('d-none');

            fetch('/upload/', {
                method: 'POST',
                body: formData,
            })
            
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                //redirect to results
                window.location.href = `/results.html?id=${data.content_id}`;
            })
            //error check
            .catch(error => {
                console.error('Error:', error);
                alert('Error occured during file upload.');

                //loading spinner
                uploadSpinner.classList.add('d-none');
            });
        });
    }

    //logic for serving generated file
    if (notesContainer) {

        //get content id from url
        const urlParams = new URLSearchParams(window.location.search);
        //this holds value from url
        const contentId = urlParams.get('id');

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
                    console.log('Processing...');
                    setTimeout(() => checkStatus(id), 3000);
                    //stop if failed
                    return null;
                }
                //any other error:
                throw new Error('Failed to get server response');
            })
            .then(data => {
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
        //begin checking when page loads
        checkStatus(contentId);
    }

    //helpers
    function activateDownloadLink(data) {
        
        const downloadButton = document.getElementById('download-btn');
        downloadButton.addEventListener('click', function() {
            //when clicked goto download URL
            window.location.href = `/download/${data.id}`;
        });
    }

    function displayError(message) {
        notesContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
})


