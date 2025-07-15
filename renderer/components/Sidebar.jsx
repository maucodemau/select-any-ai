import React, { useState } from 'react'

function Sidebar({ apiKey, onApiKeyChange, selectedModel, onModelChange, availableModels, isLoadingModels }) {
  const [showApiKey, setShowApiKey] = useState(false)
  const [tempApiKey, setTempApiKey] = useState(apiKey)

  const handleApiKeySubmit = (e) => {
    e.preventDefault()
    onApiKeyChange(tempApiKey)
  }

  const handleClearApiKey = () => {
    setTempApiKey('')
    onApiKeyChange('')
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">AskAI</h1>
        <p className="text-sm text-gray-600 mt-1">AI Assistant</p>
      </div>

      {/* API Key Section */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">OpenRouter API Key</h2>
        <form onSubmit={handleApiKeySubmit} className="space-y-3">
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClearApiKey}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear
              </button>
            )}
          </div>
        </form>
        {apiKey && (
          <div className="mt-2 text-xs text-green-600">
            ✓ API key saved
          </div>
        )}
      </div>

      {/* Model Selection */}
      <div className="p-4 flex-1">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Model</h2>
        {isLoadingModels ? (
          <div className="text-sm text-gray-500">Loading models...</div>
        ) : (
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!apiKey}
          >
            {availableModels.length > 0 && (
              <>
                {/* Free models section */}
                {availableModels.filter(model => model.includes(':free')).length > 0 && (
                  <optgroup label="🆓 Free Models">
                    {availableModels
                      .filter(model => model.includes(':free'))
                      .map((model) => (
                        <option key={model} value={model}>
                          {model.replace(':free', '')} (Free)
                        </option>
                      ))}
                  </optgroup>
                )}
                
                {/* Paid models section */}
                {availableModels.filter(model => !model.includes(':free')).length > 0 && (
                  <optgroup label="💰 Paid Models">
                    {availableModels
                      .filter(model => !model.includes(':free'))
                      .map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                  </optgroup>
                )}
              </>
            )}
            
            {/* Fallback for when no models are loaded */}
            {availableModels.length === 0 && (
              <option value={selectedModel}>
                {selectedModel}
              </option>
            )}
          </select>
        )}
        {!apiKey && (
          <p className="text-xs text-gray-500 mt-2">
            Enter an API key to load available models
          </p>
        )}
        
        {/* Model Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Current Model</h3>
          <p className="text-xs text-gray-600 break-all">{selectedModel}</p>
          {selectedModel.includes(':free') && (
            <div className="mt-2 text-xs text-green-600">
              ✓ Free model
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Powered by OpenRouter
        </p>
      </div>
    </div>
  )
}

export default Sidebar 