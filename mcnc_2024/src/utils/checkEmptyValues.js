/**
 * 설문에 생성된 자식 항목들 중에서, 비어있는 값을 추적하여 배열로 반환하는 함수
 * @param {*} obj 
 * @param {*} path 
 * @returns {Array} 빈 값의 경로들을 담은 배열
 */
export function checkEmptyValues(obj, path = "") {
    const emptyPaths = []; // 빈 값의 경로를 저장할 배열

    for (const key in obj) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof value === "object" && value !== null) {
            // 객체나 배열이면 재귀적으로 검사
            const result = checkEmptyValues(value, currentPath);
            emptyPaths.push(...result); // 재귀 호출 결과를 배열에 추가
        } else {
            if (value === "" || value === null) {
                // 빈 문자열이나 null을 발견하면 경로 추가
                emptyPaths.push(currentPath);
            }
        }
    }

    return emptyPaths; // 빈 값 경로 배열 반환
}
