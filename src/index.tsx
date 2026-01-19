import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { NotificationProvider } from './context/NotificationContext';
import { FriendsProvider } from './context/FriendsContext';
import { AppProvider } from './context/AppContext';
import { GamificationProvider } from './context/GamificationContext';
import { GroupsProvider } from './context/GroupsContext';
import { StoriesProvider } from './context/StoriesContext';
import { ToastProvider } from './context/ToastContext';
import { PresenceProvider } from './context/PresenceContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { AuthWrapper } from './components/auth';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AuthWrapper>
            <PresenceProvider>
              <OnboardingProvider>
                <AdminProvider>
                  <NotificationProvider>
                    <FriendsProvider>
                      <GamificationProvider>
                        <GroupsProvider>
                          <StoriesProvider>
                            <AppProvider>
                              <App />
                            </AppProvider>
                          </StoriesProvider>
                        </GroupsProvider>
                      </GamificationProvider>
                    </FriendsProvider>
                  </NotificationProvider>
                </AdminProvider>
              </OnboardingProvider>
            </PresenceProvider>
          </AuthWrapper>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
