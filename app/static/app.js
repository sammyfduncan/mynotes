

document.addEventListener('DOMContentLoaded', function(){
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
})



