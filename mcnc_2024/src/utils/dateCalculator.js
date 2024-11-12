// 금일 날짜를 YYYY-MM-DD 형태로 반환하는 함수
export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    return todayDate;
}


// 기본 DATE 표현식을 YYYY-MM-DD 형태로 반환하는 함수
export function formatDate(date) {
    if(date === null) {
        return ""
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 1부터 시작하는 월
    const day = String(date.getDate()).padStart(2, '0'); // 일

    return `${year}-${month}-${day}`;
}

export function formatDateAndTime(date) {
    // 날짜 부분 (yyyy-mm-dd)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // 시간 부분 (hh:mm)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return [formattedDate, formattedTime];
}