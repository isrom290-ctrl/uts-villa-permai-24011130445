/* ==========================================
   DATA VILA (Disinkronkan dengan assets/images/)
   ================================---------- */
const dataVila = [
    {
        id: "vila-01",
        nama: "Vila Permai 01",
        tipe: "Deluxe Family Suite (3 Kamar Tidur)",
        lokasi: "Jl. Raya Puncak Pass, Bogor",
        hargaPerMalam: 1250000,
        fasilitas: "3 Kamar Tidur, Balkon Pemandangan Gunung, Wi-Fi, Dapur Lengkap, Area BBQ",
        status: "Tersedia",
        gambar: "assets/images/villa-1.jpg" // Mengarah ke villa-1.jpg
    },
    {
        id: "vila-02",
        nama: "Vila Permai 02",
        tipe: "Luxury Mountain View (4 Kamar Tidur)",
        lokasi: "Kawasan Cipanas, Puncak, Bogor",
        hargaPerMalam: 1850000,
        fasilitas: "4 Kamar Tidur, Heated Pool, Balkon Panorama, Karaoke, Water Heater",
        status: "Tersedia",
        gambar: "assets/images/villa-2.jpg" // Mengarah ke villa-2.jpg
    },
    {
        id: "vila-03",
        nama: "Vila Permai 03",
        tipe: "Cozy Cottage (2 Kamar Tidur)",
        lokasi: "Cisarua, Puncak, Bogor",
        hargaPerMalam: 850000,
        fasilitas: "2 Kamar Tidur, Taman Luar Ruangan, Wi-Fi, Alat BBQ, TV Layar Datar",
        status: "Tersedia",
        gambar: "assets/images/villa-3.jpg" // Mengarah ke villa-3.jpg
    }
];

/* ==========================================
   SELEKSI ELEMEN DOM
   ================================---------- */
const villaListContainer = document.getElementById('villaListContainer');
const pilihanVilaSelect = document.getElementById('pilihanVilaSelect');
const bookingForm = document.getElementById('bookingForm');
const namaTamuInput = document.getElementById('namaTamu');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const jumlahTamuInput = document.getElementById('jumlahTamu');
const btnCekKetersediaan = document.getElementById('btnCekKetersediaan');
const formMessage = document.getElementById('formMessage');

// Elemen Ringkasan Biaya
const sumVilaName = document.getElementById('sumVilaName');
const sumHargaMalam = document.getElementById('sumHargaMalam');
const sumJumlahMalam = document.getElementById('sumJumlahMalam');
const sumJumlahTamu = document.getElementById('sumJumlahTamu');
const sumTotalHarga = document.getElementById('sumTotalHarga');

/* ==========================================
   1. RENDER KARTU VILA DINAMIS & DROPDOWN
   ================================---------- */
function renderVilaCards() {
    villaListContainer.innerHTML = '';

    dataVila.forEach(vila => {
        const articleCard = document.createElement('article');
        articleCard.className = 'villa-card';

        articleCard.innerHTML = `
            <img src="${vila.gambar}" alt="${vila.nama}">
            <div class="villa-card-body">
                <h3>${vila.nama}</h3>
                <p class="villa-location">📍 ${vila.lokasi}</p>
                <p class="villa-price">Rp ${vila.hargaPerMalam.toLocaleString('id-ID')} <span style="font-size: 0.8rem; font-weight: normal; color: #666;">/ malam</span></p>
                <p class="villa-facilities">✨ <strong>Fasilitas:</strong> ${vila.fasilitas}</p>
                <span class="villa-status">${vila.status}</span>
            </div>
        `;

        villaListContainer.appendChild(articleCard);
    });
}

function populateDropdown() {
    pilihanVilaSelect.innerHTML = '<option value="">-- Pilih Vila --</option>';
    
    dataVila.forEach(vila => {
        const option = document.createElement('option');
        option.value = vila.id;
        option.textContent = `${vila.nama} - Rp ${vila.hargaPerMalam.toLocaleString('id-ID')} /malam`;
        pilihanVilaSelect.appendChild(option);
    });
}

/* ==========================================
   2. PERHITUNGAN OTOMATIS & RINGKASAN BIAYA
   ================================---------- */
