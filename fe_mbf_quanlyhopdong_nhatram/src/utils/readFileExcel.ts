/* eslint-disable no-plusplus */
import * as XLSX from 'xlsx';

export function readExcelFileImportHopDong(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Định nghĩa phạm vi cần đọc
      const startRow = 6; // Dòng bắt đầu (A6)
      const endRow = getLastDataRow(worksheet); // Dòng kết thúc (tùy chọn, có thể thay đổi theo yêu cầu)
      const range = `A${startRow}:BQ${endRow + 1}`; // Đọc dữ liệu từ phạm vi đã chỉ định và điều kiện dòng có dữ liệu
      const excelData = [];
      const rangeOptions = XLSX.utils.decode_range(range);
      for (let rowNum = rangeOptions.s.r; rowNum <= rangeOptions.e.r; rowNum++) {
        // Kiểm tra dòng có dữ liệu hay không
        let hasData = false;
        for (let colNum = rangeOptions.s.c; colNum <= rangeOptions.e.c; colNum++) {
          const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
          const cellValue = worksheet[cellAddress]?.v;
          if (cellValue) {
            hasData = true;
            break;
          }
        }
        if (hasData) {
          const rowData = [];
          rowData.push(rowNum + 1); // Thêm số dòng vào dữ liệu
          for (let colNum = rangeOptions.s.c; colNum <= rangeOptions.e.c; colNum++) {
            const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
            const cellValue = worksheet[cellAddress]?.v || '';
            // Kiểm tra nếu cột hiện tại là cột chứa giá trị ngày
            if (typeof cellValue === 'number' && cellValue.toString().length === 5) {
              const parsedDate = XLSX.SSF.parse_date_code(cellValue); // Chuyển đổi giá trị ngày thành ngày thực tế
              const day = parsedDate.d.toString().padStart(2, '0');
              const month = parsedDate.m.toString().padStart(2, '0');
              const year = parsedDate.y;
              const formattedDate = `${day}/${month}/${year}`;
              rowData.push(formattedDate);
            } else {
              rowData.push(cellValue);
            }
          }
          excelData.push(rowData);
        }
      }
      resolve(excelData);
    };

    reader.onerror = (e) => {
      reject(e);
    };

    reader.readAsBinaryString(file);
  });
}

function getLastDataRow(worksheet: XLSX.WorkSheet): number {
  const range = worksheet['!ref'];
  const rangeOptions = XLSX.utils.decode_range(range as string);
  let lastDataRow = rangeOptions.e.r;
  for (let rowNum = rangeOptions.e.r; rowNum >= rangeOptions.s.r; rowNum--) {
    const rowRange = `${XLSX.utils.encode_col(rangeOptions.s.c)}${rowNum}:${XLSX.utils.encode_col(
      rangeOptions.e.c
    )}${rowNum}`;
    const rowValues = XLSX.utils.sheet_to_json(worksheet, { range: rowRange });
    if (rowValues.length > 0) {
      lastDataRow = rowNum;
      break;
    }
  }
  return lastDataRow;
}

// export const generateDataExcelFile = () => {
//   const templatePath = '/templates/hop-dong/import-hop-dong.xlsx';

//   fetch(templatePath)
//     .then((response) => response.blob())
//     .then((blob) => {
//       const fileReader = new FileReader();
//       fileReader.onload = () => {
//         const arrayBuffer = fileReader.result;
//         const workbook = XLSX.read(arrayBuffer, { type: 'array' });

//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];

//         const cellA6 = 'A6';
//         const dropdownOptions = ['', 'Option 1', 'Option 2', 'Option 3'];
//         worksheet[cellA6] = { t: 's', v: dropdownOptions[1] }; // Set the value for cell A6

//         // Tạo buffer từ workbook
//         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//         const excelData = new Blob([excelBuffer], {
//           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         });

//         // Download the file
//         saveAs(excelData, 'data.xlsx');
//       };

//       fileReader.readAsArrayBuffer(blob);
//     })
//     .catch((error) => {
//       console.error('Error accessing the file:', error);
//     });
// };
