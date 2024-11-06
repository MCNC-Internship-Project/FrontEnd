export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    return todayDate;
}

export function formatDate(date) {
    if(date === null) {
        return ""
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 1부터 시작하는 월
    const day = String(date.getDate()).padStart(2, '0'); // 일

    return `${year}-${month}-${day}`;
}