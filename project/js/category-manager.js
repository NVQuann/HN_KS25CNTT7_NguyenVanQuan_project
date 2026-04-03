const modal = document.getElementById("addModal");
const btnOpen = document.getElementById("btnOpenModal");
const btnClose = document.getElementById("btnCloseModal");
const btnCancel = document.getElementById("btnCancelModal");

if (btnOpen && modal) {
  btnOpen.addEventListener("click", function () {
    modal.style.display = "flex";
  });
}

const closeModal = function () {
  if (modal) modal.style.display = "none";
};

if (btnClose) btnClose.addEventListener("click", closeModal);
if (btnCancel) btnCancel.addEventListener("click", closeModal);

// === CẬP NHẬT ===
const editModal = document.getElementById("editModal");
const btnCloseEdit = document.getElementById("btnCloseEditModal");
const btnCancelEdit = document.getElementById("btnCancelEditModal");

// Lấy tất cả các nút hình bút chì trong bảng
const editIcons = document.querySelectorAll(".fa-pencil.edit");

editIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    if (editModal) {
      editModal.style.display = "flex";
    }
  });
});

const closeEditModal = function () {
  if (editModal) {
    editModal.style.display = "none";
  }
};

if (btnCloseEdit) btnCloseEdit.addEventListener("click", closeEditModal);
if (btnCancelEdit) btnCancelEdit.addEventListener("click", closeEditModal);

// === XÓA ===
const deleteModal = document.getElementById("deleteModal");
const btnCancelDelete = document.getElementById("btnCancelDeleteModal");
const deleteSubjectNameLabel = document.getElementById("deleteSubjectName");

const deleteIcons = document.querySelectorAll(".fa-trash-can.delete");

deleteIcons.forEach((icon) => {
  icon.addEventListener("click", function (e) {
    const tr = e.target.closest("tr");
    if (!tr) return;

    const tdList = tr.querySelectorAll("td");
    if (tdList.length > 0) {
      // Cập nhật tên môn học sẽ bị xóa vào dòng tin nhắn
      if (deleteSubjectNameLabel) {
        deleteSubjectNameLabel.innerText = tdList[0].innerText.trim();
      }
    }

    if (deleteModal) {
      deleteModal.style.display = "flex";
    }
  });
});

const closeDeleteModal = function () {
  if (deleteModal) {
    deleteModal.style.display = "none";
  }
};

if (btnCancelDelete)
  btnCancelDelete.addEventListener("click", closeDeleteModal);

// Đóng modal tự động khi click ra ngoài overlay
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeModal();
  }
  if (event.target === editModal) {
    closeEditModal();
  }
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
});
