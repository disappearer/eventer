import React from 'react';
import styled from 'styled-components';
import CommonTitle from '../components/Title';

const Title = styled(CommonTitle)`
  margin-bottom: 24px;
`;

const AboutPage: React.FC = () => {
  return (
    <section>
      <Title>How it works?</Title>
      <p>
        You create an event by clicking on the link "New Event", at the top of
        the page, and filling out and submitting basic event info. After
        creating an event you will see it in the list on the home page. Invite
        people by sharing the link to the event page with them. When a person
        has the link, she can decide if she wants to join. After joining, a
        participant has the ability to perform all available actions on the
        event page. If he gave notification permisssions for the app, he will
        also receive notifications for the event he joined. If the user leaves
        the event, he will not receive any new notifications for that event.
      </p>
      <p>
        Participant list is shown in the top part of the event page (to the
        right), along with the indication of who's currently online, i.e.
        viewing the event page. Any action performed on the event page should
        result in immediate page updates for every person viewing the page.
      </p>
      <p>
        Each event is centered around decisions that need to be made, which
        should provide clear goals for group discussion.
      </p>
      <p>
        Two special kinds of decisions are "time" and "place" decisions. When
        creating an event you can mark either time or place as undecided, and
        corresponding decisions will be added to the event creation form. These
        special decisions can also be created for an existing event by opening
        already specified time or place for discussion. You can do that by
        clicking the "Discuss" button next to specified time or place in the
        event info panel (top part of the event page).
      </p>
      <p>
        Besides special decisions, you can add as many "regular" decisions as
        you like. These can be used to decide stuff like who's driving, who will
        get the drinks for the party, choosing an accomodation for a trip, or
        anything else that needs to be decided.
      </p>
      <p>
        Each decision can have a poll, to aid in decision making. Decisions
        start their life with no poll. You can add a poll to decision if needed.
        The feature to discard an existing poll is in the works.
      </p>
      <p>
        By clicking on a decision title, you can see decision details and
        actions. There you can edit the decision title or description, add a
        poll, vote on an existing poll and resolve a decision. Resolving all
        decisions is the goal of the game. Resolving special decisions will
        update the corresponding event info, i.e. time or place.
      </p>
      <p>
        Apart from decisions, there's "Chat and updates" section, which can be
        used for discussion and also includes event activity updates. If you
        have allowed notifications, you should be notified of first chat message
        or activity update since your last visit. Subsequent messages don't
        trigger notifications. If you're not receiving notifications, please
        check the website permissions, by clicking on the first icon to the left
        of the url in the address bar. If you have allowed notifications for the
        website and you're still not receiving notifications, please check the
        notification settings of your browser.
      </p>
    </section>
  );
};

export default AboutPage;
