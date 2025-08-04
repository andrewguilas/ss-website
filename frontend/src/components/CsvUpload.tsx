import { useState } from "react"

function CsvUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [clearDB, setClearDB] = useState(false)

  const handleUpload = async () => {
    if (!file) return alert("Please select a file")

    if (clearDB) {
      try {
        await fetch("http://localhost:8000/clear-database", {
          method: "DELETE",
        })
        alert("Database cleared.")
      } catch (err) {
        alert("Failed to clear database.")
        return
      }
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:8000/upload-orders", {
        method: "POST",
        body: formData,
      })

      const json = await res.json()
      alert(`Inserted ${json.inserted} orders. Skipped ${json.skipped}.`)
    } catch (err) {
      alert("Upload failed.")
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Upload CSV</h2>

      <div className="mb-2">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={clearDB}
            onChange={(e) => setClearDB(e.target.checked)}
          />
          Clear database before upload
        </label>
      </div>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>

    </div>
  )
}

export default CsvUpload
