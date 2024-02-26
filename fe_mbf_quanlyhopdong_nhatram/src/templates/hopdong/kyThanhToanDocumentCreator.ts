import { Document, Paragraph, TextRun } from 'docx';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';

export const createKyThanhToanDoc = ({
  kyThanhToan = [],
}: {
  kyThanhToan: { tuNgay: Date; denNgay: Date; soTien: number }[];
}): Document => {
  const total = kyThanhToan.reduce((a, value) => {
    return a + value.soTien;
  }, 0);
  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Các kỳ thanh toán cụ thể như sau:', bold: true }),
              new TextRun({ text: ' (Số tiền đã bao gồm VAT)\n', italics: true }),
            ],
          }),
          ...kyThanhToan.map((ky, index) => {
            return new Paragraph({
              children: [
                new TextRun({
                  text: `- Kỳ ${index + 1}: Từ ngày ${fDate(ky.tuNgay)} ➞ ${fDate(
                    ky.denNgay
                  )}, số tiền: ${fCurrencyVND(ky.soTien)} đồng.`,
                  bold: true,
                }),
              ],
            });
          }),
          new Paragraph({ text: '_________________________________________________\n' }),
          new Paragraph({
            children: [
              new TextRun({
                text: `\t\t\t\t\tTổng cộng: ${fCurrencyVND(total)} đồng.`,
                bold: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  return document;
};
