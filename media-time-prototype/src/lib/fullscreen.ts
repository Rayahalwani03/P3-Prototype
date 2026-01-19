/**
 * Utility functions for managing fullscreen mode
 */

/**
 * Requests fullscreen mode
 */
export async function requestFullscreen(): Promise<void> {
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen()
    } else if ((document.documentElement as any).webkitRequestFullscreen) {
      // Safari
      await (document.documentElement as any).webkitRequestFullscreen()
    } else if ((document.documentElement as any).mozRequestFullScreen) {
      // Firefox
      await (document.documentElement as any).mozRequestFullScreen()
    } else if ((document.documentElement as any).msRequestFullscreen) {
      // IE/Edge
      await (document.documentElement as any).msRequestFullscreen()
    }
  } catch (error) {
    // User denied fullscreen or browser doesn't support it
    console.warn('Fullscreen request failed:', error)
  }
}

/**
 * Exits fullscreen mode
 */
export async function exitFullscreen(): Promise<void> {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      // Safari
      await (document as any).webkitExitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      await (document as any).mozCancelFullScreen()
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      await (document as any).msExitFullscreen()
    }
  } catch (error) {
    console.warn('Exit fullscreen failed:', error)
  }
}
