const scriptURL = "const scriptURL = "https://script.google.com/macros/s/AKfycbwtr3jTg2piXcq7UGm7l-i8cXOndTlSCYwlsyTJ-xDoy55cR6Ijw1YCzmcLNiOJtIiP/exec";
";
let globalData = {};

function cariData() {
  const nik = document.getElementById("nikInput").value.trim();
  if (!nik) {
    alert("Silakan masukkan NIK terlebih dahulu.");
    return;
  }

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({ mode: "get", NIK: nik }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === "success") {
      globalData = res.data;
      tampilkanForm(res.data);
    } else {
      document.getElementById("formGuru").style.display = "none";
      document.getElementById("status").innerText = "❌ NIK tidak ditemukan. Coba lagi.";
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById("status").innerText = "❌ Gagal mengambil data. Cek koneksi.";
  });
}

function tampilkanForm(data) {
  const formFields = document.getElementById("formFields");
  formFields.innerHTML = "";

  for (const key in data) {
    formFields.innerHTML += `
      <label>${key}</label>
      <input type="text" name="${key}" value="${data[key] || ""}">
    `;
  }

  document.getElementById("formGuru").style.display = "block";
  document.getElementById("status").innerText = "";
}

function simpanData(event) {
  event.preventDefault();
  const inputs = document.querySelectorAll("#formGuru input");
  const data = { mode: "update", NIK: globalData["NIK"] };

  inputs.forEach(input => {
    data[input.name] = input.value;
  });

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === "updated") {
      document.getElementById("status").innerText = "✅ Data berhasil diperbarui.";
    } else {
      document.getElementById("status").innerText = "❌ Gagal memperbarui data.";
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById("status").innerText = "❌ Gagal mengirim data.";
  });
}
