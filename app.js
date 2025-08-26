let saldo = 0;
let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

// Set saldo awal
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
  document.getElementById("riwayat").classList.remove("hidden");
  updateSaldo();
  renderTransaksi();
}

// Update saldo
function updateSaldo() {
  saldo = parseInt(localStorage.getItem("saldo")) || 0;
  document.getElementById("saldoTersisa").innerText = "Rp " + saldo.toLocaleString("id-ID");
}

// Tambah transaksi
document.getElementById("formTransaksi").addEventListener("submit", function (e) {
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
  renderTransaksi();
  this.reset();
});

// Render daftar transaksi
function renderTransaksi() {
  const tbody = document.getElementById("daftarTransaksi");
  tbody.innerHTML = "";

  transaksi.forEach((t, index) => {
    const row = `
      <tr>
        <td class="border p-2">${t.tanggal}</td>
        <td class="border p-2">${t.deskripsi}</td>
        <td class="border p-2 ${t.tipe === "pemasukan" ? "text-green-600" : "text-red-600"}">
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

// Fungsi hapus transaksi
function hapusTransaksi(index) {
  const t = transaksi[index];

  // Update saldo sesuai jenis transaksi
  if (t.tipe === "pemasukan") {
    saldo -= t.jumlah;
  } else {
    saldo += t.jumlah;
  }

  // Hapus dari array & simpan ulang
  transaksi.splice(index, 1);
  localStorage.setItem("transaksi", JSON.stringify(transaksi));
  localStorage.setItem("saldo", saldo);

  // Refresh tampilan
  updateSaldo();
  renderTransaksi();
}

// Load awal
window.onload = () => {
  saldo = parseInt(localStorage.getItem("saldo")) || 0;
  if (saldo > 0) {
    document.getElementById("saldo-container").classList.add("hidden");
    document.getElementById("info-saldo").classList.remove("hidden");
    document.getElementById("formTransaksi").classList.remove("hidden");
    document.getElementById("riwayat").classList.remove("hidden");
    updateSaldo();
    renderTransaksi();
  }
}

function resetSaldo() {
  if (confirm("Apakah kamu yakin ingin reset saldo dan transaksi?")) {
    localStorage.removeItem("saldo");
    localStorage.removeItem("transaksi");
    window.location.reload(); // reload agar kembali ke halaman saldo awal
  }
};

