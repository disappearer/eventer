import React from 'react';

const Welcome: React.FC = () => {
  return (
    <section>
      <div className="row">
        <div id="block" className="box">
          <h1>Welcome to Eventer</h1>
          <p>Organize events with your friends</p>
        </div>
        <div className="box">
          <h2>This is what you need</h2>
        </div>
      </div>
      <div className="row">
        <div id="decisions">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui
          blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
          et quas molestias excepturi sint occaecati cupiditate non provident,
          similique sunt in culpa qui officia deserunt mollitia animi, id est
          laborum et dolorum fuga
        </div>
      </div>
    </section>
  );
};

export default Welcome;
