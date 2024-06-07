/**
 * Преобразует строку формата "ряд-место" в строку формата "Ряд {row}, место {seat}".
 * Увеличивает значения ряда и места на единицу.
 * 
 * @param {string} seatString - Строка формата "ряд-место".
 * @returns {string} - Строка формата "Ряд {row}, место {seat}".
 */
export function formatSeatString(seatString: string): string {
  const [row, seat] = seatString.split('-').map(Number); // Преобразуем строки в числа
  return `Ряд ${row + 1} - место ${seat + 1}`;
}

/**
 * Преобразует массив строк формата "ряд-место" в массив строк формата "Ряд X места Y, Z".
 *
 * @param {string[]} seats - Массив строк формата "ряд-место".
 * @returns {string[]} - Массив строк формата "Ряд X места Y, Z".
 */
// export function formatSeatsArray(seats: string[]): string[] {
//   console.log('formatSeatsArray', seats);
//   const rows: Record<string, number[]> = {};

//   // Группируем места по рядам
//   seats.forEach(seat => {
//     const [row, seatNumber] = seat.split('-').map(Number);
//     if (!rows[row]) {
//       rows[row] = [];
//     }
//     rows[row].push(seatNumber);
//   });

//   // Формируем строки для каждого ряда
//   const formattedSeats = Object.entries(rows).map(([row, seatNumbers]) => {
//     const formattedSeatNumbers = seatNumbers.sort((a, b) => a - b).join(', ');
//     return `Ряд ${row} места ${formattedSeatNumbers}`;
//   });

//   return formattedSeats;
// };

