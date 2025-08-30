//select row containing three cols with cards
const notesContainer = document.getElementById('notes-grid-container');
const authToken = localStorage.getItem('authToken');

//if user not logged in, send to login
if (!authToken) {
    window.location.href = '/login.html';
    return;
}

//get headers for autheticated API call
const headers = new Headers();
headers.append('Authorisation', `Bearer ${authToken}`);

//fetch notes from API
fetch('/api/dashboard/', { headers : headers })
    .then(response => {
        if (!response.ok) {
            throw new Error('Could not find notes.\n');
        }
        return response.json();
    })
    .then(notes => {
        //clear placeholder cards from container
        notesContainer.innerHTML = '';

        if (notes.length === 0) {
            //nothing to display
            notesContainer.innerHTML = '<div class="col"><p>There are no notes to display.</p></div>';
            return;
        }

        //loop through each note returned from API
        notes.forEach(note => {
            //create HTML for card col
            const noteColumn = createNoteCard(note);
            //add col to row
            notesContainer.appendChild(noteColumn);
        });

    })
    .catch(error => {
        console.error("Error fetching note:", error);
        notesContainer.innerHTML = '<div class="col"><p class="text-danger">Error loading notes.</p></div>';
    });

/**
 * creates note structure for a single note card and returns it,
 * following the predefined bootstrap structure
 * @param {object} note - Single note object from the API
 * @returns {HTMLElement} - Column element containing the constructed card.
 */
function createNoteCard(note) {
    const column = document.createElement('div');
    column.className = 'col-md-4';

    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h4');
    cardTitle.className = 'card-title';
    cardTitle.textContent = note.filename;

    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    //short preview of the notes
    cardText.textContent = note.notes.substring(0, 100) + (note.notes.length > 100 ? '...' : '');

    const viewButton = document.createElement('a'); //anchor tag for linking
    viewButton.className = 'btn btn-primary';
    viewButton.href = `/results.html?id=${note.id}`; //link to the results page
    viewButton.textContent = 'View/Edit';

    const downloadButton = document.createElement('a');
    downloadButton.className = 'btn btn-primary';
    downloadButton.href = `/download/${note.id}`; //link to the download endpoint
    downloadButton.textContent = 'Download';
    downloadButton.style.marginLeft = '10px'; 

    // assemble the card
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(viewButton);
    cardBody.appendChild(downloadButton);
    card.appendChild(cardBody);
    column.appendChild(card);

    return column;
}
