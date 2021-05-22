import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

function initialize(api, container) {
  const siteSettings = container.lookup("site-settings:main");

  if (!siteSettings.resources_enabled) {
    return;
  }

  api.decorateWidget("hamburger-menu:generalLinks", () => {
    return {
      route: "resources",
      label: "resources.title",
      className: "resources-link",
    };
  });

  api.addKeyboardShortcut("g e", "", { path: "/resources" });

  if (siteSettings.resources_add_to_top_menu) {
    api.addNavigationBarItem({
      name: "resources",
      displayName: I18n.t("resources.title"),
      href: "/resources",
    });
  }
}

export default {
  name: "setup-resources",

  initialize(container) {
    withPluginApi("0.8", (api) => initialize(api, container));
  },
};
