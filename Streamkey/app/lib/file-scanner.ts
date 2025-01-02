export interface MediaFile {
  path: string
  name: string
  type: 'movie' | 'series' | 'anime'
  title: string
  file: File
  thumbnailFile?: File
  tags?: string[]
}

export interface ScanPath {
  handle: FileSystemDirectoryHandle
  path: string
  type: 'movie' | 'series' | 'anime'
}

const SCAN_PATHS_KEY = 'streamkey_scan_paths'

export function cleanTitle(filename: string): string {
  // Remove common video quality indicators and clean up the title
  const cleanName = filename
    .replace(/\[(.*?)\]/g, '') // Remove content in brackets
    .replace(/$$(.*?)$$/g, '') // Remove content in parentheses
    .replace(/\{(.*?)\}/g, '') // Remove content in curly braces
    .replace(/\.(?:480p|720p|1080p|2160p|DVD|BluRay|WEB-DL|BRRip|HDRip|x264|h264|AAC|AC3|mp4|mkv|avi)/gi, '')
    .replace(/(?:_|\.)(?:dt|ger|eng|multi)(?:_|\.)/gi, '') // Remove language indicators
    .replace(/\._.*$/, '') // Remove anything after '._'
    .replace(/\.[^/.]+$/, '') // Remove file extension
    .replace(/[._-]/g, ' ') // Replace separators with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()

  return cleanName
}

export async function verifyPathPermission(handle: FileSystemDirectoryHandle): Promise<boolean> {
  try {
    // Verify read permission
    const permission = await handle.queryPermission({ mode: 'read' })
    if (permission === 'granted') {
      return true
    }
    
    // Request permission if not already granted
    const newPermission = await handle.requestPermission({ mode: 'read' })
    return newPermission === 'granted'
  } catch (error) {
    console.error('Error verifying path permission:', error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Berechtigung konnte nicht überprüft werden'
    )
  }
}

export async function scanDirectory(handle: FileSystemDirectoryHandle): Promise<MediaFile[]> {
  const mediaFiles: MediaFile[] = []
  const videoExtensions = new Set(['.mp4', '.mkv', '.avi'])
  const imageExtensions = new Set(['.jpg', '.jpeg', '.png'])

  // Verify permission before scanning
  const hasPermission = await verifyPathPermission(handle)
  if (!hasPermission) {
    throw new Error('Keine Berechtigung zum Lesen des Verzeichnisses')
  }

  async function processDirectory(dirHandle: FileSystemDirectoryHandle, currentPath: string = ''): Promise<void> {
    try {
      for await (const entry of dirHandle.values()) {
        const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name

        if (entry.kind === 'directory') {
          const subDirHandle = await dirHandle.getDirectoryHandle(entry.name)
          await processDirectory(subDirHandle, entryPath)
          continue
        }

        const ext = `.${entry.name.split('.').pop()?.toLowerCase() || ''}`
        
        if (videoExtensions.has(ext)) {
          try {
            const file = await entry.getFile()
            const cleanedTitle = cleanTitle(entry.name)
            
            // Try to find a matching thumbnail
            let thumbnailFile: File | undefined
            const baseName = entry.name.substring(0, entry.name.lastIndexOf('.'))
            
            for (const imgExt of imageExtensions) {
              try {
                const thumbnailHandle = await dirHandle.getFileHandle(`${baseName}${imgExt}`)
                if (thumbnailHandle) {
                  thumbnailFile = await thumbnailHandle.getFile()
                  break
                }
              } catch {
                continue
              }
            }

            mediaFiles.push({
              path: entryPath,
              name: entry.name,
              type: 'movie', // This will be overridden by the caller
              title: cleanedTitle,
              file,
              thumbnailFile,
              tags: []
            })
          } catch (error) {
            console.error(`Error processing file ${entry.name}:`, error)
          }
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${currentPath}:`, error)
      throw new Error(
        error instanceof Error 
          ? error.message 
          : `Verzeichnis ${currentPath} konnte nicht verarbeitet werden`
      )
    }
  }

  await processDirectory(handle)
  return mediaFiles
}

export async function storeScanPath(handle: FileSystemDirectoryHandle, type: 'movie' | 'series' | 'anime'): Promise<void> {
  try {
    // Get existing paths
    const existingPaths = await getScanPaths()
    
    // Check if path already exists
    const pathExists = existingPaths.some(p => p.path === handle.name && p.type === type)
    if (pathExists) {
      throw new Error('Dieser Pfad wurde bereits hinzugefügt')
    }
    
    // Add new path
    const newPath = {
      path: handle.name,
      type,
      handle
    }
    
    existingPaths.push(newPath)
    
    // Store updated paths (only store serializable data)
    const pathsToStore = existingPaths.map(p => ({
      path: p.path,
      type: p.type
    }))
    
    localStorage.setItem(SCAN_PATHS_KEY, JSON.stringify(pathsToStore))
  } catch (error) {
    console.error('Error storing scan path:', error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Der Pfad konnte nicht gespeichert werden'
    )
  }
}

export async function getScanPaths(): Promise<ScanPath[]> {
  try {
    const storedPaths = localStorage.getItem(SCAN_PATHS_KEY)
    if (!storedPaths) return []
    
    const paths = JSON.parse(storedPaths)
    const results: ScanPath[] = []
    
    for (const path of paths) {
      try {
        // Request directory access again
        const handle = await window.showDirectoryPicker({
          mode: 'read'
        })
        
        // Verify permission
        const hasPermission = await verifyPathPermission(handle)
        if (hasPermission) {
          results.push({
            handle,
            path: path.path,
            type: path.type
          })
        }
      } catch (error) {
        console.error(`Error restoring path ${path.path}:`, error)
      }
    }
    
    return results
  } catch (error) {
    console.error('Error getting scan paths:', error)
    return []
  }
}

export async function removeScanPath(pathToRemove: ScanPath): Promise<void> {
  try {
    const paths = await getScanPaths()
    const updatedPaths = paths.filter(p => 
      !(p.path === pathToRemove.path && p.type === pathToRemove.type)
    )
    
    // Store updated paths
    const pathsToStore = updatedPaths.map(p => ({
      path: p.path,
      type: p.type
    }))
    
    localStorage.setItem(SCAN_PATHS_KEY, JSON.stringify(pathsToStore))
  } catch (error) {
    console.error('Error removing scan path:', error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Der Pfad konnte nicht entfernt werden'
    )
  }
}

