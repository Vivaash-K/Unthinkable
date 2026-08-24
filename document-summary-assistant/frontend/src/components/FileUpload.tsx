import React, { useRef } from 'react'

export default function FileUpload({onUpload, fileInfo, onRemove}:{onUpload:(f:File)=>void, fileInfo:any, onRemove:()=>void}){
  const inputRef = useRef<HTMLInputElement|null>(null)

  function handlePick(){
    inputRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]
    if (f) onUpload(f)
  }

  function onDrop(e: React.DragEvent){
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) onUpload(f)
  }

  return (
    <section>
      {!fileInfo ? (
        <div onDrop={onDrop} onDragOver={e=>e.preventDefault()} className="border-2 border-dashed border-gray-300 rounded p-8 text-center bg-white">
          <p className="text-gray-700">Drag & drop a PDF or image here</p>
          <p className="text-sm text-gray-500 mt-2">PDF, PNG, JPG/JPEG supported</p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handlePick}>Browse files</button>
            <input ref={inputRef} type="file" accept="application/pdf,image/png,image/jpeg" onChange={onFileChange} className="hidden" />
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="font-medium">{fileInfo.filename}</div>
            <div className="text-sm text-gray-500">{fileInfo.type}</div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={onRemove}>Remove</button>
          </div>
        </div>
      )}
    </section>
  )
}
