const table = document.getElementById("voucher-table");
const voucherCount = document.getElementById("voucher-count");
const voucherEmpty = document.getElementById("voucher-empty");

const STORAGE_KEY = "panini_vouchers";

const loadVouchers = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Unable to read vouchers", error);
    return [];
  }
};

const render = () => {
  const vouchers = loadVouchers();
  voucherCount.textContent = `${vouchers.length} voucher${
    vouchers.length === 1 ? "" : "s"
  }`;

  if (vouchers.length === 0) {
    voucherEmpty.style.display = "block";
    return;
  }

  voucherEmpty.style.display = "none";

  vouchers.forEach((voucher) => {
    const row = document.createElement("div");
    row.className = "table-row";

    const issuedAt = new Date(voucher.issuedAt).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    row.innerHTML = `
      <span>${voucher.name}</span>
      <span>${voucher.commendations}</span>
      <span>${issuedAt}</span>
      <span>£${voucher.amount.toFixed(2)}</span>
    `;

    table.appendChild(row);
  });
};

render();
