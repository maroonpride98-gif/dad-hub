import React, { useState, useEffect, useCallback } from 'react';
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
import { EventsPage } from './components/events';
import { JokesPage } from './components/jokes';
import { ProfilePage } from './components/profile';
import { AdminPage } from './components/admin';
import { RecipesPage } from './components/recipes';
import { DadHacksPage } from './components/hacks';
import { GamesPage } from './components/games';
import { ChallengesPage } from './components/challenges';
import { GroupsPage } from './components/groups';
import { LeaderboardPage } from './components/leaderboard';
import { DadWisdomPage } from './components/wisdom';
import { StoriesBar } from './components/stories';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/Toast';
import { InstallPrompt, OfflineIndicator } from './components/pwa';
import { WelcomeTour } from './components/onboarding';
import { QuestsPanel } from './components/quests';
import { MentorshipPage } from './components/mentorship';
import { JokeBattlePage } from './components/battles';
import { MemeGeneratorPage } from './components/memes';
import { PodcastPage } from './components/podcasts';
import { MovieNightPage } from './components/movies';
import { ToolsPage } from './components/tools';
import { LiveSupportPage, PanicButton } from './components/support';
import { WatchPartyPage } from './components/watch';

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
        {renderContent()}
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
