import { IconButton, Typography } from '@mui/material';
import ReactLightbox, { useLightboxState } from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Iconify from '../iconify';
import StyledLightbox from './styles';
import { LightBoxProps } from './types';
import { useState } from 'react';

// ----------------------------------------------------------------------

const ICON_SIZE = 24;

export default function Lightbox({
  slides,
  disabledZoom,
  disabledVideo,
  disabledTotal,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
  onGetCurrentIndex,
  ...other
}: LightBoxProps) {
  const totalItems = slides ? slides.length : 0;
  const [rotateDeg, setRotateDeg] = useState(0);

  function getRotateLeftImage() {
    setRotateDeg(rotateDeg - 90);
  }

  function getRotateRightImage() {
    setRotateDeg(rotateDeg + 90);
  }

  const checkZeroDeg = () => {
    if ((rotateDeg%360) !== 0) {
      setRotateDeg(Math.floor(rotateDeg / 360) * 360);
    }
  }

  return (
    <>
      <StyledLightbox />

      <ReactLightbox
        slides={slides}
        animation={{ swipe: 240 }}
        carousel={{ finite: totalItems < 5 }}
        controller={{ closeOnBackdropClick: true }}
        plugins={getPlugins({
          disabledZoom,
          disabledVideo,
          disabledCaptions,
          disabledSlideshow,
          disabledThumbnails,
          disabledFullscreen,
        })}
        on={{
          view: ({ index }: { index: number }) => {
            if (onGetCurrentIndex) {
              onGetCurrentIndex(index);
            }
          },
        }}
        toolbar={{
          buttons: [
            <>
              <IconButton
                color="default"
                onClick={getRotateLeftImage}
                sx={{ color: 'white' }}
              >
                <Iconify width={ICON_SIZE} icon="mdi:rotate-left" />
              </IconButton>
            </>,
            <>
              <IconButton
                color="default"
                onClick={getRotateRightImage}
                sx={{ color: 'white' }}
              >
                <Iconify width={ICON_SIZE} icon="mdi:rotate-right" />
              </IconButton>
            </>,
            <DisplayTotal
              key={0}
              totalItems={totalItems}
              disabledTotal={disabledTotal}
              disabledCaptions={disabledCaptions}
            />,
            'close',
          ],
        }}
        render={{
          iconClose: () => <Iconify width={ICON_SIZE} icon="carbon:close" onClick={() => setRotateDeg(0)} />,
          iconZoomIn: () => <Iconify width={ICON_SIZE} icon="carbon:zoom-in" />,
          iconZoomOut: () => <Iconify width={ICON_SIZE} icon="carbon:zoom-out" />,
          iconSlideshowPlay: () => <Iconify width={ICON_SIZE} icon="carbon:play" />,
          iconSlideshowPause: () => <Iconify width={ICON_SIZE} icon="carbon:pause" />,
          iconPrev: () => <Iconify width={ICON_SIZE + 8} icon="carbon:chevron-left" onClick={checkZeroDeg} />,
          iconNext: () => <Iconify width={ICON_SIZE + 8} icon="carbon:chevron-right" onClick={checkZeroDeg} />,
          iconExitFullscreen: () => <Iconify width={ICON_SIZE} icon="carbon:center-to-fit" />,
          iconEnterFullscreen: () => <Iconify width={ICON_SIZE} icon="carbon:fit-to-screen" />,
        }}
        styles={{
          slide: {
            rotate: `z ${rotateDeg}deg`,
            transition: '.5s'
          },
        }}
        {...other}
      />
    </>
  );
}

// ----------------------------------------------------------------------

export function getPlugins({
  disabledZoom,
  disabledVideo,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
}: LightBoxProps) {
  let plugins = [Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom];

  if (disabledThumbnails) {
    plugins = plugins.filter((plugin) => plugin !== Thumbnails);
  }
  if (disabledCaptions) {
    plugins = plugins.filter((plugin) => plugin !== Captions);
  }
  if (disabledFullscreen) {
    plugins = plugins.filter((plugin) => plugin !== Fullscreen);
  }
  if (disabledSlideshow) {
    plugins = plugins.filter((plugin) => plugin !== Slideshow);
  }
  if (disabledZoom) {
    plugins = plugins.filter((plugin) => plugin !== Zoom);
  }
  if (disabledVideo) {
    plugins = plugins.filter((plugin) => plugin !== Video);
  }

  return plugins;
}

// ----------------------------------------------------------------------

type DisplayTotalProps = {
  totalItems: number;
  disabledTotal?: boolean;
  disabledCaptions?: boolean;
};

export function DisplayTotal({ totalItems, disabledTotal, disabledCaptions }: DisplayTotalProps) {
  const { state } = useLightboxState();

  const { currentIndex } = state;

  if (disabledTotal) {
    return null;
  }

  return (
    <Typography
      className="yarl__button"
      sx={{
        pl: 3,
        left: 0,
        position: 'fixed',
        typography: 'body2',
        ...(!disabledCaptions && {
          px: 'unset',
          minWidth: 64,
          position: 'unset',
          textAlign: 'center',
        }),
      }}
    >
      <strong> {currentIndex + 1} </strong> / {totalItems}
    </Typography>
  );
}
