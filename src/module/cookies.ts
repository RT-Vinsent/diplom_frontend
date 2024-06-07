/**
 * Устанавливает cookie с указанным именем, значением и сроком действия.
 *
 * @param {string} name - Имя cookie.
 * @param {string} value - Значение cookie.
 * @param {number} days - Количество дней до истечения срока действия cookie.
 */
export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

/**
 * Получает значение cookie по указанному имени.
 *
 * @param {string} name - Имя cookie.
 * @returns {string | null} Значение cookie или null, если cookie не найдено.
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Удаляет cookie по указанному имени.
 *
 * @param {string} name - Имя cookie.
 */
export const deleteCookie = (name: string) => {
  document.cookie = name + "=; Max-Age=-99999999;";
};
