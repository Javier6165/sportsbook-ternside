import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
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
import { Predictor, Promotions } from './features/promotions/Promotions'
import { DemoFrame } from './presentation/DemoFrame'
import { AppShell } from './shell/AppShell'
import { StoreProvider } from './state/store'
import './data/standings'

/** Route changes fade up softly; the store keeps state, so nothing is lost. */
function AnimatedRoutes() {
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={loc.pathname}
        initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, filter: 'blur(2px)', transition: { duration: 0.14 } }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={loc}>
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
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/promotions/predictor" element={<Predictor />} />
              <Route path="/event/:eventId" element={<EventPage />} />
              <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <StoreProvider>
      <HashRouter>
        <DemoFrame>
          <AppShell>
            <AnimatedRoutes />
          </AppShell>
        </DemoFrame>
      </HashRouter>
    </StoreProvider>
    </MotionConfig>
  )
}
