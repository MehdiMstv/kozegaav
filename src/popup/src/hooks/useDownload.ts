import {
  createRef,
  useCallback,
  useMemo,
  useState,
  CSSProperties,
  MouseEvent,
} from 'react';
import html2canvas from 'html2canvas';

import type { ComponentProps } from 'react';
import type { DownloadConfig } from 'types/DownloadConfig';

import constants from 'utils/constants';

import FloatButton from 'components/FloatButton';

// Create audio element only once, outside the hook
const captureSound = new Audio(chrome.runtime.getURL('assets/capture.mp3'));
captureSound.volume = 0.2;

type ButtonProps = ComponentProps<typeof FloatButton>;

const useDownload = ({ exportName, size, style }: DownloadConfig) => {
  const downloadRef = createRef<HTMLDivElement>();
  const [downloading, setDownloading] = useState<boolean>(false);

  const buttonStyle: CSSProperties = useMemo(
    () =>
      downloading
        ? { visibility: 'hidden', opacity: 0, ...style }
        : style || {},
    [downloading, style]
  );

  const wrapperStyle = useMemo(
    () => ({
      transition: 'opacity 0.3s',
      opacity: downloading ? 0.4 : 1,
    }),
    [downloading]
  );

  const downloadImage = useCallback((canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const onDownload = useCallback(
    async (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!downloadRef.current) return;

      try {
        setDownloading(true);
        const canvas = await html2canvas(downloadRef.current, {
          ...size,
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
        });
        
        try {
          await captureSound.play();
        } catch (audioErr) {
          console.warn('Audio play failed:', audioErr);
        }
        
        downloadImage(canvas, `${exportName}.png`);
      } catch (err) {
        console.error('Download failed:', err);
      } finally {
        setDownloading(false);
      }
    },
    [downloadRef, exportName, size, downloadImage]
  );

  const downloadButtonProps: ButtonProps = {
    onClick: onDownload,
    style: buttonStyle,
    text: constants.download,
    title: constants.saveData,
    type: 'download',
  };

  return {
    buttonStyle,
    DownloadButton: FloatButton,
    downloadButtonProps,
    downloadRef,
    wrapperStyle,
  };
};

export default useDownload;
