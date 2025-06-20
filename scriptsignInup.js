  // Chuyển sang form đăng ký nếu có hash
  if (window.location.hash === "#register") {
    document.querySelector(".form-box.login").classList.remove("active");
    document.querySelector(".form-box.register").classList.add("active");
  }

  // Xử lý chuyển đổi giữa đăng nhập/đăng ký
  document.querySelector(".register-link").addEventListener("click", () => {
    document.querySelector(".form-box.login").classList.remove("active");
    document.querySelector(".form-box.register").classList.add("active");
  });

  document.querySelector(".login-link").addEventListener("click", () => {
    document.querySelector(".form-box.register").classList.remove("active");
    document.querySelector(".form-box.login").classList.add("active");
  });

  // Khi nhấn nút đăng ký, chuyển sang form đăng nhập
  document.querySelector(".form-box.register form").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Đăng ký thành công! Mời bạn đăng nhập.");
    document.querySelector(".form-box.register").classList.remove("active");
    document.querySelector(".form-box.login").classList.add("active");
  });

  // Khi nhấn đăng nhập, lưu trạng thái và chuyển về homePage
  document.querySelector(".form-box.login form").addEventListener("submit", function(e) {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "homePage.html";
  });