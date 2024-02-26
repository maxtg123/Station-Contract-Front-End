import { Divider, Drawer, IconButton, Stack, Switch, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { IHead } from 'src/@types/common';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { DRAG_HOP_DONG_IBC_COL } from 'src/constants/hopdongibc.constant';

type Props = {
  open: boolean;
  onClose: VoidFunction;
  title: string;
  data: IHead[];
  onDragColumn: (value: IHead[]) => void;
};
const WIDTH_DRAWER = 360;
const SPACING = 2.5;

const grid = 2;

const reorder = (list: IHead[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: grid,
});

export default function DragColumnTableHopDongIbc({
  open,
  onClose,
  title,
  data,
  onDragColumn,
}: Props) {
  const theme = useTheme();
  const [items, setItems] = useState<IHead[]>(data);
  const [, setLocalStorageData] = useState<IHead[]>([]);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const reorderedItems = reorder(items, result.source.index, result.destination.index);
    setItems(reorderedItems);
    setLocalStorageData(reorderedItems);
    localStorage.setItem(DRAG_HOP_DONG_IBC_COL, JSON.stringify(reorderedItems));
    onDragColumn(reorderedItems);
  };
  const handleToggleChecked = (itemId: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, checked: !item.checked };
      }
      return { ...item };
    });
    setLocalStorageData(updatedItems);
    localStorage.setItem(DRAG_HOP_DONG_IBC_COL, JSON.stringify(updatedItems));
    setItems(updatedItems);
    onDragColumn(updatedItems);
  };
  useEffect(() => {
    const localStorageValue = localStorage.getItem(DRAG_HOP_DONG_IBC_COL);
    if (localStorageValue) {
      const parsedData = JSON.parse(localStorageValue);
      setItems(parsedData);
      setLocalStorageData(parsedData);
    } else {
      setItems(data);
      setLocalStorageData(data);
    }
  }, [data]);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      BackdropProps={{ invisible: true }}
      PaperProps={{
        sx: {
          width: WIDTH_DRAWER,
          boxShadow: `-24px 12px 40px 0 ${alpha(
            theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
            0.16
          )}`,
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 2, pr: 1, pl: SPACING }}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1, color: '#00B8D9' }}>
          {title}
        </Typography>

        <IconButton onClick={onClose}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Scrollbar sx={{ p: SPACING, pb: 0 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {items.map((item: IHead, index: number) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(providedItem, snapshotItem) => (
                      <Stack
                        ref={providedItem.innerRef}
                        {...providedItem.draggableProps}
                        {...providedItem.dragHandleProps}
                        style={getItemStyle(
                          snapshotItem.isDragging,
                          providedItem.draggableProps.style
                        )}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify icon="eva:menu-2-fill" />
                          <Typography variant="body1">{item.label}</Typography>
                        </Stack>
                        <Switch
                          size="medium"
                          checked={item.checked}
                          onChange={() => handleToggleChecked(item.id)}
                        />
                      </Stack>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Scrollbar>
    </Drawer>
  );
}
