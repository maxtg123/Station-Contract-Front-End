import { Box, Drawer, IconButton, IconButtonProps } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import useResponsive from 'src/hooks/useResponsive';

const PheDuyet = dynamic(() => import('./phe-duyet/PheDuyet'), { ssr: false });
const DamPhan = dynamic(() => import('./dam-phan/DamPhan'), { ssr: false });

const StyledToggleButton = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  right: 0,
  zIndex: 9,
  width: 46,
  height: 46,
  position: 'absolute',
  top: 0,
  boxShadow: theme.customShadows.z8,
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${theme.palette.divider}`,
  borderRight: 0,
  borderRadius: `12px 0 0 12px`,
  transition: theme.transitions.create('all'),
  '&:hover': {
    backgroundColor: theme.palette.background.neutral,
  },
}));

const NAV_WIDTH = 420;
const NAV_WIDTH_SMALL = 360;

const RightBar = () => {
  const {
    state: { rightBar },
    dispatch,
  } = useChiTietHopDongContext();

  const theme = useTheme();
  const isDesktop = useResponsive('up', 'lg');

  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const willOpenNav = !!rightBar;
    setOpenNav((prev) => (prev !== willOpenNav ? willOpenNav : prev));
  }, [rightBar]);

  const handleClose = () => {
    dispatch({ type: 'reset-data-right-bar' });
  };

  const renderContent = () => {
    if (rightBar) {
      if (rightBar.type === 'phe_duyet') {
        return <PheDuyet />;
      }
      if (rightBar.type === 'dam_phan') {
        return <DamPhan />;
      }
    }

    return null;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {openNav && (
        <StyledToggleButton
          onClick={handleClose}
          sx={{
            right: isDesktop ? NAV_WIDTH : NAV_WIDTH_SMALL,
          }}
        >
          <Iconify width={16} icon="eva:close-outline" />
        </StyledToggleButton>
      )}

      <Drawer
        open={openNav}
        anchor="right"
        variant="persistent"
        PaperProps={{
          sx: {
            width: 1,
            position: 'static',
          },
        }}
        sx={{
          height: 1,
          width: isDesktop ? NAV_WIDTH : NAV_WIDTH_SMALL,
          transition: theme.transitions.create('width'),
          ...(!openNav && {
            width: 0,
          }),
        }}
      >
        {renderContent()}
      </Drawer>
    </Box>
  );
};

export default RightBar;
