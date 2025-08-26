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
  const waktu = document.getElementById("waktu").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);

  if (!tanggal || !waktu || !deskripsi || !jumlah) {
    alert("Lengkapi semua data transaksi!");
    return;
  }

  const data = { tipe, tanggal, waktu, deskripsi, jumlah };
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
  transaksi.forEach((t) => {
    const row = `
      <tr>
        <td class="border p-2">${t.tanggal}</td>
        <td class="border p-2">${t.waktu}</td>
        <td class="border p-2">${t.deskripsi}</td>
        <td class="border p-2 ${t.tipe === "pemasukan" ? "text-green-600" : "text-red-600"}">
          ${t.tipe === "pemasukan" ? "+" : "-"} Rp ${t.jumlah.toLocaleString("id-ID")}
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
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

flatpickr("#tanggal", {
  dateFormat: "Y-m-d"
});
flatpickr("#waktu", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "H:i"
});