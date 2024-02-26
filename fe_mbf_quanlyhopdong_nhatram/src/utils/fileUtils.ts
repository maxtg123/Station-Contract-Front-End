import JSZip from 'jszip';
import { IFileData } from 'src/@types/file';
import { fileNameByUrl, fileTypeByUrl } from 'src/components/file-thumbnail';

export const urlToFile = (blobUrl: string): Promise<File> =>
  new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        // please change the file.extension with something more meaningful
        // or create a utility function to parse from URL
        const name = fileNameByUrl(blobUrl);
        const type = fileTypeByUrl(blobUrl);
        const file = new File([blob], name || 'default.png', { type: type || blob.type });
        resolve(file);
      });
    });
  });

export const urlsToFiles = async (urls: string[] = []): Promise<File[]> => {
  const prs: Promise<File>[] = [];
  urls.forEach((url) => {
    prs.push(urlToFile(url));
  });
  try {
    return await Promise.all(prs);
  } catch (e) {
    return [];
  }
};

export const download = async ({ url, fileName }: { url: string; fileName: string }) => {
  const data = await fetch(url);
  const blob = await data.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.setAttribute('href', objectUrl);
  link.setAttribute('download', fileName);
  link.style.display = 'none';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

export const downloadZip = async (
  endpoint: string,
  data: IFileData[],
  soHopDong: string,
  type: string
) => {
  const zip = new JSZip();

  const promises = data.map(async (item) => {
    const temp = await urlToFile(`${endpoint}/${item.path}`);
    return { file: temp, id: item.id, createdAt: item.createdAt, path: item.path };
  });
  const dataFileFromUrl = await Promise.all(promises);
  dataFileFromUrl.forEach((file) => {
    zip.file(`${file.file.name}.${file.file.type}`, file.file);
  });

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${type}_${soHopDong}.zip`;
    link.click();
  } catch (error) {
    console.error('Error creating zip:', error);
  }
};

export const storagePath = (relativePath: string): string => {
  const storageEndPoint = process.env.NEXT_PUBLIC_STORAGE_ENDPOINT || '';
  if (relativePath.includes(storageEndPoint)) {
    return relativePath;
  }
  return `${storageEndPoint}/${relativePath}`;
};

export const handleDownloadTemplates = (url: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
