// === DỮ LIỆU MẪU & KHỞI TẠO LOCALSTORAGE ===
const STORAGE_KEY = "subjects";

const defaultData = [
  {
    id: 1,
    name: "Lập trình C",
    status: "active",
    userId: 1,
  },
  {
    id: 2,
    name: "Lập trình Frontend với ReactJS",
    status: "inactive",
    userId: 1,
  },
  {
    id: 3,
    name: "Lập trình Backend với Spring boot",
    status: "active",
    userId: 1,
  },
  {
    id: 4,
    name: "Lập trình Frontend với VueJS",
    status: "inactive",
    userId: 1,
  },
  {
    id: 5,
    name: "Cấu trúc dữ liệu và giải thuật",
    status: "inactive",
    userId: 1,
  },
  {
    id: 6,
    name: "Phân tích và thiết kế hệ thống",
    status: "inactive",
    userId: 1,
  },
  {
    id: 7,
    name: "Toán cao cấp",
    status: "active",
    userId: 1,
  },
  {
    id: 8,
    name: "Tiếng Anh chuyên ngành",
    status: "inactive",
    userId: 1,
  },
];

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
}

// === STATE ===
let subjects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let currentPage = 1;
const itemsPerPage = 10;
let searchQuery = "";
let filterStatus = "";
let deleteSubjectId = null;
let editSubjectId = null;

// === DOM ELEMENTS ===
const tbody = document.getElementById("subject-table-body");
const paginationContainer = document.getElementById("pagination-container");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

// Modals
const modal = document.getElementById("addModal");
const editModal = document.getElementById("editModal");
const deleteModal = document.getElementById("deleteModal");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");
const deleteSubjectNameLabel = document.getElementById("deleteSubjectName");

const addInputName = document.getElementById("addInputName");
const btnSubmitAdd = document.getElementById("btnSubmitAdd");

const editInputName = document.getElementById("editInputName");
const btnSubmitEdit = document.getElementById("btnSubmitEdit");

addInputName.addEventListener('input', () => {
  addInputName.style.borderColor = "";
  const err = document.getElementById("addNameError");
  if(err) err.style.display = "none";
});

editInputName.addEventListener('input', () => {
  editInputName.style.borderColor = "";
  const err = document.getElementById("editNameError");
  if(err) err.style.display = "none";
});

// === RENDER HÀM ===
function renderTable() {
  let filtered = subjects.filter(
    (subject) => subject.userId === currentUser.id,
  ); // Giả sử userId = 1 là user đang đăng nhập, lọc ra môn học của user đó

  // 1. Lọc theo tên
  filtered = filtered.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 2. Lọc theo trạng thái
  if (filterStatus) {
    filtered = filtered.filter((subject) => subject.status === filterStatus);
  }

  // 4. Phân trang
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  // 5. Hiển thị UI
  tbody.innerHTML = "";
  if (paginatedData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" style="text-align: center;">Không có môn học nào</td></tr>';
  } else {
    let StringHTML = "";
    paginatedData.forEach((subject) => {
      const statusClass = subject.status === "active" ? "active" : "inactive";
      const statusText =
        subject.status === "active" ? "● Đang hoạt động" : "● Ngừng hoạt động";

      StringHTML += `
        <tr>
          <td>${subject.name}</td>
          <td><span class="status-tag ${statusClass}">${statusText}</span></td>
          <td class="actions">
            <i class="fa-regular fa-trash-can delete" data-id="${subject.id}" data-name="${subject.name}"></i>
            <i class="fa-solid fa-pencil edit" data-id="${subject.id}"></i>
          </td>
        </tr>
        `;
    });
    tbody.innerHTML = StringHTML;
  }

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  // Nút Prev
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  prevBtn.disabled = currentPage === 1;
  if (!prevBtn.disabled) {
    prevBtn.onclick = () => {
      currentPage--;
      renderTable();
    };
  } else {
    prevBtn.style.opacity = "0.5";
    prevBtn.style.cursor = "not-allowed";
  }
  paginationContainer.appendChild(prevBtn);

  // Các trang
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.onclick = () => {
      currentPage = i;
      renderTable();
    };
    paginationContainer.appendChild(btn);
  }

  // Nút Next
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  if (!nextBtn.disabled) {
    nextBtn.onclick = () => {
      currentPage++;
      renderTable();
    };
  } else {
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";
  }
  paginationContainer.appendChild(nextBtn);
}

