import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Home } from './features/home/Home'
import { NotFound } from './features/NotFound'
import { SportPage } from './features/sport/SportPage'
import { EventPage } from './features/event/EventPage'
import { MyBets } from './features/mybets/MyBets'
import { BetDetail } from './features/mybets/BetDetail'
import { LivePage } from './features/live/LivePage'
import { SearchPanel } from './features/search/SearchPanel'
import { Wallet } from './features/account/Wallet'
import { SaferGambling } from './features/account/SaferGambling'
import { Account } from './features/account/Account'
import { AccountClosed } from './features/account/AccountClosed'
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
              <Route path="/live" element={<LivePage />} />
              <Route path="/my-bets" element={<MyBets />} />
              <Route path="/bets/:betId" element={<BetDetail />} />
              <Route path="/receipt/:betId" element={<BetDetail />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account-closed" element={<AccountClosed />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/search" element={<div className="mx-auto mt-6 max-w-[640px] overflow-hidden rounded-[28px] bg-surface"><SearchPanel /></div>} />
              <Route path="/safer-gambling" element={<SaferGambling />} />
              <Route path="/event/:eventId" element={<EventPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </DemoFrame>
      </HashRouter>
    </StoreProvider>
  )
}
