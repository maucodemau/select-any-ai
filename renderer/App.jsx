import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

const DEFAULT_MODELS = [
  // Best free models first
  'mistralai/mistral-7b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free',
  'openchat/openchat-7b:free',
  'nousresearch/nous-capybara-7b:free',
  'gryphe/mythomist-7b:free'
]

function App() {
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODELS[0])
  const [availableModels, setAvailableModels] = useState(DEFAULT_MODELS)
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  // Load API key from localStorage or environment variable on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key')
    const envApiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    
    const apiKeyToUse = savedApiKey || envApiKey
    if (apiKeyToUse) {
      setApiKey(apiKeyToUse)
      fetchModels(apiKeyToUse)
    }
  }, [])

  const fetchModels = async (key) => {
    if (!key) return
    
    setIsLoadingModels(true)
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const allModels = data.data
          .filter(model => model.id && !model.id.includes('undefined'))
          .map(model => ({
            id: model.id,
            name: model.name || model.id,
            pricing: model.pricing || {}
          }))
        
        if (allModels.length > 0) {
          // Organize models: free first, then by popularity/quality
          const freeModels = allModels
            .filter(model => model.id.includes(':free'))
            .sort((a, b) => {
              // Prioritize known good free models
              const priority = {
                'mistralai/mistral-7b-instruct:free': 1,
                'microsoft/phi-3-mini-128k-instruct:free': 2,
                'huggingfaceh4/zephyr-7b-beta:free': 3,
                'openchat/openchat-7b:free': 4,
                'nousresearch/nous-capybara-7b:free': 5,
                'gryphe/mythomist-7b:free': 6
              }
              return (priority[a.id] || 999) - (priority[b.id] || 999)
            })
          
          const paidModels = allModels
            .filter(model => !model.id.includes(':free'))
            .sort((a, b) => {
              // Sort paid models by name
              return a.name.localeCompare(b.name)
            })
          
          const organizedModels = [...freeModels, ...paidModels].map(model => model.id)
          setAvailableModels(organizedModels)
          
          // Set first free model as default if available
          const firstFreeModel = freeModels[0]?.id
          if (firstFreeModel) {
            setSelectedModel(firstFreeModel)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    } finally {
      setIsLoadingModels(false)
    }
  }

  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey)
    localStorage.setItem('openrouter_api_key', newApiKey)
    if (newApiKey) {
      fetchModels(newApiKey)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        availableModels={availableModels}
        isLoadingModels={isLoadingModels}
      />
      <ChatWindow
        apiKey={apiKey}
        selectedModel={selectedModel}
      />
    </div>
  )
}

export default App 