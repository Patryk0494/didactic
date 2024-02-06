export function getSessionStorage(sessionStorageKey) {
 return JSON.parse(sessionStorage.getItem(sessionStorageKey));
};

export function setSessionStorage(sessionStorageKey, value) {
 return sessionStorage.setItem(sessionStorageKey, JSON.stringify(value));
} 


export function isNumeric(num) {
  return !isNaN(num);
}