const backendUrl = window.backendUrl;

function signUp() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!name || !password) {
        alert('Please fill out the form');
        return;
    }
  
    // Call the User API
    const apiUrl = backendUrl + '/users';
    const data = {
        name: name,
        email: email,
        password: password
    };
  
    // Make an API request
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data && data.data && data.data.user) {
            const user = data.data.user;
            alert(`User ID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}`);
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
  }
