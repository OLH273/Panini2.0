const form = document.getElementById("voucher-form");
const eligibilityMessage = document.getElementById("eligibility-message");
const voucherStudent = document.getElementById("voucher-student");
const voucherCommendations = document.getElementById("voucher-commendations");
const voucherDate = document.getElementById("voucher-date");
const printButton = document.getElementById("print-voucher");

const STORAGE_KEY = "panini_vouchers";
const MIN_COMMENDATIONS = 5;

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

const saveVouchers = (vouchers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
};

const updateEligibility = (commendations) => {
  if (commendations >= MIN_COMMENDATIONS) {
    eligibilityMessage.textContent =
      "Eligible! You can issue a cafe voucher for this student.";
    eligibilityMessage.classList.add("eligible");
    return true;
  }
  eligibilityMessage.textContent =
    "Enter 5 or more commendations to unlock voucher issuing.";
  eligibilityMessage.classList.remove("eligible");
  return false;
};

form.addEventListener("input", (event) => {
  if (event.target.name !== "commendations") {
    return;
  }
  const value = Number(event.target.value || 0);
  const eligible = updateEligibility(value);
  printButton.disabled = !eligible;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = String(formData.get("studentName") || "").trim();
  const commendations = Number(formData.get("commendations"));

  if (!name) {
    form.querySelector("input[name='studentName']").focus();
    return;
  }

  if (commendations < MIN_COMMENDATIONS) {
    updateEligibility(commendations);
    return;
  }

  const issuedAt = new Date();
  const voucher = {
    id: crypto.randomUUID(),
    name,
    commendations,
    amount: 2.9,
    issuedAt: issuedAt.toISOString(),
  };

  const vouchers = loadVouchers();
  vouchers.unshift(voucher);
  saveVouchers(vouchers);

  voucherStudent.textContent = voucher.name;
  voucherCommendations.textContent = String(voucher.commendations);
  voucherDate.textContent = issuedAt.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  printButton.disabled = false;
  form.reset();
  updateEligibility(0);
});

printButton.addEventListener("click", () => {
  window.print();
});

updateEligibility(0);
printButton.disabled = true;
