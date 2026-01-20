import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useTheme } from './context/ThemeContext';
import { useApp } from './context/AppContext';
import { useFriends } from './context/FriendsContext';
import { useOnboarding } from './context/OnboardingContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header, BottomNav } from './components/layout';
import { NotificationPanel } from './components/notifications';
import { SearchModal } from './components/search';
import { FriendsPanel } from './components/friends';
import { HomePage } from './components/home';
import { ChatPage } from './components/chat';
import { BoardPage } from './components/board';
import { StoriesBar } from './components/stories';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';
import { InstallPrompt, OfflineIndicator } from './components/pwa';
import { WelcomeTour } from './components/onboarding';
import { PanicButton } from './components/support';
import { PageTransition } from './components/common/PageTransition';

// Lazy load less frequently used pages for better initial load
const EventsPage = lazy(() => import('./components/events').then(m => ({ default: m.EventsPage })));
const JokesPage = lazy(() => import('./components/jokes').then(m => ({ default: m.JokesPage })));
const ProfilePage = lazy(() => import('./components/profile').then(m => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('./components/admin').then(m => ({ default: m.AdminPage })));
const RecipesPage = lazy(() => import('./components/recipes').then(m => ({ default: m.RecipesPage })));
const DadHacksPage = lazy(() => import('./components/hacks').then(m => ({ default: m.DadHacksPage })));
const GamesPage = lazy(() => import('./components/games').then(m => ({ default: m.GamesPage })));
const ChallengesPage = lazy(() => import('./components/challenges').then(m => ({ default: m.ChallengesPage })));
const GroupsPage = lazy(() => import('./components/groups').then(m => ({ default: m.GroupsPage })));
const LeaderboardPage = lazy(() => import('./components/leaderboard').then(m => ({ default: m.LeaderboardPage })));
const DadWisdomPage = lazy(() => import('./components/wisdom').then(m => ({ default: m.DadWisdomPage })));
const QuestsPanel = lazy(() => import('./components/quests').then(m => ({ default: m.QuestsPanel })));
const MentorshipPage = lazy(() => import('./components/mentorship').then(m => ({ default: m.MentorshipPage })));
const JokeBattlePage = lazy(() => import('./components/battles').then(m => ({ default: m.JokeBattlePage })));
const MemeGeneratorPage = lazy(() => import('./components/memes').then(m => ({ default: m.MemeGeneratorPage })));
const PodcastPage = lazy(() => import('./components/podcasts').then(m => ({ default: m.PodcastPage })));
const MovieNightPage = lazy(() => import('./components/movies').then(m => ({ default: m.MovieNightPage })));
const ToolsPage = lazy(() => import('./components/tools').then(m => ({ default: m.ToolsPage })));
const LiveSupportPage = lazy(() => import('./components/support').then(m => ({ default: m.LiveSupportPage })));
const WatchPartyPage = lazy(() => import('./components/watch').then(m => ({ default: m.WatchPartyPage })));
const SettingsPage = lazy(() => import('./components/settings').then(m => ({ default: m.SettingsPage })));
const CalendarPage = lazy(() => import('./components/calendar').then(m => ({ default: m.CalendarPage })));
const StatsPage = lazy(() => import('./components/stats').then(m => ({ default: m.StatsPage })));
const GalleryPage = lazy(() => import('./components/gallery').then(m => ({ default: m.GalleryPage })));
const GoalsPage = lazy(() => import('./components/goals').then(m => ({ default: m.GoalsPage })));

// Loading spinner component
const PageLoader: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${theme.colors.border}`,
          borderTopColor: theme.colors.accent.primary,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: theme.colors.text.muted, fontSize: '14px' }}>Loading...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const { theme, mode } = useTheme();
  const { activeTab, setActiveTab, createOrGetDM, setActiveChat } = useApp();
  const { getFriendById, setShowFriendsPanel } = useFriends();
  const { hasCompletedTour, isTourActive, startTour } = useOnboarding();
  const [showSearch, setShowSearch] = useState(false);

  // Handle ESC key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-start tour for new users
  useEffect(() => {
    if (!hasCompletedTour && !isTourActive) {
      // Small delay to let the app render first
      const timer = setTimeout(() => {
        startTour();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedTour, isTourActive, startTour]);

  // Handle starting a DM from friends panel
  const handleStartDM = useCallback(async (friendId: string) => {
    const friend = getFriendById(friendId);
    if (friend) {
      const dm = await createOrGetDM(friendId, friend.friendName, friend.friendAvatar);
      setShowFriendsPanel(false);
      setActiveTab('chat');
      setActiveChat(dm.id);
    }
  }, [getFriendById, createOrGetDM, setShowFriendsPanel, setActiveTab, setActiveChat]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <StoriesBar />
            <HomePage />
          </>
        );
      case 'chat':
        return <ChatPage />;
      case 'board':
        return <BoardPage />;
      case 'events':
        return <EventsPage />;
      case 'jokes':
        return <JokesPage />;
      case 'recipes':
        return <RecipesPage />;
      case 'hacks':
        return <DadHacksPage />;
      case 'games':
        return <GamesPage />;
      case 'challenges':
        return <ChallengesPage />;
      case 'groups':
        return <GroupsPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'wisdom':
        return <DadWisdomPage />;
      case 'quests':
        return <QuestsPanel />;
      case 'mentorship':
        return <MentorshipPage />;
      case 'battles':
        return <JokeBattlePage />;
      case 'memes':
        return <MemeGeneratorPage />;
      case 'podcasts':
        return <PodcastPage />;
      case 'movies':
        return <MovieNightPage />;
      case 'tools':
        return <ToolsPage />;
      case 'support':
        return <LiveSupportPage />;
      case 'watch':
        return <WatchPartyPage />;
      case 'settings':
        return <SettingsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'stats':
        return <StatsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'goals':
        return <GoalsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return (
          <>
            <StoriesBar />
            <HomePage />
          </>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.gradient,
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: theme.colors.text.primary,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GlobalStyles theme={theme} />

      {/* Ambient Background Elements */}
      <div
        style={{
          position: 'fixed',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, rgba(217, 119, 6, ${
            mode === 'dark' ? '0.15' : '0.1'
          }) 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '20%',
          left: '-10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, rgba(245, 158, 11, ${
            mode === 'dark' ? '0.1' : '0.08'
          }) 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }}
      />

      <Header onSearchClick={() => setShowSearch(true)} />

      <main style={{ padding: '20px 24px', paddingBottom: '120px' }}>
        <Suspense fallback={<PageLoader />}>
          <PageTransition transitionKey={activeTab}>
            {renderContent()}
          </PageTransition>
        </Suspense>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <NotificationPanel />
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <FriendsPanel onStartDM={handleStartDM} />

      {/* PWA Components */}
      <InstallPrompt />
      <OfflineIndicator />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Onboarding Tour */}
      <WelcomeTour />

      {/* Panic Button - Always visible for quick help */}
      <PanicButton />
    </div>
  );
};

// Wrap App with ErrorBoundary
const AppWithErrorBoundary: React.FC = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
