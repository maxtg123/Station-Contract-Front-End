import { useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  CardProps,
  Checkbox,
  Divider,
  IconButton,
  MenuItem,
  Stack,
} from '@mui/material';
// hooks
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';
import MenuPopover from 'src/components/menu-popover/MenuPopover';
import TextMaxLine from 'src/components/text-max-line/TextMaxLine';
import useCopyToClipboard from 'src/hooks/useCopyToClipboard';
import { fData } from 'src/utils/formatNumber';
//
import { useSnackbar } from 'notistack';
import { IFolderManager } from 'src/@types/file';
import FileDetailsDrawer from '../portal/FileDetailsDrawer';
import FileNewFolderDialog from '../portal/FileNewFolderDialog';
import FileShareDialog from '../portal/FileShareDialog';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  folder: IFolderManager;
  selected?: boolean;
  onSelect?: VoidFunction;
  onDelete: VoidFunction;
}

export default function FileFolderCard({
  folder,
  selected,
  onSelect,
  onDelete,
  sx,
  ...other
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const [showCheckbox, setShowCheckbox] = useState(false);

  const [openShare, setOpenShare] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);

  const [folderName, setFolderName] = useState(folder.name);

  const [openEditFolder, setOpenEditFolder] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const [favorited, setFavorited] = useState(folder.isFavorited);

  const handleFavorite = () => {
    setFavorited(!favorited);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleShowCheckbox = () => {
    setShowCheckbox(true);
  };

  const handleHideCheckbox = () => {
    setShowCheckbox(false);
  };

  const handleOpenShare = () => {
    setOpenShare(true);
  };

  const handleCloseShare = () => {
    setOpenShare(false);
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleOpenEditFolder = () => {
    setOpenEditFolder(true);
  };

  const handleCloseEditFolder = () => {
    setOpenEditFolder(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangeInvite = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  };

  const handleCopy = () => {
    enqueueSnackbar('Copied!');
    copy(folder.url);
  };

  return (
    <>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.default',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...((showCheckbox || selected) && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorited}
            onChange={handleFavorite}
            sx={{ p: 0.75 }}
          />

          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>

        {(showCheckbox || selected) && onSelect ? (
          <Checkbox
            checked={selected}
            onClick={onSelect}
            icon={<Iconify icon="eva:radio-button-off-fill" />}
            checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          />
        ) : (
          <Box
            component="img"
            src="/assets/icons/files/ic_folder.svg"
            sx={{ width: 40, height: 40 }}
          />
        )}

        <TextMaxLine variant="h6" onClick={handleOpenDetails} sx={{ mt: 1, mb: 0.5 }}>
          {folder.name}
        </TextMaxLine>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Box> {fData(folder.size)} </Box>

          <Box sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }} />

          <Box> {folder.totalFiles} files </Box>
        </Stack>
      </Card>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copy Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenShare();
          }}
        >
          <Iconify icon="eva:share-fill" />
          Share
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenEditFolder();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <FileDetailsDrawer
        item={folder}
        favorited={favorited}
        onFavorite={handleFavorite}
        onCopyLink={handleCopy}
        open={openDetails}
        onClose={handleCloseDetails}
        onDelete={() => {
          handleCloseDetails();
          onDelete();
        }}
      />

      <FileShareDialog
        open={openShare}
        shared={folder.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          handleCloseShare();
          setInviteEmail('');
        }}
      />

      <FileNewFolderDialog
        open={openEditFolder}
        onClose={handleCloseEditFolder}
        title="Edit Folder"
        onUpdate={() => {
          handleCloseEditFolder();
          setFolderName(folderName);
        }}
        folderName={folderName}
        onChangeFolderName={(event) => setFolderName(event.target.value)}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
