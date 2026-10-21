import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Home } from './features/home/Home'
import { Placeholder } from './features/Placeholder'
import { DemoFrame } from './presentation/DemoFrame'
import { AppShell } from './shell/AppShell'
import { StoreProvider } from './state/store'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <DemoFrame>
          <AppShell>
            <Routes>
              <Route path="/" element={<Navigate to="/sports" replace />} />
              <Route path="/sports" element={<Home />} />
              <Route path="/sports/:sportId" element={<Home />} />
              <Route path="/live" element={<Placeholder title="Live" />} />
              <Route path="/my-bets" element={<Placeholder title="My Bets" />} />
              <Route path="/account" element={<Placeholder title="Account" />} />
              <Route path="/wallet" element={<Placeholder title="Wallet" />} />
              <Route path="/search" element={<Placeholder title="Search" />} />
              <Route path="/safer-gambling" element={<Placeholder title="Safer gambling" />} />
              <Route path="/event/:eventId" element={<Placeholder title="Match page" />} />
              <Route path="*" element={<Placeholder title="Not found" />} />
            </Routes>
          </AppShell>
        </DemoFrame>
      </HashRouter>
    </StoreProvider>
  )
}
