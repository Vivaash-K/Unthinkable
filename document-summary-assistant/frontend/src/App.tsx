import React, { useState } from 'react'
import Header from './components/Header'
import FileUpload from './components/FileUpload'
import SummaryResult from './components/SummaryResult'

function App() {
  const [fileInfo, setFileInfo] = useState<{filename: string; type: string} | null>(null)
  const [text, setText] = useState('')
  const [summary, setSummary] = useState<any>(null)
  const [length, setLength] = useState<'short'|'medium'|'long'>('short')
  const [status, setStatus] = useState('idle')

  async function handleUpload(file: File) {
    const fd = new FormData()
    fd.append('file', file)
    setStatus('uploading')
    const res = await fetch('http://localhost:8000/api/upload', { method: 'POST', body: fd })
    if (!res.ok) {
      alert('Upload failed')
      setStatus('idle')
      return
    }
    const data = await res.json()
    setFileInfo({filename: data.filename, type: data.content_type})
    setStatus('uploaded')
  }

  async function handleProcess() {
    if (!fileInfo) return
    setStatus('processing')
    const fd = new FormData()
    fd.append('filename', fileInfo.filename)
    const res = await fetch('http://localhost:8000/api/process', { method: 'POST', body: fd })
    if (!res.ok) { const text = await res.text(); alert(text); setStatus('idle'); return }
    const data = await res.json()
    setText(data.text)
    setStatus('processed')
  }

  async function handleSummarize() {
    if (!text) { alert('No extracted text'); return }
    setStatus('summarizing')
    const fd = new FormData()
    fd.append('text', text)
    fd.append('summaryLength', length)
    const res = await fetch('http://localhost:8000/api/summarize', { method: 'POST', body: fd })
    const data = await res.json()
    setSummary(data)
    setStatus('done')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <FileUpload onUpload={handleUpload} fileInfo={fileInfo} onRemove={() => {setFileInfo(null); setText(''); setSummary(null)}} />

        <div className="mt-4">
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded ${length==='short'? 'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setLength('short')}>Short</button>
            <button className={`px-3 py-1 rounded ${length==='medium'? 'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setLength('medium')}>Medium</button>
            <button className={`px-3 py-1 rounded ${length==='long'? 'bg-blue-600 text-white':'bg-white'}`} onClick={()=>setLength('long')}>Long</button>
            <button className="ml-auto px-4 py-2 bg-green-600 text-white rounded" onClick={handleProcess} disabled={!fileInfo}>Extract Text</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={handleSummarize} disabled={!text}>Generate Summary</button>
          </div>
          <div className="mt-3 text-sm text-gray-600">Status: {status}</div>
        </div>

        {summary && <SummaryResult data={summary} />}

      </main>
    </div>
  )
}

export default App
