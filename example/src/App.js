import React from 'react'
import { useMyHook } from 'use-mongo-watcher'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App