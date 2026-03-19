const CLOUD_NAME = 'dmzwpcitd'
const UPLOAD_PRESET = 'meta-comprovantes'

export async function uploadComprovante(file: File): Promise<string | null> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    return data.secure_url ?? null
  } catch {
    return null
  }
}