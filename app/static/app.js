

document.addEventListener('DOMContentLoaded', function(){
    //if user is on results page
    const notesContainer = document.getElementById('result-container');


    //logic for upload.html here

    //get element for uploading file, and then submitting
    const uploadFile = document.getElementById('upload-form');
    const submitFile = document.getElementById('file_submit');

    //add listener for submit button click
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
        });
    });

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
                    displayDownloadLink(data);
                }
            })
            .catch(error => {
                console.error('Failed to retrieve notes.');
            });
        }
        //begin checking when page loads
        checkStatus(contentId);
    }
})

//helpers
function displayDownloadLink(data) {
    //clear container
    notesContainer.innerHTML = '';

    //create a new link el
    const downloadLink = document.createElement('a');
    //download endpoint
    downloadLink.href = `/download/${data.id}`;
    downloadLink.className = 'btn btn-success';
    downloadLink.textContent = `Download Notes for "${data.filename}"`;

    //add link to page
    notesContainer.appendChild(downloadLink);
}

function displayError(message) {
    notesContainer.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}

