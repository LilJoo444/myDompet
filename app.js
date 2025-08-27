let saldo = 0;
let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

// ==============================
// Fungsi umum
// ==============================
function updateSaldo() {
  saldo = parseInt(localStorage.getItem("saldo")) || 0;
  const elSaldo = document.getElementById("saldoTersisa");
  if (elSaldo) {
    elSaldo.innerText = "Rp " + saldo.toLocaleString("id-ID");
  }
}

function renderTransaksi() {
  const tbody = document.getElementById("daftarTransaksi");
  if (!tbody) return; // kalau bukan di halaman riwayat, jangan jalanin

  tbody.innerHTML = "";

  transaksi.forEach((t, index) => {
    const row = `
      <tr>
        <td class="border p-2 text-center">${t.tanggal}</td>
        <td class="border p-2 text-center">${t.deskripsi}</td>
        <td class="border p-2 ${t.tipe === "pemasukan" ? "text-green-600" : "text-red-600"} text-center">
          ${t.tipe === "pemasukan" ? "+" : "-"} Rp ${t.jumlah.toLocaleString("id-ID")}
        </td>
        <td class="border p-2 text-center">
          <button onclick="hapusTransaksi(${index})" 
            class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
            Hapus
          </button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function hapusTransaksi(index) {
  const t = transaksi[index];

  // Update saldo sesuai jenis transaksi
  if (t.tipe === "pemasukan") {
    saldo -= t.jumlah;
  } else {
    saldo += t.jumlah;
  }

  transaksi.splice(index, 1);
  localStorage.setItem("transaksi", JSON.stringify(transaksi));
  localStorage.setItem("saldo", saldo);

  updateSaldo();
  renderTransaksi();
}

function resetSaldo() {
  if (confirm("Apakah kamu yakin ingin reset saldo dan transaksi?")) {
    localStorage.removeItem("saldo");
    localStorage.removeItem("transaksi");
    window.location.href = "index.html"; // balik ke awal
  }
}

// ==============================
// Khusus halaman index.html
// ==============================
function setSaldoAwal() {
  const saldoInput = document.getElementById("saldoAwal").value;
  if (saldoInput === "" || saldoInput <= 0) {
    alert("Masukkan saldo awal yang valid!");
    return;
  }
  saldo = parseInt(saldoInput);
  localStorage.setItem("saldo", saldo);

  document.getElementById("saldo-container").classList.add("hidden");
  document.getElementById("info-saldo").classList.remove("hidden");
  document.getElementById("formTransaksi").classList.remove("hidden");

  updateSaldo();
}

// Tambah transaksi (hanya ada di index.html)
const formTransaksi = document.getElementById("formTransaksi");
if (formTransaksi) {
  formTransaksi.addEventListener("submit", function (e) {
    e.preventDefault();
    const tipe = document.getElementById("tipe").value;
    const tanggal = document.getElementById("tanggal").value;
    const deskripsi = document.getElementById("deskripsi").value;
    const jumlah = parseInt(document.getElementById("jumlah").value);

    if (!tanggal || !deskripsi || !jumlah) {
      alert("Lengkapi semua data transaksi!");
      return;
    }

    const data = { tipe, tanggal, deskripsi, jumlah };
    transaksi.push(data);
    localStorage.setItem("transaksi", JSON.stringify(transaksi));

    // Update saldo
    if (tipe === "pemasukan") {
      saldo += jumlah;
    } else {
      saldo -= jumlah;
    }
    localStorage.setItem("saldo", saldo);

    updateSaldo();
    this.reset();
  });
}

// ==============================
// Load awal (beda halaman, beda aksi)
// ==============================
window.onload = () => {
  saldo = parseInt(localStorage.getItem("saldo")) || 0;

  // Kalau di index.html
  if (document.getElementById("saldo-container")) {
    if (saldo > 0) {
      document.getElementById("saldo-container").classList.add("hidden");
      document.getElementById("info-saldo").classList.remove("hidden");
      document.getElementById("formTransaksi").classList.remove("hidden");
      updateSaldo();
    }
  }

  // Kalau di riwayat.html
  if (document.getElementById("daftarTransaksi")) {
    updateSaldo();
    renderTransaksi();
  }
};
