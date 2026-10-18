import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { loadDataset } from './data/adapter';
import { OtterlySafeMobileApp } from './components/mobile/OtterlySafeMobileApp';

export function App() {
  const {
    members,
    events,
    cards,
    cases,
    initDataset,
  } = useStore();

  // Try loading kit dataset if present
  useEffect(() => {
    loadDataset().then((dataset) => {
      if (dataset.source === 'kit') {
        initDataset(dataset);
      }
    });
  }, [initDataset]);

  return (
    <div className="min-h-screen bg-sand-50 text-navy-900 flex flex-col font-body selection:bg-kelp-200">
      <OtterlySafeMobileApp
        member={members[0]}
        cards={cards}
        events={events}
        cases={cases}
      />
    </div>
  );
}
