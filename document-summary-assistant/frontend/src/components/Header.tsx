import React from 'react'

export default function Header(){
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto py-4 px-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">DS</div>
        <div>
          <div className="font-semibold text-lg">Document Summary Assistant</div>
          <div className="text-sm text-gray-500">Upload a document and get an intelligent summary in seconds.</div>
        </div>
      </div>
    </header>
  )
}
