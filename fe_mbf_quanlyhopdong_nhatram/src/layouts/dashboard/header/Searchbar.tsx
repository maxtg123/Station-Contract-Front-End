import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { memo, useEffect, useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import {
  Autocomplete,
  Box,
  ClickAwayListener,
  InputAdornment,
  InputBase,
  Popper,
  PopperProps,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// utils
import { bgBlur } from '../../../utils/cssStyles';
import flattenArray from '../../../utils/flattenArray';
// components
import Iconify from '../../../components/iconify';
import { NavListProps } from '../../../components/nav-section';
import SearchNotFound from '../../../components/search-not-found';
//
import NavConfig from '../nav/config-navigation';

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 64;

const StyledSearchbar = styled('div')(({ theme }) => ({
  width: 300,
  height: APPBAR_MOBILE / 1.5,
  // ...bgBlur({ color: theme.palette.background.default }),
  // top: 0,
  // left: 0,
  // zIndex: 99,
  backgroundColor: '#F5F7FA',
  // width: '100%',
  display: 'flex',
  // position: 'absolute',
  alignItems: 'center',
  borderRadius: 30,
  // height: APPBAR_MOBILE,
  // padding: theme.spacing(0, 3),
  // boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP / 1.5,
    // padding: theme.spacing(0, 5),
  },
}));

const StyledPopper = styled((props: PopperProps) => <Popper {...props} />)(({ theme }) => ({
  left: `8px !important`,
  top: `${APPBAR_MOBILE + 8}px !important`,
  width: 'calc(100% - 16px) !important',
  transform: 'none !important',
  [theme.breakpoints.up('md')]: {
    top: `${APPBAR_DESKTOP + 8}px !important`,
  },
  '& .MuiAutocomplete-paper': {
    padding: theme.spacing(1, 0),
  },
  '& .MuiListSubheader-root': {
    '&.MuiAutocomplete-groupLabel': {
      ...bgBlur({ color: theme.palette.background.neutral }),
      ...theme.typography.overline,
      top: 0,
      margin: 0,
      lineHeight: '48px',
      borderRadius: theme.shape.borderRadius,
    },
  },
  '& .MuiAutocomplete-listbox': {
    '& .MuiAutocomplete-option': {
      padding: theme.spacing(0.5, 2),
      margin: 0,
      display: 'block',
      border: `dashed 1px transparent`,
      borderBottomColor: theme.palette.divider,
      '&:last-of-type': {
        borderBottomColor: 'transparent',
      },
      '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
      },
    },
  },
}));

// ----------------------------------------------------------------------

interface Option extends NavListProps {
  subheader: string;
}

