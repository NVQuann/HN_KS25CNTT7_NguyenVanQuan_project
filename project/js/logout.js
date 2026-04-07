// 1. Chặn người dùng nếu chưa đăng nhập
let user = localStorage.getItem("currentUser");
if (user == null) {
  window.location.href = "./login.html";
}

// 2. Lấy các phần tử HTML cần dùng
let avatarBtn = document.querySelector(".navbar__icon-btn");
// Nếu trên trang khác không dùng class .navbar__icon-btn thì lấy class .user-avatar
if (avatarBtn == null) {
  avatarBtn = document.querySelector(".user-avatar");
}

let userDropdown = document.getElementById("user-dropdown");
let btnShowLogout = document.getElementById("btn-show-logout");

let logoutOverlay = document.getElementById("logout-overlay");
let btnCancelLogout = document.getElementById("btn-cancel-logout");
let btnConfirmLogout = document.getElementById("btn-confirm-logout");

// 3. Click vào avatar để BẬT / TẮT menu nhỏ bên dưới
if (avatarBtn != null) {
  // Thêm con trỏ chuột dạng bàn tay
  avatarBtn.style.cursor = "pointer";

  avatarBtn.onclick = function (event) {
    // Ngăn chặn sự kiện click lan ra ngoài
    event.stopPropagation();

    if (userDropdown.style.display == "none") {
      userDropdown.style.display = "block";
    } else {
      userDropdown.style.display = "none";
    }
  };
}

// 4. Bấm ra ngoài màn hình thì ẩn menu nhỏ đi
document.onclick = function () {
  if (userDropdown != null) {
    userDropdown.style.display = "none";
  }
};

// 5. Click nút Đăng xuất (màu đỏ) trong menu nhỏ -> Hiện hộp thoại to lên giữa màn hình
if (btnShowLogout != null) {
  btnShowLogout.onclick = function () {
    logoutOverlay.style.display = "flex";
    userDropdown.style.display = "none";
  };
}

// 6. Click nút Hủy trong hộp thoại to -> Tắt hộp thoại to
if (btnCancelLogout != null) {
  btnCancelLogout.onclick = function () {
    logoutOverlay.style.display = "none";
  };
}

// 7. Click nút Đăng xuất trong hộp thoại to -> Xóa localStorage, quay về trang đăng nhập
if (btnConfirmLogout != null) {
  btnConfirmLogout.onclick = function () {
    localStorage.removeItem("currentUser");

    window.location.href = "./login.html";
  };
}
