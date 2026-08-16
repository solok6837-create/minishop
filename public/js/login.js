// login.js — handles both logging in and creating a new account.

let mode = 'login';   // 'login' or 'register'

function showTab(which) {
  mode = which;
  document.getElementById('tabLogin').classList.toggle('active', which === 'login');
  document.getElementById('tabRegister').classList.toggle('active', which === 'register');
  // The name box only appears when creating an account.
  document.getElementById('nameField').style.display = which === 'register' ? 'block' : 'none';
  document.getElementById('submitBtn').textContent = which === 'register' ? 'Create account' : 'Login';
  document.getElementById('msg').innerHTML = '';
}

async function submitForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const url = mode === 'register' ? '/api/register' : '/api/login';
  const result = await apiPost(url, { name, email, password });

  if (!result.ok) {
    showMsg(result.data.error || 'Something went wrong.', 'error');
    return;
  }

  // Save the login token, then send them back to the shop.
  setAuth(result.data.token, result.data.name);
  showMsg('Welcome, ' + result.data.name + '! Redirecting…', 'success');
  setTimeout(() => { window.location.href = 'index.html'; }, 700);
}

function showMsg(text, type) {
  document.getElementById('msg').innerHTML = `<div class="msg ${type}">${text}</div>`;
}
