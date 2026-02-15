const adminLogin = document.querySelector('#admin-login-form');
if (adminLogin) {
  adminLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(adminLogin));
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      window.location.href = '/admin/dashboard.html';
    } else {
      alert('Admin login failed');
    }
  });
}
