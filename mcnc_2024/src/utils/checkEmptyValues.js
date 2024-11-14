/**
 * 
 * 설문에 생성된 자식 항목들 중에서, 비어있는 값을 추적하여 반환하는 함수
 * @param {*} obj 
 * @param {*} path 
 * @returns 
 */
export function checkEmptyValues(obj, path = "") {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
  
      if (typeof value === "object" && value !== null) {
        // 객체나 배열이면 재귀적으로 검사
        const result = checkEmptyValues(value, currentPath);
        if (result) return result; // 빈값이 발견되면 경로 반환
      } else {
        if (value === "" || value === null) {
          // 빈 문자열이나 null을 발견하면 경로 반환
          return currentPath;
        }
      }
    }
    return null; // 빈값이 없으면 null 반환
  }