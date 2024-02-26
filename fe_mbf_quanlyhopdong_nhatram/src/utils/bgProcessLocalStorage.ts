import { IBgProcess } from 'src/@types/process';
import { LOCAL_STORAGE } from 'src/config-global';

export const addBgProcess = (process: IBgProcess) => {
  const bgProcess: string | null = localStorage.getItem(LOCAL_STORAGE.BG_PROCESS);
  const currentProcesses: IBgProcess[] = bgProcess ? (JSON.parse(bgProcess) as []) : [];
  localStorage.setItem(
    LOCAL_STORAGE.BG_PROCESS,
    JSON.stringify(currentProcesses.concat([process]))
  );
  window.dispatchEvent(new Event('storage'));
};

export const removeBgProcess = (id: number) => {
  const bgProcess: string | null = localStorage.getItem(LOCAL_STORAGE.BG_PROCESS);
  const currentProcesses: IBgProcess[] = bgProcess ? (JSON.parse(bgProcess) as []) : [];

  const newProcesses = currentProcesses.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE.BG_PROCESS, JSON.stringify(newProcesses));
  window.dispatchEvent(new Event('storage'));
};
