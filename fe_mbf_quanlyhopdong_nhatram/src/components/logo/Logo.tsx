import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Box, BoxProps, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    // const logo = (
    //   <Box
    //     ref={ref}
    //     component="div"
    //     sx={{
    //       width: 40,
    //       height: 40,
    //       display: 'inline-flex',
    //       ...sx,
    //     }}
    //     {...other}
    //   >
    //     <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
    //       <defs>
    //         <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
    //           <stop offset="0%" stopColor={PRIMARY_DARK} />
    //           <stop offset="100%" stopColor={PRIMARY_MAIN} />
    //         </linearGradient>

    //         <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
    //           <stop offset="0%" stopColor={PRIMARY_LIGHT} />
    //           <stop offset="100%" stopColor={PRIMARY_MAIN} />
    //         </linearGradient>

    //         <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
    //           <stop offset="0%" stopColor={PRIMARY_LIGHT} />
    //           <stop offset="100%" stopColor={PRIMARY_MAIN} />
    //         </linearGradient>
    //       </defs>

    //       <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
    //         <path
    //           fill="url(#BG1)"
    //           d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
    //         />
    //         <path
    //           fill="url(#BG2)"
    //           d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
    //         />
    //         <path
    //           fill="url(#BG3)"
    //           d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
    //         />
    //       </g>
    //     </svg>
    //   </Box>
    // );
    const logoMobifone = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 42 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M34.7118 17.9474C31.0969 11.6227 27.3602 5.66388 23.0677 14.4049C22.4805 15.5286 22.0525 17.7124 21.0938 17.7124V17.7013C20.135 17.7013 19.7071 15.5175 19.1199 14.3938C14.8273 5.65278 11.0906 11.6116 7.47574 17.9363C7.2037 18.4132 6.94238 18.8685 6.71875 19.2641C15.003 14.0198 14.3055 29.863 21.0938 29.9889V30C27.8821 29.8741 27.1845 14.0309 35.4688 19.275C35.2453 18.8795 34.9839 18.4243 34.7118 17.9474Z"
            fill="url(#paint0_linear_700_21762)"
          />
          <path
            d="M6.74623 19.2467C10.7431 16.733 12.6434 19.1419 14.31 22.3104C12.9309 24.8215 12.0185 26.3539 11.5728 26.9076C10.7323 27.9521 9.81534 28.743 8.68763 29.1993C6.31686 30.3135 3.36966 30.3656 1.09375 28.9881L6.74623 19.2467Z"
            fill="url(#paint1_linear_700_21762)"
          />
          <path
            d="M35.5638 19.0465C31.567 16.5328 29.6666 18.9417 28 22.1102C29.3792 24.6213 30.2915 26.1537 30.7373 26.7074C31.5778 27.7519 32.4947 28.5428 33.6224 28.9991C35.9932 30.1133 38.9404 30.1654 41.2163 28.7879L35.5638 19.0465Z"
            fill="url(#paint2_linear_700_21762)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_700_21762"
              x1="6.71875"
              y1="10"
              x2="6.71875"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={PRIMARY_DARK} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
            <linearGradient
              id="paint1_linear_700_21762"
              x1="11.875"
              y1="13.1085"
              x2="5.11899"
              y2="20.2831"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
            <linearGradient
              id="paint2_linear_700_21762"
              x1="30.4351"
              y1="12.9083"
              x2="37.1911"
              y2="20.0829"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
          </defs>
        </svg>
      </Box>
    );
    if (disabledLink) {
      return logoMobifone;
    }

    return (
      <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
        {logoMobifone}
      </Link>
    );
  }
);

export default Logo;
