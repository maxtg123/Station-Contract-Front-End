import { useEffect, useState } from 'react';
// @mui
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
// utils
import { useRouter } from 'next/router';
import { IModule, IThongBao } from 'src/@types/thongbao';
import { CustomAvatar } from 'src/components/custom-avatar';
import DialogWithRoute from 'src/components/dialogs/dialog-with-route/DialogWithRoute';
import { TRANG_THAI_THONG_BAO } from 'src/constants/thongbao.constant';
import { useUpdateThongBaoMutation } from 'src/data/thongbao';
import { getMessageThongBao } from 'src/sections/thongbao/GetMessageThongBao';
import { HOP_DONG_MAT_BANG } from 'src/constants/hopdongmatbang.constant';
import { fToNow } from '../../../utils/formatTime';
// _mock_
// components
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
// ----------------------------------------------------------------------

type IProps = {
  data: IThongBao[];
  totalThongBaoChuaXem: number;
};

type IParserData = {
  id: number;
  soHopDong: string;
  soHopDongErp: string;
  tramId: number;
};
const TAB_CHANGE = {
  pheDuyet: 'lich_su_phe_duyet',
  damPhan: 'dam_phan',
};

export default function NotificationsPopover({ data, totalThongBaoChuaXem }: IProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<IThongBao[]>([]);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [currentPath, setCurrentPath] = useState('');

  const { mutate: updateThongBaoDaXem } = useUpdateThongBaoMutation();

  const [dataItem, setDataItem] = useState<IParserData>({
    id: 0,
    soHopDong: '',
    soHopDongErp: '',
    tramId: 0,
  });

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleUpdateThongBaoDaXem = (values: IThongBao) => {
    const transformData = {
      trangThai: TRANG_THAI_THONG_BAO.daXem,
    };
    if (values.trangThai === TRANG_THAI_THONG_BAO.chuaXem) {
      updateThongBaoDaXem({ id: values.id.toString(), ...transformData });
    }
  };
  const handleClickItemNotification = (values: IThongBao) => {
    let tab_change = '';
    setCurrentPath(router.pathname);
    const parserData = JSON.parse(values.content);
    setDataItem(parserData.data);
    if (values.module === 'HOP_DONG') {
      tab_change = TAB_CHANGE.pheDuyet;
    }
    if (values.module === 'DAM_PHAN') {
      tab_change = TAB_CHANGE.damPhan;
    }
    router.push(`/${HOP_DONG_MAT_BANG}/${parserData.data.id}/?tab=${tab_change}`);
    setOpenPopover(null);
    if (values.trangThai === TRANG_THAI_THONG_BAO.chuaXem) {
      handleUpdateThongBaoDaXem(values);
    }
  };
  const handleDialogClose = () => {
    router.push(currentPath);
  };
  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{ width: 40, height: 40 }}
        style={{ backgroundColor: 'white' }}
      >
        <Badge badgeContent={totalThongBaoChuaXem} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButtonAnimate>
      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 360, p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Thông báo</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Bạn có {totalThongBaoChuaXem} thông báo chưa đọc
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <List disablePadding>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClickItemNotification={handleClickItemNotification}
            />
          ))}
        </List>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            disableRipple
            onClick={() => {
              router.push('/thong-bao');
              handleClosePopover();
            }}
          >
            Xem tất cả
          </Button>
        </Box>
      </MenuPopover>
      {dataItem.id?.toString() === router.query.id?.toString() && (
        <DialogWithRoute
          open={!!router.query.id}
          onClose={handleDialogClose}
          onClick={handleDialogClose}
          title={`Thông tin chi tiết của hợp đồng: ${dataItem.soHopDong}`}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type IPropsNotificationItem = {
  notification: IThongBao;
  onClickItemNotification: (values: IThongBao) => void;
};

function NotificationItem({ notification, onClickItemNotification }: IPropsNotificationItem) {
  const router = useRouter();
  const { avatar, title } = renderContent(notification, router.pathname);
  const handleItemClick = (e: any) => {
    e.preventDefault();
    onClickItemNotification(notification);
  };
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.trangThai === TRANG_THAI_THONG_BAO.chuaXem && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={(e) => {
        handleItemClick(e);
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={title}
        secondary={
          <Stack direction="row" sx={{ mt: 0.5, typography: 'caption', color: 'text.disabled' }}>
            <Iconify icon="eva:clock-fill" width={16} sx={{ mr: 0.5 }} />
            <Typography variant="caption">{fToNow(notification.createdAt)}</Typography>
          </Stack>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: IThongBao, pathName: string) {
  const equalPathName = pathName === `/${HOP_DONG_MAT_BANG}` ? '/' : pathName;
  const message = getMessageThongBao(notification, notification.module as IModule, equalPathName);
  const title = (
    <Typography
      component="span"
      variant="body2"
      sx={{
        ...(notification.trangThai === TRANG_THAI_THONG_BAO.daXem && {
          color: 'text.disabled',
        }),
      }}
    >
      {message}
    </Typography>
  );
  return {
    avatar: notification.nguoiNhan ? <CustomAvatar name={notification.nguoiNhan.email} /> : null,
    title,
  };
}
