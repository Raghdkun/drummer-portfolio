/**
 * Resizes an image to the specified dimensions while maintaining aspect ratio
 */
export const resizeImage = async (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      // Calculate new dimensions
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Create canvas and resize
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create blob"))
            return
          }

          // Create new file from blob
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })

          resolve(resizedFile)
        },
        file.type,
        quality,
      )
    }

    img.onerror = () => {
      reject(new Error("Error loading image"))
    }
  })
}

/**
 * Validates if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  const acceptedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  return acceptedImageTypes.includes(file.type)
}

/**
 * Formats file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
