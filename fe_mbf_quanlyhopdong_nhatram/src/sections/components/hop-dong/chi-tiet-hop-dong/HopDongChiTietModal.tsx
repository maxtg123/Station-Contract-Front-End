import { ChiTietHopDongProvider } from 'src/context/hop-dong/chitietHopDongContext';
import ChiTietHopDongPage from './ChiTietHopDongPage';

export default function HopDongChiTietModal() {
  return (
    <ChiTietHopDongProvider>
      <ChiTietHopDongPage />
    </ChiTietHopDongProvider>
  );
}
