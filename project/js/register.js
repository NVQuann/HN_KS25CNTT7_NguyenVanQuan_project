// Redirect to dashboard if already logged in
if (localStorage.getItem("currentUser")) {
  window.location.href = "./mainpage.html";
}

const inputLink = document.getElementById("input-link");
inputLink.addEventListener("click", (e) => {
  e.preventDefault();
});

const btnRegister = document.querySelector("#button");

btnRegister.addEventListener("click", function (e) {
  e.preventDefault();

  // Reset errors
  document
    .querySelectorAll(".error-msg")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".input, .checkbox-label")
    .forEach((el) => el.classList.remove("error-border"));

  let isValid = true;

  const lastNameInput = document.querySelector("#LastName");
  const firstNameInput = document.querySelector("#FirstName");
  const emailInput = document.querySelector("#Email");
  const passwordInput = document.querySelector("#Password");
  const confirmPasswordInput = document.querySelector("#ConfirmPassword");
  const agreeTermsInput = document.querySelector("#AgreeTerms");

  const lastName = lastNameInput.value.trim();
  const firstName = firstNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();
  const agreeTerms = agreeTermsInput.checked;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Hàm để lấy ID người dùng tiếp theo (giả sử ID là số nguyên tăng dần)
  const nextUserId = (users) => {
    if (users.length === 0) return 1;
    return Math.max(...users.map((u) => u.id)) + 1;
  };

  // Validate LastName & FirstName
  if (!lastName) {
    showError(
      lastNameInput,
      "#LastNameError",
      "Họ và tên đệm không được để trống",
    );
    isValid = false;
  }
  if (!firstName) {
    showError(firstNameInput, "#FirstNameError", "Tên không được để trống");
    isValid = false;
  }

  // Validate Email
  if (!email) {
    showError(emailInput, "#EmailError", "Email không được để trống");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError(emailInput, "#EmailError", "Email phải đúng định dạng");
    isValid = false;
  }

  // Validate Password
  if (!password) {
    showError(passwordInput, "#PasswordError", "Mật khẩu không được để trống");
    isValid = false;
  } else if (password.length < 8) {
    showError(passwordInput, "#PasswordError", "Mật khẩu tối thiểu 8 ký tự");
    isValid = false;
  }

  // Validate Confirm Password
  if (!confirmPassword) {
    showError(
      confirmPasswordInput,
      "#ConfirmPasswordError",
      "Mật khẩu xác nhận không được để trống",
    );
    isValid = false;
  } else if (password !== confirmPassword) {
    showError(
      confirmPasswordInput,
      "#ConfirmPasswordError",
      "Mật khẩu không trùng khớp",
    );
    isValid = false;
  }

  // Validate Checkbox
  if (!agreeTerms) {
    showError(
      document.querySelector(".checkbox-label"),
      "#AgreeTermsError",
      "Vui lòng xác nhận đăng ký",
    );
    isValid = false;
  }

  if (isValid) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = users.some((u) => u.email === email);
    if (userExists) {
      showError(emailInput, "#EmailError", "Email này đã được đăng ký");
      return;
    }

    const newUser = {
      id: nextUserId(users),
      lastName,
      firstName,
      email,
      password,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showToast("Đăng ký thành công! Đang chuyển hướng...");

    // Lưu trạng thái đăng ký thành công nếu cần dùng ở trang đăng nhập
    localStorage.setItem("registerSuccess", "true");

    setTimeout(() => {
      window.location.href = "./login.html";
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

function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
}
