
document.getElementById('logout').addEventListener('click', function () {
    // Hapus token dari localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Redirect ke halaman login
    window.location.href = 'login.html';
});


// Ganti URL ini dengan endpoint Anda
const endpoint = "https://backendinfinitywater.hayyalmusafir.com/api/auth/me";

// Fungsi untuk mengambil username dari endpoint
async function fetchUsername() {
try {
    // Ambil token dari localStorage atau sumber lain
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
    }

    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Tambahkan token ke header
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch username: ${response.statusText}`);
    }

    const data = await response.json();

    // Asumsikan data.username berisi username pengguna
    document.getElementById("username").textContent = data.username;
} catch (error) {
    console.error("Error fetching username:", error);
}
}

// Panggil fungsi fetchUsername saat halaman dimuat
window.onload = fetchUsername;

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('access_token');

    if (!token || !username) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('username').textContent = username;
    }

    document.getElementById('logout').addEventListener('click', function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });
});

document.addEventListener('DOMContentLoaded', async function () {
const token = localStorage.getItem('access_token');
const refreshToken = localStorage.getItem('refresh_token');
const refreshUrl = 'https://backendinfinitywater.hayyalmusafir.com/api/auth/refresh?token=';

// Fungsi untuk melakukan refresh token
async function refreshAccessToken() {
    try {
        const response = await fetch(`${refreshUrl}${encodeURIComponent(refreshToken)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            // Simpan token yang baru
            localStorage.setItem('access_token', data.access_token);
            console.log('Access token refreshed successfully.');
            return data.access_token;
        } else {
            console.error('Failed to refresh token.');
            logoutUser(); // Logout jika refresh gagal
        }
    } catch (error) {
        console.error('Error during token refresh:', error);
        logoutUser();
    }
}

// Fungsi untuk logout pengguna
function logoutUser() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    alert('Session expired. Please login again.');
    window.location.href = 'login.html';
}

// Fungsi untuk memeriksa token
async function validateToken() {
    try {
        const response = await fetch('https://backendinfinitywater.hayyalmusafir.com/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('username').textContent = `Welcome, ${userData.username}!`;
        } else if (response.status === 401) {
            // Token tidak valid, coba refresh token
            console.log('Access token invalid or expired. Refreshing token...');
            const newToken = await refreshAccessToken();
            if (newToken) {
                // Token berhasil diperbarui, coba ulangi
                await validateToken();
            }
        } else {
            console.error('Failed to validate token:', response.status);
        }
    } catch (error) {
        console.error('Error validating token:', error);
        logoutUser();
    }
}

// Jalankan validasi token saat halaman dimuat
if (token) {
    await validateToken();
} else {
    logoutUser(); // Token tidak ada, logout
}
});

document.addEventListener('DOMContentLoaded', function () {
const token = localStorage.getItem('access_token');

// Jika token tidak ada, redirect ke halaman login
if (!token) {
    alert('Anda harus login untuk mengakses halaman ini.');
    window.location.href = 'login.html';
}
});

let jumlah_awal = 0;
const maksimalRefresh = 3;

async function refreshToken() {
const accToken = localStorage.getItem('access_token');
try {
// melakukan refrsh ygy
const response = await fetch('https://backendinfinitywater.hayyalmusafir.com/api/auth/refresh', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accToken}`
},
body: JSON.stringify({ 
    access_token: accToken 
})
});

if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
    if (data.access_token) {
    // Simpan token baru ke localStorage
    localStorage.setItem('access_token', data.access_token);
    jumlah_awal++;
    console.log(`Token berhasil diperbarui. Refresh ke-${jumlah_awal}`);
} else {
    throw new Error('Token baru tidak ditemukan dalam respons API.');
}

if (jumlah_awal >= maksimalRefresh) {
    alert('Akses anda telah berakhir, silakan lakukan login ulang.');
    localStorage.removeItem('access_token');
    window.location.href = '../login.html';
}

} catch (error) {
console.error('Gagal memperbarui token:', error);
alert('Gagal memperbarui token. Silakan login ulang.');
localStorage.removeItem('access_token');
window.location.href = '../login.html';
}
}

document.addEventListener('DOMContentLoaded', () => {
console.log('Token Valid')

// Ini untuk menjalankan cd refresh 50 menit, karena timeout awal 1 jam
setInterval(() => {
console.log('Token Tidak Valid, Memperbarui token...');
refreshToken().catch(error => console.error('Gagal memperbarui token:', error));
}, 3000 * 1000);
});

document.addEventListener('DOMContentLoaded', function () {
const username = localStorage.getItem('username'); // Ambil username dari localStorage

// Jika username ada, isi input username_profile dengan data tersebut
if (username) {
document.getElementById('username_profile').value = username;
} else {
console.log("Username tidak ditemukan di localStorage");
}

// Fungsi untuk menangani logout jika diperlukan
document.getElementById('logout').addEventListener('click', function () {
localStorage.removeItem('access_token');
localStorage.removeItem('username');
window.location.href = 'login.html';
});
});
