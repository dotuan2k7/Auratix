// ==========================================
// 1. TÍNH NĂNG CHUYỂN TAB (MENU BÊN TRÁI)
// ==========================================
function showTab(tabId) {
    // Bước 1: Giấu tất cả các nội dung đi
    let allTabs = document.querySelectorAll('.tab-pane');
    allTabs.forEach(function(tab) {
        tab.classList.remove('active');
    });

    // Bước 2: Tắt màu sáng ở tất cả các nút menu
    let allButtons = document.querySelectorAll('.nav-item');
    allButtons.forEach(function(btn) {
        btn.classList.remove('active');
    });

    // Bước 3: Hiện nội dung của Tab được chọn
    document.getElementById(tabId).classList.add('active');

    // Bước 4: Làm sáng cái nút vừa được bấm
    // Chú ý: event.currentTarget lấy chính xác cái nút bạn vừa click
    event.currentTarget.classList.add('active');

    // Bước 5: Đổi cái tiêu đề to đùng ở trên cùng cho hợp ngữ cảnh
    let title = document.getElementById('tab-title');
    if (tabId === 'profile') title.innerText = "Hồ sơ cá nhân";
    if (tabId === 'tickets') title.innerText = "Vé đã mua";
    if (tabId === 'favorites') title.innerText = "Sự kiện yêu thích";
}

// ==========================================
// 2. TÍNH NĂNG LƯU HỒ SƠ (LOCAL STORAGE)
// ==========================================
function handleSaveProfile() {
    let fullName = document.getElementById('user-fullname').value;
    let phone = document.getElementById('user-phone').value;

    if (fullName.trim() === "") {
        showModal("Lỗi", "Vui lòng nhập họ và tên của bạn!", false, null); // Thay vì alert()
        return;
    }

    localStorage.setItem('savedName', fullName);
    localStorage.setItem('savedPhone', phone);
    updateUI();

    showModal("Đã cập nhật thông tin cá nhân thành công.", null); // Thay vì alert()
}

// Cập nhật Mật khẩu (Mô phỏng)
function handleUpdatePassword() {
    let pass = document.getElementById('new-password').value;
    if (pass.trim() === "") {
        showModal("Lỗi", "Vui lòng nhập mật khẩu mới!", false, null);
        return;
    }
    document.getElementById('new-password').value = ""; 
    showModal("Đã cập nhật mật khẩu mới!", false, null);
}

// ==========================================
// 3. TỰ ĐỘNG CHẠY KHI MỞ TRANG WEB
// ==========================================
function updateUI() {
    // Mở két sắt xem có tên ai lưu không
    let savedName = localStorage.getItem('savedName');
    
    if (savedName) {
        // Đắp tên lên góc phải trên cùng và bên dưới Avatar
        document.getElementById('top-username').innerText = savedName;
        document.getElementById('sidebar-username').innerText = savedName;
        // Điền sẵn tên vào ô input để người dùng thấy
        document.getElementById('user-fullname').value = savedName;
    }

    // Làm tương tự với số điện thoại
    let savedPhone = localStorage.getItem('savedPhone');
    if (savedPhone) {
        document.getElementById('user-phone').value = savedPhone;
    }
}

