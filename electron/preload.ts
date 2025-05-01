import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRequest } from '~/types/Ipc'

contextBridge.exposeInMainWorld('api', {
  trpc: (req: IpcRequest) => ipcRenderer.invoke('trpc', req),
  sendToken: async (token: string) => {
    try {
      const result = await ipcRenderer.invoke('sendToken', token);
      return result;
    } catch (error) {
      console.error('發送Token時發生錯誤:', error);
    }
  }
})
