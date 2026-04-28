const DATA_URL = "events.json";

// Khai báo đối tượng EventStore chứa tất cả các hàm bổ trợ
const EventStore = {
  loadDatabase: async function () {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error("Không thể tải dữ liệu sự kiện");
    return response.json();
  },

  getEventById: function (database, eventId) {
    return database.events.find((e) => String(e.id) === String(eventId)) || null;
  },

  getSchedulesByEventId: function (database, eventId) {
    return database.schedules
      .filter((s) => String(s.eventId) === String(eventId))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  getScheduleById: function (database, scheduleId) {
    return database.schedules.find((s) => String(s.id) === String(scheduleId)) || null;
  },

  getSeatMapById: function (database, seatMapId) {
    return database.seatMaps.find((m) => String(m.id) === String(seatMapId)) || null;
  },

  getLowestPrice: function (schedule) {
    const prices = Object.values(schedule.zonePrices || {});
    return prices.length ? Math.min(...prices) : 0;
  },

  formatCurrency: function (value) {
    if (value === 0) return "Miễn phí";
    return `${Number(value).toLocaleString("vi-VN")}đ`;
  },

  formatDate: function (dateText) {
    if (!dateText) return "Chưa có ngày";
    const [year, month, day] = dateText.split("-");
    return `${day}/${month}/${year}`;
  },

  // Hàm tạo ID cho ghế (Bắt buộc để Seatmap hoạt động)
  buildSeatId: function(zoneId, row, col) {
    return `${zoneId}-${row}-${col}`;
  },

  // Lấy tên/màu tùy chỉnh cho sơ đồ dựa trên schedule
  getZoneInfo: function(schedule, zoneId, seatMap) {
    // Ưu tiên lấy từ lịch diễn (schedule) nếu có zoneCustoms
    if (schedule && schedule.zoneCustoms && schedule.zoneCustoms[zoneId]) {
      return {
        name: schedule.zoneCustoms[zoneId].name || zoneId,
        color: schedule.zoneCustoms[zoneId].color || "#cccccc"
      };
    }
    
    // Nếu không có tùy chỉnh, lấy từ định nghĩa gốc của SeatMap
    let defaultData = null;
    if (seatMap.sections) {
      defaultData = seatMap.sections.find(s => s.id === zoneId);
    } else if (seatMap.zones) {
      defaultData = seatMap.zones.find(z => z.id === zoneId);
    }

    return {
      name: defaultData ? (defaultData.label || defaultData.name) : zoneId,
      color: defaultData ? (defaultData.color || "#cccccc") : "#cccccc"
    };
  }
};