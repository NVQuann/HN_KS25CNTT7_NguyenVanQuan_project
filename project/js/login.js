if (localStorage.getItem("currentUser")) {
  window.location.href = "./mainpage.html";
}

const btnLogin = document.querySelector(".login-button");

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  document
    .querySelectorAll(".error-msg")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".input")
    .forEach((el) => el.classList.remove("error-border"));

  let isValid = true;

  const emailInput = document.querySelector("#Email");
  const passwordInput = document.querySelector("#Password");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate Email
  if (!email) {
    showError(emailInput, "#EmailError", "Email không được để trống");
    isValid = false;
  }

  // Validate Password
  if (!password) {
    showError(passwordInput, "#PasswordError", "Mật khẩu không được để trống");
    isValid = false;
  }

  if (isValid) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!foundUser) {
      showError(emailInput, "#EmailError", "Email hoặc Mật khẩu không đúng");
      showError(
        passwordInput,
        "#PasswordError",
        "Email hoặc Mật khẩu không đúng",
      );
      showToast("Đăng nhập thất bại!", "#e74c3c");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));

    showToast("Đăng nhập thành công!", "#4caf50");

    setTimeout(() => {
      window.location.href = "./mainpage.html";
    }, 1500);
  }
});

function showError(inputElement, errorSelector, message) {
  if (inputElement) {
    inputElement.classList.add("error-border");
  }
  const errorEl = document.querySelector(errorSelector);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }
}

function showToast(message, color = "#4caf50") {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.style.backgroundColor = color;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
}
