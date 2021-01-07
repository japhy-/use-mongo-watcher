import React from 'react';
import { useMongoWatcher } from 'use-mongo-watcher';

const App = () => {
  const example = useMongoWatcher({});

  return (
    <div>
      {JSON.stringify(example)}
    </div>
  );
}

export default App;