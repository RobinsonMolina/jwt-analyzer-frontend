import { useState } from 'react'
import { jwtAPI } from '../services/api'

function JWTAnalyzer() {
  const [token, setToken] = useState('')
  const [secret, setSecret] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const exampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

  const handleAnalyze = async () => {
    if (!token.trim()) {
      setError('Por favor ingresa un JWT')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await jwtAPI.analyze(token, secret || null)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al analizar el JWT')
    } finally {
      setLoading(false)
    }
  }

  const loadExample = () => {
    setToken(exampleToken)
    setSecret('your-256-bit-secret')
  }

  const clearAll = () => {
    setToken('')
    setSecret('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingresa el JWT</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token JWT:
            </label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret (opcional - para verificar firma):
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="my-secret-key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Analizando...' : 'Analizar JWT'}
            </button>
            <button
              onClick={loadExample}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium transition-colors"
            >
              Cargar Ejemplo
            </button>
            <button
              onClick={clearAll}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium transition-colors"
            >
              Limpiar
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Estado General */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados del Análisis</h2>
            <div>
              {result.overall_valid ? (
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                  Token Válido
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">
                  Token Inválido
                </span>
              )}
            </div>
          </div>

          {/* Fases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fase 1: Léxico */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Fase 1: Análisis Léxico
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Tokens encontrados:</strong> {result.phases.lexical?.tokens?.length || 0}
                </p>
                {result.phases.lexical?.tokens && (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {result.phases.lexical.tokens.map((token, idx) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-xs font-mono">
                        <span className="font-bold text-blue-600">{token.type}</span>
                        <span className="text-gray-500 ml-2">{token.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {result.phases.lexical?.errors?.length > 0 && (
                  <div className="text-sm text-red-600 space-y-1">
                    {result.phases.lexical.errors.map((err, idx) => (
                      <p key={idx}> {err}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fase 2: Sintáctico */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Fase 2: Análisis Sintáctico
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Gramática:</p>
                {result.phases.syntactic?.grammar?.productions && (
                  <ul className="text-xs space-y-1 font-mono bg-gray-50 p-3 rounded max-h-60 overflow-y-auto">
                    {result.phases.syntactic.grammar.productions.map((prod, idx) => (
                      <li key={idx} className="text-gray-700">{prod}</li>
                    ))}
                  </ul>
                )}
                {result.phases.syntactic?.errors?.length > 0 && (
                  <div className="text-sm text-red-600 space-y-1">
                    {result.phases.syntactic.errors.map((err, idx) => (
                      <p key={idx}> {err}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fase 4: Decodificación */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {result.phases.decoding?.valid ? '' : ''} Fase 4: Decodificación
              </h3>
              <div className="space-y-3">
                {result.phases.decoding?.header && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Header:</p>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.phases.decoding.header, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Payload:</p>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.phases.decoding.payload, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
                {result.phases.decoding?.errors?.length > 0 && (
                  <div className="text-sm text-red-600 space-y-1">
                    {result.phases.decoding.errors.map((err, idx) => (
                      <p key={idx}> {err}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fase 3: Semántico */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Fase 3: Análisis Semántico
              </h3>
              <div className="space-y-3">
                {result.phases.semantic?.symbol_table && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Tabla de Símbolos:</p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {Object.entries(result.phases.semantic.symbol_table).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs">
                            <span className="font-bold text-gray-800">{key}</span>
                            <div className="flex gap-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{value.scope}</span>
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{value.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {result.phases.semantic.temporal_validation && (
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm font-medium text-gray-700 mb-1">Validación Temporal:</p>
                        {result.phases.semantic.temporal_validation.is_expired && (
                          <p className="text-sm text-red-600">Token expirado</p>
                        )}
                        {result.phases.semantic.temporal_validation.is_not_yet_valid && (
                          <p className="text-sm text-red-600">Token aún no válido</p>
                        )}
                        {!result.phases.semantic.temporal_validation.is_expired && 
                         !result.phases.semantic.temporal_validation.is_not_yet_valid && (
                          <p className="text-sm text-green-600"> Tiempo válido</p>
                        )}
                      </div>
                    )}
                  </>
                )}
                {result.phases.semantic?.errors?.length > 0 && (
                  <div className="text-sm text-red-600 space-y-1">
                    {result.phases.semantic.errors.map((err, idx) => (
                      <p key={idx}> {err}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fase 6: Verificación */}
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {result.phases.verification?.valid ? '' : result.phases.verification?.skipped ? '' : ''} Fase 6: Verificación Criptográfica
              </h3>
              <div className="space-y-2">
                {result.phases.verification?.skipped ? (
                  <p className="text-sm text-blue-600"> {result.phases.verification.message}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      <strong>Algoritmo:</strong> {result.phases.verification?.algorithm}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Firma válida:</strong> {result.phases.verification?.signature_match ? 'Sí' : 'No'}
                    </p>
                    {result.phases.verification?.errors?.length > 0 && (
                      <div className="text-sm text-red-600 space-y-1">
                        {result.phases.verification.errors.map((err, idx) => (
                          <p key={idx}> {err}</p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JWTAnalyzer