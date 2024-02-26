/* eslint-disable func-names */
/* eslint-disable consistent-return */
import { isNil } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import oracleDB from 'oracledb';

type ITKTB = {
  idPtm: string;
  phongDaiTenVietTat: string | null;
  toTenVietTat: string | null;
  diaChiDatTram: string | null;
  doLapAntenBanGiao: number | null;
  tenTram: string | null;
  maTinh: string | null;
  maHuyen: string | null;
  kinhDo: number | null;
  viDo: number | null;
  loaiCSHT: string | null;
  tenVietTatCSHT: string | null;
  loaiThietBiRan: string | null;
  loaiThietBiRans: string[];
  loaiCot: string | null;
  ghiChu: string | null;
};
export default async function handler(_req: NextApiRequest, res: NextApiResponse<ITKTB[]>) {
  const { query } = _req;
  const { phongDais } = query;
  const dbConfig = {
    user: process.env.DB_PTM_USER,
    password: process.env.DB_PTM_PASS,
    connectString: process.env.DB_PTM_CONNECT,
  };
  try {
    let dataResult: ITKTB[] = [];

    oracleDB.getConnection(dbConfig, (err, connection) => {
      if (err) {
        console.error(err.message);
        return;
      }

      // Perform database operations here
      let sql =
        'SELECT csht.id_ptm as t0, phong_dai.ten_viet_tat as t1, to_quan_ly.ten_viet_tat as t2,' +
        ' csht.dia_chi_dat_tram as t3, csht.do_lap_anten_ban_giao as t4,' +
        ' csht.ten_tram as t5, tinh.ma_tinh as t6, huyen.ma_code as t7,' +
        ' csht.kinh_do as t8, csht.vi_do as t9, csht.loaicsht as t10,' +
        ' danh_muc.ten_viet_tat as t11, trien_khai_thiet_bi.loai_thiet_bi_ran as t12,' +
        ' csht.loai_cot as t13, csht.ghi_chu as t14 ' +
        ' from trien_khai_co_so_ha_tang csht' +
        ' left join trien_khai_thiet_bi ON csht.id_ptm = trien_khai_thiet_bi.id_ptm' +
        ' left join phong_dai ON phong_dai.ten_phong = csht.dai_vt' +
        ' left join to_quan_ly ON to_quan_ly.ten_to = csht.toql' +
        ' left join tinh ON tinh.ten_tinh = csht.tinh_thuc_te' +
        ' left join huyen ON huyen.ten_huyen = csht.huyen_thuc_te' +
        ' left join danh_muc ON danh_muc.ten_danh_muc = csht.loaicsht AND danh_muc.loai_danh_muc = 4' +
        " where csht.tam_dung is null AND csht.id_ptm is not null AND csht.phat_song IS NULL AND csht.kinh_do != '0' and csht.vi_do != '0'";
      if (phongDais && (phongDais as string).split(',')) {
        const pds = (phongDais as string).split(',');

        sql += ` and csht.dai_vt IN(`;
        pds.forEach((pd, i) => {
          sql += `'${pd}' ${i === pds.length - 1 ? '' : ','}`;
        });
        sql += ')';
      }
      connection.execute(sql, (err3, result) => {
        if (err3) {
          console.error(err3.message);
          res.status(500).json([]);
          return;
        }
        console.log('l;ength: ', result.rows?.length);
        dataResult =
          result.rows?.map((row: any) => {
            const loaiThietBiRan = row?.[12] || null;
            let rans: string[] = [];
            if (!isNil(loaiThietBiRan)) {
              rans = (loaiThietBiRan as string).split('-');
            }
            return {
              idPtm: row?.[0],
              phongDaiTenVietTat: row?.[1] || null,
              toTenVietTat: row?.[2] || null,
              diaChiDatTram: row?.[3] || null,
              doLapAntenBanGiao: row?.[4] || null,
              tenTram: row?.[5] || null,
              maTinh: row?.[6] || null,
              maHuyen: row?.[7] || null,
              kinhDo: row?.[8] || null,
              viDo: row?.[9] || null,
              loaiCSHT: row?.[10] || null,
              tenVietTatCSHT: row?.[11] || null,
              loaiThietBiRan,
              loaiThietBiRans: rans,
              loaiCot: row?.[13] || null,
              ghiChu: row?.[14] || null,
            };
          }) || [];
        res.status(200).json(dataResult);
      });

      // Release the connection when done
      connection.release((err2) => {
        if (err2) {
          console.error(err2.message);
          res.status(500).json([]);
        }
      });
    });
    // res.status(200).json({ message: 'Emails sent successfully', data: dataResult });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json([]);
  }
}
