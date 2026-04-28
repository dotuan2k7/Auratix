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
  authDomain: "auratix-225cf.firebaseapp.com",
  projectId: "auratix-225cf",
  storageBucket: "auratix-225cf.firebasestorage.app",
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
// 7. XỬ LÝ ĐĂNG NHẬP BẰNG EMAIL/MẬT KHẨU (BẢN CHỐNG LỖI)
// ========================================================

// Tự động tìm form dù trong HTML bạn đặt id là 'loginForm' hay 'login-form'
const formDangNhap = document.getElementById('loginForm') || document.getElementById('login-form');

if (formDangNhap) {
    formDangNhap.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn chặn đứng im hoặc F5 trang

        // Tự động quét tìm ô nhập Email và Pass (Chấp luôn cả id cũ của bạn)
        const emailElement = document.getElementById('email') || formDangNhap.querySelector('input[type="email"]');
        const passElement = document.getElementById('password') || document.getElementById('login-pass');

        // Báo lỗi ngay lập tức ra màn hình nếu HTML bị thiếu thật
        if (!emailElement || !passElement) {
            alert("Lỗi Code: Không tìm thấy ô nhập Email hoặc Mật khẩu trong HTML!");
            return;
        }

        const emailValue = emailElement.value;
        const passwordValue = passElement.value;

        // Báo cho bạn biết code đã chạy qua bước lấy dữ liệu
        console.log("Đang gửi yêu cầu đăng nhập cho:", emailValue);

        // Gọi Firebase kiểm tra
        signInWithEmailAndPassword(auth, emailValue, passwordValue)
            .then((userCredential) => {
                // Thành công: Bật thông báo và đá về trang index
                alert("Đăng nhập thành công! Đang chuyển về trang chủ...");
                
                localStorage.setItem('isLoggedIn', 'true'); 
                window.location.href = "index.html"; 
            })
            .catch((error) => {
                // Thất bại: Báo sai tài khoản
                alert("Tài khoản hoặc mật khẩu không đúng!");
                console.error("Mã lỗi Firebase:", error.message);
            });
    });
} else {
    console.error("CẢNH BÁO: Không tìm thấy cái form đăng nhập nào ở trang này!");
}