// Protect dashboard routes
if (!localStorage.getItem("currentUser")) {
    window.location.href = "./login.html";
}

document.addEventListener("DOMContentLoaded", function() {
    const avatarBtn = document.querySelector(".navbar__icon-btn[aria-label='Tài khoản'], .user-avatar");
    
    if (avatarBtn) {
        // Create dropdown menu if not exists
        let userMenu = document.getElementById("user-dropdown");
        if (!userMenu) {
            userMenu = document.createElement("div");
            userMenu.id = "user-dropdown";
            userMenu.style.display = "none";
            userMenu.style.position = "absolute";
            userMenu.style.backgroundColor = "#fff";
            userMenu.style.border = "1px solid #e2e8f0";
            userMenu.style.borderRadius = "8px";
            userMenu.style.padding = "5px";
            userMenu.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            userMenu.style.zIndex = "1000";
            userMenu.style.minWidth = "120px";
            
            const logoutBtn = document.createElement("button");
            logoutBtn.innerHTML = "<i class=\"fa-solid fa-right-from-bracket\" style=\"margin-right: 8px;\"></i>Đăng xuất";
            logoutBtn.style.background = "none";
            logoutBtn.style.border = "none";
            logoutBtn.style.color = "#ef4444";
            logoutBtn.style.fontWeight = "500";
            logoutBtn.style.cursor = "pointer";
            logoutBtn.style.padding = "10px";
            logoutBtn.style.width = "100%";
            logoutBtn.style.textAlign = "left";
            logoutBtn.style.fontSize = "14px";
            logoutBtn.style.borderRadius = "4px";
            
            logoutBtn.addEventListener("mouseover", function() {
                logoutBtn.style.backgroundColor = "#fee2e2";
            });
            logoutBtn.addEventListener("mouseout", function() {
                logoutBtn.style.backgroundColor = "transparent";
            });
            
            logoutBtn.addEventListener("click", function() {
                showLogoutModal();
            });
            
            userMenu.appendChild(logoutBtn);
            document.body.appendChild(userMenu);
        }

        avatarBtn.style.cursor = "pointer";
        avatarBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            if (userMenu.style.display === "none") {
                userMenu.style.display = "block";
                
                // Position it relative to the avatar button
                const rect = avatarBtn.getBoundingClientRect();
                userMenu.style.top = (rect.bottom + 10 + window.scrollY) + "px";
                userMenu.style.right = (window.innerWidth - rect.right) + "px";
            } else {
                userMenu.style.display = "none";
            }
        });

        // Click outside to close
        document.addEventListener("click", function() {
            if (userMenu.style.display === "block") {
                userMenu.style.display = "none";
            }
        });
    }

    function showLogoutModal() {
        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
            backdropFilter: "blur(2px)"
        });

        const modal = document.createElement("div");
        Object.assign(modal.style, {
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            textAlign: "center",
            fontFamily: "'Inter', 'Poppins', sans-serif"
        });

        const iconWrapper = document.createElement("div");
        Object.assign(iconWrapper.style, {
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#fee2e2",
            color: "#ef4444",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "28px",
            margin: "0 auto 16px auto"
        });
        iconWrapper.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i>`;

        const title = document.createElement("h2");
        title.textContent = "Xác nhận đăng xuất";
        Object.assign(title.style, {
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 12px 0",
            color: "#111827"
        });

        const message = document.createElement("p");
        message.textContent = "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không? Bạn sẽ cần đăng nhập lại để tiếp tục.";
        Object.assign(message.style, {
            fontSize: "14px",
            color: "#6b7280",
            margin: "0 0 24px 0",
            lineHeight: "1.5"
        });

        const btnContainer = document.createElement("div");
        Object.assign(btnContainer.style, {
            display: "flex",
            gap: "12px",
            justifyContent: "center"
        });

        const btnCancel = document.createElement("button");
        btnCancel.textContent = "Hủy";
        Object.assign(btnCancel.style, {
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#fff",
            color: "#374151",
            fontWeight: "500",
            cursor: "pointer",
            flex: "1",
            fontSize: "15px",
            transition: "all 0.2s"
        });
        btnCancel.addEventListener("mouseover", () => btnCancel.style.backgroundColor = "#f3f4f6");
        btnCancel.addEventListener("mouseout", () => btnCancel.style.backgroundColor = "#fff");
        btnCancel.addEventListener("click", () => document.body.removeChild(overlay));

        const btnConfirm = document.createElement("button");
        btnConfirm.textContent = "Đăng xuất";
        Object.assign(btnConfirm.style, {
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ef4444",
            color: "#fff",
            fontWeight: "500",
            cursor: "pointer",
            flex: "1",
            fontSize: "15px",
            transition: "all 0.2s"
        });
        btnConfirm.addEventListener("mouseover", () => btnConfirm.style.backgroundColor = "#dc2626");
        btnConfirm.addEventListener("mouseout", () => btnConfirm.style.backgroundColor = "#ef4444");
        btnConfirm.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "./login.html";
        });

        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnConfirm);

        modal.appendChild(iconWrapper);
        modal.appendChild(title);
        modal.appendChild(message);
        modal.appendChild(btnContainer);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);
    }
});