// === SỰ KIỆN ===

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  currentPage = 1;
  renderTable();
});

statusFilter.addEventListener("change", (e) => {
  filterStatus = e.target.value;
  currentPage = 1;
  renderTable();
});

// Sự kiện cho nút xóa & sửa trong bảng (Event Delegation)
tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    deleteSubjectId = parseInt(e.target.dataset.id);
    const subjectName = e.target.dataset.name;
    deleteSubjectNameLabel.innerText = subjectName;
    if (deleteModal) deleteModal.style.display = "flex";
  } else if (e.target.classList.contains("edit")) {
    editSubjectId = parseInt(e.target.dataset.id);
    
    // Đoạn code đơn giản: Tìm môn học cần sửa bằng vòng lặp for
    let subjectToEdit = null;
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id === editSubjectId) {
        subjectToEdit = subjects[i];
        break; // Tìm thấy thì dừng vòng lặp
      }
    }

    if (subjectToEdit !== null) {
      editInputName.value = subjectToEdit.name; // Điền tên cũ vào ô input
      editInputName.style.borderColor = "";
      const err = document.getElementById("editNameError");
      if (err) {
        err.style.display = "none";
        err.innerText = "Tên môn học không được để trống";
      }
      // Check vào ô radio tương ứng trạng thái cũ
      const statusRadio = document.querySelector(`input[name="editStatus"][value="${subjectToEdit.status}"]`);
      if (statusRadio) {
        statusRadio.checked = true;
      }
    }
    if (editModal) editModal.style.display = "flex";
  }
});

// Xác nhận xóa
if (btnConfirmDelete) {
  btnConfirmDelete.addEventListener("click", () => {
    if (deleteSubjectId !== null) {
      subjects = subjects.filter((sub) => sub.id !== deleteSubjectId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
      deleteSubjectId = null;
      renderTable();
      closeModalElement(deleteModal);
    }
  });
}

// === LOGIC CỦA CÁC MODAL === (Giữ lại từ code cũ)
const btnOpen = document.getElementById("btnOpenModal");
const btnClose = document.getElementById("btnCloseModal");
const btnCancel = document.getElementById("btnCancelModal");

const btnCloseEdit = document.getElementById("btnCloseEditModal");
const btnCancelEdit = document.getElementById("btnCancelEditModal");
const btnCancelDelete = document.getElementById("btnCancelDeleteModal");

if (btnOpen) {
  btnOpen.addEventListener("click", () => {
    addInputName.value = "";
    addInputName.style.borderColor = "";
    const err = document.getElementById("addNameError");
    if(err) {
      err.style.display = "none";
      err.innerText = "Tên môn học không được để trống";
    }
    const activeRadio = document.querySelector('input[name="addStatus"][value="active"]');
    if (activeRadio) activeRadio.checked = true;
    if (modal) modal.style.display = "flex";
  });
}

// Logic Thêm mới
if (btnSubmitAdd) {
  btnSubmitAdd.addEventListener("click", () => {
    // 1. Lấy dữ liệu người dùng nhập
    const name = addInputName.value.trim(); // Dùng trim() để xóa dấu cách thừa
    
    // Lấy trạng thái từ radio button vừ chọn
    let status = "active";
    const statusRadio = document.querySelector('input[name="addStatus"]:checked');
    if (statusRadio !== null) {
      status = statusRadio.value;
    }

    // 2. Kiểm tra dữ liệu hợp lệ (Tên không được để trống)
    if (name === "") {
      addInputName.style.borderColor = "#ff4d4f";
      const err = document.getElementById("addNameError");
      if(err) {
        err.innerText = "Tên môn học không được để trống";
        err.style.display = "block";
      }
      showToast("Tên môn học không được để trống!", "error");
      return; // Cắt hàm tại đây, không chạy code phía dưới nữa
    }

    // Dùng vòng lặp for đơn giản để kiểm tra xem có bị trùng tên chưa
    let isDuplicate = false;
    for (let i = 0; i < subjects.length; i++) {
      // Đưa tên về chữ thường rồi so sánh để không bị lỗi do viết hoa khác nhau
      if (subjects[i].name.toLowerCase() === name.toLowerCase()) {
        isDuplicate = true;
        break;
      }
    }

    // Nếu tên bị trùng thì cảnh báo và ngừng hàm lại
    if (isDuplicate === true) {
      addInputName.style.borderColor = "#ff4d4f";
      const err = document.getElementById("addNameError");
      if(err) {
        err.innerText = "Tên môn học không được phép trùng!";
        err.style.display = "block";
      }
      showToast("Tên môn học không được phép trùng!", "error");
      return;
    }

    // 3. Xử lý tạo ID mới cho môn học
    // Tìm ID lớn nhất trong mảng bằng vòng lặp, sau đó cộng thêm 1
    let maxId = 0;
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id > maxId) {
        maxId = subjects[i].id;
      }
    }
    const newId = maxId + 1;

    // 4. Gom dữ liệu lại thành 1 đối tượng Object mới
    const newSubject = {
      id: newId,
      name: name,
      status: status,
      userId: currentUser.id,
    };

    // 5. Thêm object đó vào danh sách lưu trữ
    subjects.unshift(newSubject); // Thêm lên đầu danh sách
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects)); // Lưu xuống Local Storage
    
    // 6. Xử lý sau khi lưu (tắt form, báo thành công, tải lại dữ liệu)
    closeModalElement(modal);
    renderTable();
    showToast("Thêm mới thành công!", "success");
  });
}

