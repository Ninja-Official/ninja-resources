import { acceptance, count, query } from "helpers/qunit-helpers";
import resourcesFixtures from "../fixtures/resources";

acceptance("Resources", function (needs) {
  needs.user();
  needs.settings({
    resources_enabled: true,
  });

  needs.pretender((server, helper) => {
    server.get("/resources.json", (request) => {
      if (request.queryParams.category === "1") {
        const fixture = JSON.parse(JSON.stringify(resourcesFixtures));

        return helper.response(
          Object.assign(fixture, {
            categories: [
              {
                id: 1,
                count: 119,
                active: true,
              },
            ],
          })
        );
      } else {
        return helper.response(resourcesFixtures);
      }
    });
  });

  test("index page", async function (assert) {
    await visit("/");
    await click("#toggle-hamburger-menu");
    await click(".resources-link");

    assert.equal(query(".resources-category").innerText.trim(), "bug 119");
    assert.equal(query(".resources-tag").innerText.trim(), "something 74");
    assert.equal(
      query(".resources-topic-link").innerText.trim(),
      "Importing from Software X"
    );
  });

  test("selecting a category", async function (assert) {
    await visit("/resources");
    assert.equal(count(".resources-category.selected"), 0);

    await click(".resources-item.resources-category");
    assert.equal(count(".resources-category.selected"), 1);
  });
});
