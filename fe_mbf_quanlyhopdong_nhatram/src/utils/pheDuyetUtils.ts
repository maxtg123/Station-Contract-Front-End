import { IHopDong } from 'src/@types/hopdongmatbang';

export const checkSamePhongDaiId = (arr: IHopDong[]): boolean => {
  if (arr.length === 0) {
    return false; // Trả về false nếu mảng rỗng
  }

  const firstId = arr[0].tram.dmPhongDai.id; // Lấy giá trị id của phần tử đầu tiên

  // Sử dụng every() để kiểm tra xem tất cả các phần tử có cùng giá trị id đầu tiên hay không
  const allSameId = arr.every((element) => element.tram.dmPhongDai.id === firstId);

  return allSameId;
};
