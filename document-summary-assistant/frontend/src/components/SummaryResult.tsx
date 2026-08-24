import React from 'react'

export default function SummaryResult({data}:{data:any}){
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Summary</h3>
        <p className="mt-2 text-gray-700">{data.summary}</p>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>{navigator.clipboard.writeText(data.summary)}}>Copy Summary</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>{const blob = new Blob([data.summary], {type:'text/plain'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'summary.txt'; a.click();}}>Download .txt</button>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold">Key Points</h4>
        <ul className="list-disc list-inside mt-2">
          {data.keyPoints && data.keyPoints.map((kp:string,i:number)=>(<li key={i}>{kp}</li>))}
        </ul>
        <h4 className="font-semibold mt-4">Main Ideas</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.mainIdeas && data.mainIdeas.map((mi:string,i:number)=>(<span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">{mi}</span>))}
        </div>
      </div>
    </div>
  )
}
