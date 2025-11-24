import { useState } from 'react'
import { jwtAPI } from '../services/api'

function JWTEncoder() {
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "Robinson Molina",\n  "iat": 1516239022\n}')
  const [secret, setSecret] = useState('robin1234')
  const [algorithm, setAlgorithm] = useState('HS256')
  const [expiresIn, setExpiresIn] = useState('3600')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)

  const handleEncode = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payloadObj = JSON.parse(payload)
      const data = await jwtAPI.encode(
        payloadObj, 
        secret, 
        algorithm,
        expiresIn ? parseInt(expiresIn) : null
      )
      setResult(data)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('JSON inválido en el payload')
      } else {
        setError(err.response?.data?.detail?.errors?.[0] || 'Error al codificar JWT')
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result?.token) {
      navigator.clipboard.writeText(result.token)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const loadTemplate = (template) => {
    const templates = {
      basic: '{\n  "sub": "user123",\n  "name": "Test User"\n}',
      withClaims: '{\n  "sub": "user123",\n  "name": "Robinson Molina",\n  "email": "robin@example.com",\n  "role": "admin"\n}',
      withTime: `{\n  "sub": "user123",\n  "name": "Felipe Granados",\n  "iat": ${Math.floor(Date.now() / 1000)}\n}`
    }
    setPayload(templates[template])
  }

  return (
    <div className="space-y-6">
      {showToast && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">¡Token copiado al portapapeles!</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Nuevo JWT</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payload (JSON):
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder='{"sub": "1234567890", "name": "Robinson Molina"}'
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => loadTemplate('basic')}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                Básico
              </button>
              <button
                onClick={() => loadTemplate('withClaims')}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                Con Claims
              </button>
              <button
                onClick={() => loadTemplate('withTime')}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                Con Tiempo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret:
              </label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Robin1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Algoritmo:
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HS256">HS256</option>
                <option value="HS384">HS384</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expira en (segundos):
              </label>
              <input
                type="number"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                placeholder="3600"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleEncode}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Generando...' : 'Generar JWT'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Token Completo</h3>
              <button
                onClick={copyToClipboard}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium transition-colors"
              >
                📋 Copiar
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              <code className="text-xs text-gray-800 break-all">
                {result.token}
              </code>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-blue-600 mb-3">Header</h4>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto mb-3">
                {JSON.stringify(result.decoded.header, null, 2)}
              </pre>
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600 break-all">
                  <strong>Base64URL:</strong> {result.parts.header}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-green-600 mb-3">Payload</h4>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto mb-3">
                {JSON.stringify(result.decoded.payload, null, 2)}
              </pre>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-xs text-gray-600 break-all">
                  <strong>Base64URL:</strong> {result.parts.payload}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-bold text-purple-600 mb-3">Signature</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Algoritmo:</strong> {result.algorithm}
                </p>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs text-gray-600 break-all">
                    {result.parts.signature}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Advertencias:</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                {result.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JWTEncoder