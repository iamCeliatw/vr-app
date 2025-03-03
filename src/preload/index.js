import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import path from 'path'

// Custom APIs for renderer
const api = {}
const getAssetPath = (dir, filePath) => {
  let basePath = ''

  // 由於在 preload 腳本中無法直接訪問 __dirname，您可能需要使用其他方式來確定基礎路徑
  // 例如，使用 app.getAppPath() 來獲取應用的安裝路徑

  // 判斷當前運行模式，調整 basePath 的賦值邏輯
  const isPackaged = process.env.NODE_ENV === 'production'
  if (isPackaged) {
    // 生產模式
    if (process.platform === 'darwin') {
      // macOS
      basePath = `file://${path.join(__dirname, dir, filePath)}`
    } else if (process.platform === 'win32') {
      // Windows
      basePath = `file://${path.join(__dirname, dir, filePath).replace(/\\/g, '/')}`
    }
  } else {
    // 開發模式
    basePath = `${path.join(dir, filePath)}`
  }
  return basePath
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('asset_path', {
      getAssetPath: getAssetPath
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.assetPath = {
    getAssetPath: getAssetPath
  }
}
