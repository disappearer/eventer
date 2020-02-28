defmodule Eventer.Repo.Migrations.AddPlaceDecisionInsertTrigger do
  use Ecto.Migration

  def change do
    execute(
      # up
      ~S"""
      CREATE FUNCTION check_event_place() RETURNS TRIGGER AS
      $$
      BEGIN
      IF NEW.objective = 'place' THEN
        IF EXISTS(
          SELECT 1
          FROM events ee
          WHERE ee.id = NEW.event_id
            AND ee.place IS NOT NULL
        )
        THEN
          RAISE unique_violation
            USING CONSTRAINT = 'event_place_already_defined';
        END IF;
      END IF;

      RETURN NEW;
      END;
      $$ language plpgsql;
      """,

      # down
      "DROP FUNCTION check_event_place;"
    )

    execute(
      # up
      ~S"""
      CREATE TRIGGER place_defined_check
      BEFORE INSERT ON decisions
      FOR EACH ROW
      EXECUTE PROCEDURE check_event_place();
      """,

      # down
      "DROP TRIGGER place_defined_check ON decisions;"
    )
  end
end
