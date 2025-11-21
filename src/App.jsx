import { useState } from 'react'
import JWTAnalyzer from './components/JWTAnalyzer'
import JWTEncoder from './components/JWTEncoder'

function App() {
  const [activeTab, setActiveTab] = useState('analyzer')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            JWT Analyzer & Validator
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Analizador completo de JSON Web Tokens
          </p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white border-b border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`py-4 px-6 border-b-2 font-medium transition-colors ${
                activeTab === 'analyzer'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analizar JWT
            </button>
            <button
              onClick={() => setActiveTab('encoder')}
              className={`py-4 px-6 border-b-2 font-medium transition-colors ${
                activeTab === 'encoder'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Crear JWT
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'analyzer' && <JWTAnalyzer />}
        {activeTab === 'encoder' && <JWTEncoder />}
      </main>
    </div>
  )
}

export default App