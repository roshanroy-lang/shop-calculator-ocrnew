import React, { useState } from 'react'
import Tesseract from 'tesseract.js'

export default function App() {
  const [image, setImage] = useState(null)
  const [numbers, setNumbers] = useState([])
  const [loading, setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      extractText(file)
    }
  }

  const extractText = async (file) => {
    setLoading(true)
    const result = await Tesseract.recognize(file, 'eng')
    const text = result.data.text

    const nums = text
      .match(/[-]?\d+(?:\.\d+)?/g)
      ?.map(n => Number(n)) || []

    setNumbers(nums)
    setLoading(false)
  }

  const updateNumber = (index, value) => {
    const copy = [...numbers]
    copy[index] = Number(value) || 0
    setNumbers(copy)
  }

  return (
    <div style={{ padding: 20, fontSize: 20 }}>
      <h2>📸 Shop Calculator OCR</h2>

      <input type="file" accept="image/*" onChange={handleImage} />

      {loading && <p>Processing image…</p>}

      {image && <img src={image} alt="" style={{ width: '100%', marginTop: 20 }} />}

      {numbers.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Extracted Numbers:</h3>

          {numbers.map((num, i) => (
            <input
              key={i}
              value={num}
              onChange={(e) => updateNumber(i, e.target.value)}
              style={{ fontSize: 24, width: '100%', marginBottom: 10, padding: 5 }}
            />
          ))}

          <h2>Total: {numbers.reduce((a, b) => a + b, 0)}</h2>
        </div>
      )}
    </div>
  )
}
