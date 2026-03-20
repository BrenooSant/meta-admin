export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  outputSize = 512,
  fileName = 'cropped.jpg',
): Promise<File> {
  const image = await createImageBitmap(await (await fetch(imageSrc)).blob())

  const canvas = document.createElement('canvas')
  canvas.width  = outputSize
  canvas.height = outputSize

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputSize,
    outputSize,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas vazio'))
      resolve(new File([blob], fileName, { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.92)
  })
}