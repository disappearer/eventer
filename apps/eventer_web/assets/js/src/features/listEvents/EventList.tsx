import React from 'react';

const EventList: React.FC = () => {
  
  return (
    <section>
      <div className="row">
        <div id="block" className="box">
          <h1>Your events</h1>
          <p>Organize events with your friends</p>
        </div>
        <div className="box">
          <h2>This is what you need</h2>
        </div>
      </div>
      <div className="row">
        <div>Here goes da list</div>
      </div>
    </section>
  );
};

export default EventList;
