import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Marketplace } from './components/Marketplace';
import { TokenizeForm } from './components/TokenizeForm';
import { CodeViewer } from './components/CodeViewer';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.MARKETPLACE:
        return <Marketplace />;
      case ViewState.TOKENIZE:
        return <TokenizeForm />;
      case ViewState.CONTRACT_CODE:
        return <CodeViewer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;