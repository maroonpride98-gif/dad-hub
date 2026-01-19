import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JokeCard } from './JokeCard';
import { JokeSubmitForm } from './JokeSubmitForm';
import { TopJokeTellers } from './TopJokeTellers';
import { JokeActions } from './JokeActions';

export const JokesPage: React.FC = () => {
  const { jokes, jokeIndex, nextJoke } = useApp();
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const currentJoke = jokes[jokeIndex];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center',
        paddingTop: '20px',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, textAlign: 'center' }}>
        😂 Dad Joke of the Day
      </h2>

      <JokeCard joke={currentJoke} />

      <JokeActions
        onNext={nextJoke}
        onSubmitNew={() => setShowSubmitForm(!showSubmitForm)}
        showSubmitForm={showSubmitForm}
      />

      {showSubmitForm && <JokeSubmitForm onClose={() => setShowSubmitForm(false)} />}

      <TopJokeTellers />
    </div>
  );
};