// 4. HIỂN THỊ DANH SÁCH VÉ ĐÃ MUA (GIAO DIỆN DARK MODE)
// ==========================================
function renderTickets() {
    const ticketList = document.getElementById('ticket-list');
    if (!ticketList) return;

    let myTickets = JSON.parse(localStorage.getItem('savedTickets'));

    // Nếu chưa có vé, bơm dữ liệu giả (Mock Data) vào để xem trước giao diện
    if (!myTickets || myTickets.length === 0) {
        myTickets = [
            { id: 'EDM-2026-X9', name: 'ĐẠI NHẠC HỘI EDM 2026', date: '20/10/2026', seat: 'Khu A - Ghế 12', type: 'VIP', color: '#88efaa' },
            { id: 'WEB-WS-01', name: 'WORKSHOP LẬP TRÌNH WEB', date: '15/05/2026', seat: 'Tự do', type: 'Standard', color: '#63b3ed' }
        ];
        localStorage.setItem('savedTickets', JSON.stringify(myTickets));
    }

    ticketList.innerHTML = ''; // Xóa chữ "Chưa có vé nào"

    // Vòng lặp vẽ ra chiếc vé Dark Mode giống hệt ảnh bạn thích
    myTickets.forEach(function(ticket) {
        let ticketHTML = `
            <div class="dark-ticket">
                <div class="ticket-accent" style="background-color: ${ticket.color}"></div>
                
                <div class="ticket-body">
                    <h3 class="ticket-title">${ticket.name}</h3>
                    
                    <div class="ticket-details">
                        <div class="detail-block">
                            <span class="detail-label">NGÀY CHIẾU</span>
                            <p class="detail-value">${ticket.date}</p>
                        </div>
                        <div class="detail-block">
                            <span class="detail-label">VỊ TRÍ</span>
                            <p class="detail-value">${ticket.seat}</p>
                        </div>
                    </div>
                    
                    <span class="ticket-badge">${ticket.type}</span>
                </div>

                <div class="ticket-rip"></div>

                <div class="ticket-qr-section">
                    <div class="qr-mockup">
                        <i class="fas fa-qrcode" style="font-size: 2rem;"></i>
                    </div>
                    <button class="btn-cancel-dark" onclick="cancelTicket('${ticket.id}')">HỦY VÉ</button>
                </div>
            </div>
        `;
        ticketList.innerHTML += ticketHTML;
    });
}
// ==========================================
// 5. HÀM XỬ LÝ HỦY VÉ.
// ==========================================
function cancelTicket(ticketId) {
    showModal("Xác nhận hủy vé", `Bạn có chắc chắn muốn hủy vé mã: ${ticketId} không? Hành động này không thể hoàn tác.`, true, function() {
        
        // 1. Lọc và xóa vé trong két sắt
        let myTickets = JSON.parse(localStorage.getItem('savedTickets'));
        let updatedTickets = myTickets.filter(ticket => ticket.id !== ticketId);
        localStorage.setItem('savedTickets', JSON.stringify(updatedTickets));
        
        // 2. Vẽ lại màn hình cho vé biến mất
        renderTickets(); 
        
        // 3. Đợi 0.3 giây cho bảng cũ đóng hẳn rồi mới văng bảng Thành công ra
        setTimeout(function() {
            showModal("Thành công", "Đã hủy vé thành công! Tiền sẽ được hoàn lại.", false, null);
        }, 300); 
    });
}

// ==========================================
// ĐÂY LÀ BƯỚC 2 CHUẨN: GỘP CHUNG VÀO 1 CÁI ONLOAD DUY NHẤT
// ==========================================
window.onload = function() {
    updateUI();         // Khôi phục tên, số điện thoại
    renderTickets();    // Kích hoạt vẽ danh sách vé
};

// ==========================================
// HỆ THỐNG ĐIỀU KHIỂN BẢNG THÔNG BÁO (MODAL) FIX
// ==========================================

function showModal(title, message, isConfirm, callback) {
    // 1. Đổi chữ trong bảng
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    
    // 2. Hiện/Ẩn nút Hủy tùy tình huống
    if (isConfirm) {
        document.getElementById('modal-btn-cancel').style.display = 'inline-block';
    } else {
        document.getElementById('modal-btn-cancel').style.display = 'none';
    }

    // 3. CẮM DÂY ĐIỆN TRỰC TIẾP CHO NÚT XÁC NHẬN
    let btnConfirm = document.getElementById('modal-btn-confirm');
    btnConfirm.onclick = function() {
        closeModal(); // Việc đầu tiên: Bấm là phải Đóng bảng lại ngay!
        if (callback) {
            callback(); // Việc thứ 2: Chạy hành động (ví dụ: Xóa vé)
        }
    };

    // 4. Hiện bảng lên
    document.getElementById('custom-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('custom-modal').classList.remove('active');
}

//Check