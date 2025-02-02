import DiscourseRoute from "discourse/routes/discourse";
import I18n from "I18n";
import Resources from "discourse/plugins/discourse-resources/discourse/models/resources";

export default DiscourseRoute.extend({
  queryParams: {
    ascending: { refreshModel: true },
    filterCategories: { refreshModel: true },
    filterTags: { refreshModel: true },
    filterSolved: { refreshModel: true },
    orderColumn: { refreshModel: true },
    selectedTopic: { refreshModel: true },
    searchTerm: {
      replace: true,
      refreshModel: true,
    },
  },

  model(params) {
    this.controllerFor("resources.index").set("isLoading", true);
    return Resources.list(params).then((result) => {
      this.controllerFor("resources.index").set("isLoading", false);
      return result;
    });
  },

  titleToken() {
    const model = this.currentModel;
    const pageTitle = I18n.t("resources.title");
    if (model.topic.title && model.topic.category_id) {
      const title = model.topic.unicode_title || model.topic.title;
      const categoryName = this.site.categories.findBy(
        "id",
        model.topic.category_id
      ).name;
      return `${title} - ${categoryName} - ${pageTitle}`;
    } else {
      return pageTitle;
    }
  },

  setupController(controller, model) {
    controller.set("topic", model.topic);
    controller.set("model", model);
  },
});
