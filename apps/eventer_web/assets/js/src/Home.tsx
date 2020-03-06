import React from 'react';

const Home: React.FC = () => {
  return (
    <section>
      <h1>Welcome to Eventer</h1>
      <p>Organize events with your friends</p>
      <a href="/auth/google">Google Login</a>
    </section>
  );
};

export default Home;