// Logic Cập nhật (Sửa môn học) cho người mới
if (btnSubmitEdit) {
  btnSubmitEdit.addEventListener("click", () => {
    // 1. Lấy giá trị mới
    const name = editInputName.value.trim();
    
    let status = "active";
    const statusRadio = document.querySelector('input[name="editStatus"]:checked');
    if (statusRadio !== null) {
      status = statusRadio.value;
    }

    // 2. Validate
    if (name === "") {
      editInputName.style.borderColor = "#ff4d4f";
      const err = document.getElementById("editNameError");
      if(err) {
        err.innerText = "Tên môn học không được để trống";
        err.style.display = "block";
      }
      showToast("Tên môn học không được để trống!", "error");
      return;
    }

    // Kiểm tra tên có bị trùng với MÔN KHÁC (khác với ID đang sửa) hay không
    let isDuplicate = false;
    for (let i = 0; i < subjects.length; i++) {
      let currentSub = subjects[i];
      // Nếu môn này KHÔNG phải là môn đang sửa, mà lại có tên giống cái tên mới nhập -> Bị trùng
      if (currentSub.id !== editSubjectId) {
        if (currentSub.name.toLowerCase() === name.toLowerCase()) {
          isDuplicate = true;
          break;
        }
      }
    }

    if (isDuplicate === true) {
      editInputName.style.borderColor = "#ff4d4f";
      const err = document.getElementById("editNameError");
      if(err) {
        err.innerText = "Tên môn học không được phép trùng!";
        err.style.display = "block";
      }
      showToast("Tên môn học không được phép trùng!", "error");
      return;
    }

    // 3. Tìm môn học trong danh sách để cập nhật dữ liệu lại
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id === editSubjectId) {
        subjects[i].name = name;
        subjects[i].status = status;
        break; // Sửa xong thì thoát ra
      }
    }

    // 4. Lưu, báo thành công và load lại bảng
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    closeModalElement(editModal);
    renderTable();
    showToast("Cập nhật thành công!", "success");
  });
}

function closeModalElement(m) {
  if (m) m.style.display = "none";
}

if (btnClose)
  btnClose.addEventListener("click", () => closeModalElement(modal));
if (btnCancel)
  btnCancel.addEventListener("click", () => closeModalElement(modal));

if (btnCloseEdit)
  btnCloseEdit.addEventListener("click", () => closeModalElement(editModal));
if (btnCancelEdit)
  btnCancelEdit.addEventListener("click", () => closeModalElement(editModal));

if (btnCancelDelete)
  btnCancelDelete.addEventListener("click", () =>
    closeModalElement(deleteModal),
  );

// Đóng modal khi click ra ngoài
window.addEventListener("click", (event) => {
  if (event.target === modal) closeModalElement(modal);
  if (event.target === editModal) closeModalElement(editModal);
  if (event.target === deleteModal) closeModalElement(deleteModal);
});

// Khởi tạo ban đầu
renderTable();

// === TOAST NOTIFICATION ===
function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "fa-check-circle";
  if (type === "error") icon = "fa-circle-xmark";
  else if (type === "warning") icon = "fa-circle-exclamation";

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  
  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Remove toast after 3s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
