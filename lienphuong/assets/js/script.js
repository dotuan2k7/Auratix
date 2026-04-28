// Xử lý ẩn/hiện mật khẩu cho giao diện
document.addEventListener('DOMContentLoaded', () => {
    const toggleIcons = document.querySelectorAll('.toggle-password');

    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Lấy id của input tương ứng từ data-target
            const targetId = this.getAttribute('data-target');
            const inputField = document.getElementById(targetId);

            // Đổi type của input
            if (inputField.type === 'password') {
                inputField.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                inputField.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB1QpFqLyz9KCgvUE7ZRdKwNb5zDWGrPI",
  authDomain: "ticketbox-225cf.firebaseapp.com",
  projectId: "ticketbox-225cf",
  storageBucket: "ticketbox-225cf.firebasestorage.app",
  messagingSenderId: "913581673614",
  appId: "1:913581673614:web:04f77a17d6aa7c728f4ddf",
  measurementId: "G-EWD6PMWXK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4. Khởi tạo Providers (Google và GitHub)
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ========================================================
// 5. Xử lý sự kiện click nút đăng nhập Google
// ========================================================
document.getElementById('btn-google').addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn load lại trang
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        alert(`Đăng nhập Google thành công! Xin chào ${user.displayName}`);
        console.log("Thông tin user:", user);
        
        const templateParams = {
            to_name: user.displayName, 
            to_email: user.email       
        };

        emailjs.send("service_2uhkzho","template_0e8vo6c", templateParams)
            .then(function(response) {
               console.log('Đã gửi mail thông báo thành công!', response.status, response.text);
            }, function(error) {
               console.log('Gửi mail thất bại...', error);
            });
            
        // ĐÃ SỬA CHỖ NÀY: Lưu cờ và chuyển về trang chủ
        localStorage.setItem('isLoggedIn', 'true'); 
        window.location.href = "index.html"; 

      }).catch((error) => {
        alert("Lỗi đăng nhập Google: " + error.message);
      });
});

// ========================================================
// 6. Xử lý sự kiện click nút đăng nhập GitHub
// ========================================================
document.getElementById('btn-github').addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const user = result.user;
        alert(`Đăng nhập GitHub thành công! Xin chào ${user.displayName || user.email}`);
        console.log("Thông tin user:", user);

        // ĐÃ SỬA CHỖ NÀY: Lưu cờ và chuyển về trang chủ
        localStorage.setItem('isLoggedIn', 'true'); 
        window.location.href = "index.html"; 

      }).catch((error) => {
        alert("Lỗi đăng nhập GitHub: " + error.message);
      });
});

// ========================================================
// ========================================================
// XỬ LÝ NÚT ĐĂNG NHẬP BẰNG EMAIL / MẬT KHẨU
// ========================================================

// Tìm cái form đăng nhập (lưu ý cái id 'login-form' phải khớp với html của bạn)
const formDangNhap = document.getElementById('login-form') || document.getElementById('loginForm');

if (formDangNhap) {
    formDangNhap.addEventListener('submit', (e) => {
        // 1. Chặn trình duyệt tự động F5 (bắt buộc phải có)
        e.preventDefault(); 

        // 2. Lưu cờ "đã đăng nhập" cho trang index biết
        localStorage.setItem('isLoggedIn', 'true');
        
        // (Tùy chọn) Bật thông báo cho mượt
        alert('Đăng nhập thành công! Đang chuyển về trang chủ...');

        // 3. Chuyển hướng bay thẳng về index.html
        window.location.href = 'index.html';
    });
} else {
    console.log("Cảnh báo: Không tìm thấy Form Đăng nhập. Bạn hãy kiểm tra lại id trong thẻ <form> nhé.");
}