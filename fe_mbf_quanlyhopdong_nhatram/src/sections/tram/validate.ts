import * as Yup from 'yup';

export const TramSchema = Yup.object().shape({
  dmPhongDai: Yup.object().required('Phòng/Đài là trường bắt buộc').nullable(),
  maTram: Yup.string().when('daPhatSong', {
    is: true,
    then: Yup.string()
      .required('Mã trạm là trường bắt buộc')
      .typeError('Mã trạm là trường bắt buộc'),
    otherwise: Yup.string().optional(),
  }),
  daPhatSong: Yup.bool().default(false),
  maDTXD: Yup.string().when('daPhatSong', {
    is: false,
    then: Yup.string()
      .required('Mã ĐTXD là trường bắt buộc')
      .typeError('Mã ĐTXD là trường bắt buộc'),
    otherwise: Yup.string().optional(),
  }),
  dmTinh: Yup.object().required('Tỉnh/TP là trường bắt buộc').nullable(),
  kinhDo: Yup.string(),
  viDo: Yup.string(),
  trangThaiHoatDong: Yup.boolean().required('Độ cao cột anten là trường bắt buộc'),
});
