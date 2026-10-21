import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Home } from './features/home/Home'
import { Placeholder } from './features/Placeholder'
import { NotFound } from './features/NotFound'
import { SportPage } from './features/sport/SportPage'
import { EventPage } from './features/event/EventPage'
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
              <Route path="/sports/:sportId" element={<SportPage />} />
              <Route path="/live" element={<Placeholder title="Live" />} />
              <Route path="/my-bets" element={<Placeholder title="My Bets" />} />
              <Route path="/account" element={<Placeholder title="Account" />} />
              <Route path="/wallet" element={<Placeholder title="Wallet" />} />
              <Route path="/search" element={<Placeholder title="Search" />} />
              <Route path="/safer-gambling" element={<Placeholder title="Safer gambling" />} />
              <Route path="/event/:eventId" element={<EventPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </DemoFrame>
      </HashRouter>
    </StoreProvider>
  )
}
