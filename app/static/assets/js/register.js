//get elements
const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('register-username');
const passwordInput = document.getElementById('register-password');
const passwordConfirmInput = document.getElementById('register-password-confirm');
const registerButton = document.getElementById('register-button');
const registerStatus = document.getElementById('register-status');

//form event listener
registerForm.addEventListener('submit', function(event) {
    //prevent refresh
    event.preventDefault();

    //get values from input
    const username = usernameInput.value;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    registerStatus.textContent = '';

    //validation check
    if (password !== passwordConfirm) {
        registerStatus.textContent = 'Passwords do not match.';
        registerStatus.style.color = 'red';
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = 'Creating account...';

    //make API call
    fetch('/users/', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        //convert user data to JSON str
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    //now handle API response
    .then(async response => {
        if (!response.ok) {
            //parse error from json
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }
        //return response if successful
        return response.json();
    })
    .then(data => {
        //data obj contains user info
        console.log('Registration complete:', data);
        registerStatus.textContent = 'Account created.';


        //redirect user to login
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    })
    .catch(error => {
        console.error('registration error:', error);
        registerStatus.textContent = error.message;

        //reenable button so login can be re-attempted
        registerButton.disabled = false;
        registerButton.textContent = 'Register Account';
    });
});