function hitungTotalHarga() {
    const selectedId = pilihanVilaSelect.value;
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    const jumlahTamu = parseInt(jumlahTamuInput.value) || 0;

    if (!selectedId) {
        sumVilaName.textContent = '-';
        sumHargaMalam.textContent = 'Rp 0';
        sumJumlahMalam.textContent = '0 Malam';
        sumJumlahTamu.textContent = `${jumlahTamu} Orang`;
        sumTotalHarga.textContent = 'Rp 0';
        return;
    }

    const vilaObj = dataVila.find(v => v.id === selectedId);
    let jumlahMalam = 0;

    if (checkInInput.value && checkOutInput.value && checkOutDate > checkInDate) {
        const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
        jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
    }

    const totalBiaya = (vilaObj ? vilaObj.hargaPerMalam : 0) * jumlahMalam;

    sumVilaName.textContent = vilaObj.nama;
    sumHargaMalam.textContent = `Rp ${vilaObj.hargaPerMalam.toLocaleString('id-ID')}`;
    sumJumlahMalam.textContent = `${jumlahMalam} Malam`;
    sumJumlahTamu.textContent = `${jumlahTamu} Orang`;
    sumTotalHarga.textContent = `Rp ${totalBiaya.toLocaleString('id-ID')}`;
}

[pilihanVilaSelect, checkInInput, checkOutInput, jumlahTamuInput].forEach(element => {
    element.addEventListener('change', hitungTotalHarga);
});

/* ==========================================
   3. VALIDASI FORMULIR & PENANGANAN RESERVASI
   ================================---------- */
function validasiForm() {
    const namaTamu = namaTamuInput.value.trim();
    const checkInVal = checkInInput.value;
    const checkOutVal = checkOutInput.value;
    const jumlahTamu = parseInt(jumlahTamuInput.value);
    const pilihanVila = pilihanVilaSelect.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        if (!namaTamu) {
            throw new Error("Nama tamu wajib diisi.");
        }
        if (!checkInVal || !checkOutVal) {
            throw new Error("Tanggal check-in dan check-out wajib diisi.");
        }

        const checkInDate = new Date(checkInVal);
        const checkOutDate = new Date(checkOutVal);

        if (checkInDate < today) {
            throw new Error("Tanggal check-in tidak boleh berada di masa lalu.");
        }
        if (checkOutDate <= checkInDate) {
            throw new Error("Tanggal check-out harus setelah tanggal check-in.");
        }
        if (isNaN(jumlahTamu) || jumlahTamu < 1 || jumlahTamu > 10) {
            throw new Error("Jumlah tamu harus antara 1 sampai 10 orang.");
        }
        if (!pilihanVila) {
            throw new Error("Silakan pilih unit vila.");
        }

        return true;
    } catch (error) {
        formMessage.style.color = '#D9534F';
        formMessage.textContent = `⚠️ Perhatian: ${error.message}`;
        return false;
    }
}

btnCekKetersediaan.addEventListener('click', () => {
    formMessage.textContent = '';
    if (validasiForm()) {
        formMessage.style.color = '#2E7D32';
        formMessage.textContent = '✅ Vila tersedia! Silakan klik "Pesan Sekarang" untuk melanjutkan.';
    }
});

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';

    if (validasiForm()) {
        const selectedVilaObj = dataVila.find(v => v.id === pilihanVilaSelect.value);
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);
        const selisihWaktu = checkOutDate.getTime() - checkInDate.getTime();
        const jumlahMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
        const totalHarga = selectedVilaObj.hargaPerMalam * jumlahMalam;

        const pesananData = {
            namaTamu: namaTamuInput.value.trim(),
            checkIn: checkInInput.value,
            checkOut: checkOutInput.value,
            jumlahTamu: jumlahTamuInput.value,
            vilaNama: selectedVilaObj.nama,
            totalHarga: totalHarga,
            waktuPesan: new Date().toLocaleString('id-ID')
        };

        // Simpan ke localStorage
        try {
            localStorage.setItem('pesananTerakhirVilaPermai', JSON.stringify(pesananData));
            
            formMessage.style.color = '#1B4D3E';
            formMessage.textContent = `🎉 Terima kasih, ${pesananData.namaTamu}! Pesanan untuk ${pesananData.vilaNama} berhasil disimpan di peramban (localStorage).`;
            
            bookingForm.reset();
            hitungTotalHarga(); // Reset ringkasan
        } catch (err) {
            console.error("Gagal menyimpan ke localStorage:", err);
            formMessage.style.color = '#D9534F';
            formMessage.textContent = '⚠️ Maaf, gagal menyimpan pesanan ke peramban.';
        }
    }
});

/* ==========================================
   4. INISIALISASI SAAT HALAMAN DIMUAT
   ================================---------- */
window.addEventListener('DOMContentLoaded', () => {
    renderVilaCards();
    populateDropdown();

    // Mencoba memuat nama tamu terakhir dari localStorage
    try {
        const savedData = localStorage.getItem('pesananTerakhirVilaPermai');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData && parsedData.namaTamu) {
                namaTamuInput.value = parsedData.namaTamu;
            }
        }
    } catch (err) {
        console.error("Gagal membaca localStorage:", err);
    }
});