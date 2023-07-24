const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the homepage
      document.location.replace('/');
    } else {
      const data = await response.json();
      alert(data.message);
    }
  }
};

const usernameSignupEl = document.querySelector('#name-signup');
const emailSignupEl = document.querySelector('#email-signup');
const passwordSignupEl = document.querySelector('#password-signup');

const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = usernameSignupEl.value.trim();
  const email = emailSignupEl.value.trim();
  const password = passwordSignupEl.value.trim();

  if (!username || !email || password.length < 8) {
    if (!username) {
      usernameSignupEl.classList.add("is-invalid");
      usernameSignupEl.addEventListener("input",() => {
        usernameSignupEl.classList.remove("is-invalid");
      }, {once: true})
    }
    if (!email) {
      emailSignupEl.classList.add("is-invalid");
      emailSignupEl.addEventListener("input",() => {
        emailSignupEl.classList.remove("is-invalid");
      }, {once: true})
    }
    if (password.length < 8) {
      passwordSignupEl.classList.add("is-invalid");
      passwordSignupEl.addEventListener("input",() => {
        passwordSignupEl.classList.remove("is-invalid");
      }, {once: true})
    }
  }

  if (username && email && password) {
    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      // Right now it just says "bad request" if the unique password and email requirements are not met.
      alert(response.statusText);
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
