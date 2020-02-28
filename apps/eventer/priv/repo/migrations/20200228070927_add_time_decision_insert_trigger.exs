defmodule Eventer.Repo.Migrations.AddDecisionInsertTrigger do
  use Ecto.Migration

  def change do
    execute(
      # up
      ~S"""
      CREATE FUNCTION check_event_time() RETURNS TRIGGER AS
      $$
      BEGIN
      IF NEW.objective = 'time' THEN
        IF EXISTS(
          SELECT 1
          FROM events ee
          WHERE ee.id = NEW.event_id
            AND ee.time IS NOT NULL
        )
        THEN
          RAISE unique_violation
            USING CONSTRAINT = 'event_time_already_defined';
        END IF;
      END IF;

      RETURN NEW;
      END;
      $$ language plpgsql;
      """,

      # down
      "DROP FUNCTION check_decision_objective;"
    )

    execute(
      # up
      ~S"""
      CREATE TRIGGER time_defined_check
      BEFORE INSERT ON decisions
      FOR EACH ROW
      EXECUTE PROCEDURE check_event_time();
      """,

      # down
      "DROP TRIGGER time_defined_check ON decisions;"
    )
  end
end
