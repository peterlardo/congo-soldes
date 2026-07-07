"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  folder?: string
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  folder = "promotions",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxImages - images.length)
    if (fileArray.length === 0) {
      toast.error(`Maximum ${maxImages} images autorisées`)
      return
    }

    setUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} n'est pas une image valide`)
          continue
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} dépasse 5 Mo`)
          continue
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (res.ok && data.url) {
          uploadedUrls.push(data.url)
        } else {
          toast.error(data.error || "Erreur lors de l'upload")
        }
      }
      onImagesChange([...images, ...uploadedUrls])
      if (uploadedUrls.length > 0) {
        toast.success(`${uploadedUrls.length} image(s) uploadée(s)`)
      }
    } catch {
      toast.error("Erreur lors de l'upload")
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, folder, onImagesChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }, [handleUpload])

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={url}
              alt={`Image ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragging
              ? "border-primary-400 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary-500" />
              <p className="text-sm text-gray-500">Upload en cours...</p>
            </>
          ) : (
            <>
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">
                Cliquez ou glissez-déposez des images
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, WEBP - Max 5 Mo - {images.length}/{maxImages}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />
    </div>
  )
}