function Searchbar() {
  const { push, pathname } = useRouter();

  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const reduceItems = NavConfig.map((list) =>
    handleLoop(list.items, (list as any).subheader)
  ).flat();

  const allItems = flattenArray(reduceItems).map((option) => {
    const group = splitPath(reduceItems, option.path);

    return {
      group: group && group.length > 1 ? group[0] : (option as Option).subheader,
      title: option.title,
      path: option.path,
      indexKey: 'minimal',
    };
  });

  useEffect(() => {
    if (open) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (path: string) => {
    if (path.includes('http')) {
      if (typeof window !== 'undefined') {
        window.open(path);
      }
    } else {
      push(path);
    }
    handleClose();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleClick(searchQuery);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {/* {!open && (
          <IconButtonAnimate onClick={handleOpen}>
            <Iconify icon="eva:search-fill" />
          </IconButtonAnimate>
        )} */}
        <StyledSearchbar>
          <Autocomplete
            sx={{ width: 1, height: 1 }}
            autoHighlight
            disablePortal
            disableClearable={false}
            popupIcon={null}
            PopperComponent={StyledPopper}
            onInputChange={(event, value) => setSearchQuery(value)}
            noOptionsText={<SearchNotFound query={searchQuery} sx={{ py: 10 }} />}
            options={allItems.sort((a, b) => -b.group.localeCompare(a.group))}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => `${option.title} ${option.path} ${option.indexKey}`}
            renderInput={(params) => (
              <InputBase
                {...params.InputProps}
                inputProps={params.inputProps}
                fullWidth
                autoFocus
                placeholder="Tìm kiếm chức năng"
                onKeyUp={handleKeyUp}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                }
                sx={{ height: 1, pl: '20px' }}
              />
            )}
            renderOption={(props, option, { inputValue }) => {
              const { title, path } = option;

              const partsTitle = parse(title, match(title, inputValue));

              const partsPath = parse(path, match(path, inputValue));

              return (
                <Box component="li" {...props} onClick={() => handleClick(path)}>
                  <div>
                    {partsTitle.map((part, index) => (
                      <Box
                        key={index}
                        component="span"
                        sx={{
                          typography: 'subtitle2',
                          textTransform: 'capitalize',
                          color: part.highlight ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {part.text}
                      </Box>
                    ))}
                  </div>

                  <div>
                    {partsPath.map((part, index) => (
                      <Box
                        key={index}
                        component="span"
                        sx={{
                          typography: 'caption',
                          color: part.highlight ? 'primary.main' : 'text.secondary',
                        }}
                      >
                        {part.text}
                      </Box>
                    ))}
                  </div>
                </Box>
              );
            }}
          />
        </StyledSearchbar>
        {/*             
        <Slide direction="down" in={open} mountOnEnter unmountOnExit>
          <StyledSearchbar>
            <Autocomplete
              sx={{ width: 1, height: 1 }}
              autoHighlight
              disablePortal
              disableClearable
              popupIcon={null}
              PopperComponent={StyledPopper}
              onInputChange={(event, value) => setSearchQuery(value)}
              noOptionsText={<SearchNotFound query={searchQuery} sx={{ py: 10 }} />}
              options={allItems.sort((a, b) => -b.group.localeCompare(a.group))}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => `${option.title} ${option.path} ${option.indexKey}`}
              renderInput={(params) => (
                <InputBase
                  {...params.InputProps}
                  inputProps={params.inputProps}
                  fullWidth
                  autoFocus
                  placeholder="Tìm kiếm chức năng..."
                  onKeyUp={handleKeyUp}
                  startAdornment={
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  }
                  sx={{ height: 1, typography: 'h6' }}
                />
              )}
              renderOption={(props, option, { inputValue }) => {
                const { title, path } = option;
                const partsTitle = parse(title, match(title, inputValue));
                const partsPath = parse(path, match(path, inputValue));
                return (
                  <Box component="li" {...props} onClick={() => handleClick(path)}>
                    <div>
                      {partsTitle.map((part, index) => (
                        <Box
                          key={index}
                          component="span"
                          sx={{
                            typography: 'subtitle2',
                            textTransform: 'capitalize',
                            color: part.highlight ? 'primary.main' : 'text.primary',
                          }}
                        >
                          {part.text}
                        </Box>
                      ))}
                    </div>
                    <div>
                      {partsPath.map((part, index) => (
                        <Box
                          key={index}
                          component="span"
                          sx={{
                            typography: 'caption',
                            color: part.highlight ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {part.text}
                        </Box>
                      ))}
                    </div>
                  </Box>
                );
              }}
            />
          </StyledSearchbar>
        </Slide> */}
      </div>
    </ClickAwayListener>
  );
}

export default memo(Searchbar);

// ----------------------------------------------------------------------

type ItemProps = {
  path: string[];
  currItem: NavListProps;
};

function splitPath(array: NavListProps[], key: string) {
  let stack = array.map((item) => ({
    path: [item.title],
    currItem: item,
  }));

  while (stack.length) {
    const { path, currItem } = stack.pop() as ItemProps;

    if (currItem.path === key) {
      return path;
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map((item: NavListProps) => ({
          path: path.concat(item.title),
          currItem: item,
        }))
      );
    }
  }
  return null;
}

// ----------------------------------------------------------------------

function handleLoop(array: any, subheader?: string) {
  return array?.map((list: any) => ({
    subheader,
    ...list,
    ...(list.children && {
      children: handleLoop(list.children, subheader),
    }),
  }));
}
