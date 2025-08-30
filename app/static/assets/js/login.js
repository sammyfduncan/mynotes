//get elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('login-username');
const passwordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const loginStatus = document.getElementById('login-status');

//listener for login button
loginForm.addEventListener('submit', function(event) {
    //prevent form from refreshing
    event.preventDefault();

    //get values from input
    const username = usernameInput.value;
    const password = passwordInput.value;

    //create formdata w/ URLSearchParams for encoding
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    
    //update status paragraph to show status
    loginStatus.textContent = '';
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    //now fetch API call
    fetch ('/token', {
        method: 'POST', 
        body: formData,
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    })
    //now handle API response
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid username/password.');
        }
        //if successful parse JSON response
        return response.json();
    })
    .then (data => {
        //data obj contains access_token
        console.log('Login successful:', data);

        //store token in localstorage
        localStorage.setItem('authToken', data.access_token);
        //redirect user to dashboard
        window.location.href = '/dashboard.html';
    })
    .catch(error => {
        console.error('Login error:', error);
        loginStatus.textContent = error.message;
        loginStatus.style.color = 'red';

        //re-enable button 
        loginButton.disabled = 'false';
        loginButton.textContent = 'Login';
    });
});


