import Controller, { inject as controller } from "@ember/controller";
import discourseComputed, { on } from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { alias, equal, readOnly } from "@ember/object/computed";
import Resources from "discourse/plugins/discourse-resources/discourse/models/resources";
import { getOwner } from "@ember/application";

export default Controller.extend({
  queryParams: {
    ascending: "ascending",
    filterCategories: "category",
    filterTags: "tags",
    filterSolved: "solved",
    orderColumn: "order",
    searchTerm: "search",
    selectedTopic: "topic",
  },

  application: controller(),

  isLoading: false,
  isLoadingMore: false,
  isTopicLoading: false,
  filterTags: null,
  filterCategories: null,
  filterSolved: false,
  searchTerm: null,
  selectedTopic: null,
  topic: null,
  expandedFilters: false,
  ascending: null,
  orderColumn: null,

  loadMoreUrl: alias("model.topics.load_more_url"),
  categories: readOnly("model.categories"),
  topics: alias("model.topics.topic_list.topics"),
  tags: readOnly("model.tags"),
  topicCount: alias("model.topic_count"),
  emptyResults: equal("topicCount", 0),

  @on("init")
  _setupFilters() {
    if (!this.site.mobileView) {
      this.set("expandedFilters", true);
    }
  },

  @discourseComputed("topics", "isSearching", "filterSolved")
  emptyTopics(topics, isSearching, filterSolved) {
    const filtered = isSearching || filterSolved;
    return this.topicCount === 0 && !filtered;
  },

  @discourseComputed("loadMoreUrl")
  canLoadMore(loadMoreUrl) {
    return loadMoreUrl === null ? false : true;
  },

  @discourseComputed("searchTerm")
  isSearching(searchTerm) {
    return !!searchTerm;
  },

  @discourseComputed("isSearching", "filterSolved")
  isSearchingOrFiltered(isSearching, filterSolved) {
    return isSearching || filterSolved;
  },

  @discourseComputed
  canFilterSolved() {
    return (
      this.siteSettings.solved_enabled &&
      this.siteSettings.resources_add_solved_filter
    );
  },

  @discourseComputed("filterTags")
  filtered(filterTags) {
    return !!filterTags;
  },

  @action
  setSelectedTopic(topicId) {
    this.set("selectedTopic", topicId);

    window.scrollTo(0, 0);
  },

  @action
  onChangeFilterSolved(solvedFilter) {
    this.set("filterSolved", solvedFilter);
  },

  @action
  updateSelectedTags(tag) {
    let filter = this.filterTags;
    if (filter && filter.includes(tag.id)) {
      filter = filter.replace(tag.id, "").replace(/^\|+|\|+$/g, "");
    } else if (filter) {
      filter = `${filter}|${tag.id}`;
    } else {
      filter = tag.id;
    }

    this.setProperties({
      filterTags: filter,
      selectedTopic: null,
    });
  },

  @action
  updateSelectedCategories(category) {
    let filter = this.filterCategories;
    if (filter && filter.includes(category.id)) {
      filter = filter.replace(category.id, "").replace(/^\|+|\|+$/g, "");
    } else if (filter) {
      filter = `${filter}|${category.id}`;
    } else {
      filter = category.id;
    }

    this.setProperties({
      filterCategories: filter,
      selectedTopic: null,
    });

    return false;
  },

  @action
  performSearch(term) {
    if (term === "") {
      this.set("searchTerm", null);
      return false;
    }

    if (term.length < this.siteSettings.min_search_term_length) {
      return false;
    }

    this.setProperties({
      searchTerm: term,
      selectedTopic: null,
    });
  },

  @action
  sortBy(column) {
    const order = this.orderColumn;
    const ascending = this.ascending;
    if (column === "title") {
      this.set("orderColumn", "title");
    } else if (column === "activity") {
      this.set("orderColumn", "activity");
    }

    if (!ascending && order) {
      this.set("ascending", true);
    } else {
      this.set("ascending", "");
    }
  },

  @action
  loadMore() {
    if (this.canLoadMore && !this.isLoadingMore) {
      this.set("isLoadingMore", true);

      Resources.loadMore(this.loadMoreUrl).then((result) => {
        const topics = this.topics.concat(result.topics.topic_list.topics);

        this.setProperties({
          topics,
          loadMoreUrl: result.topics.load_more_url || null,
          isLoadingMore: false,
        });
      });
    }
  },

  @action
  toggleFilters() {
    if (!this.expandedFilters) {
      this.set("expandedFilters", true);
    } else {
      this.set("expandedFilters", false);
    }
  },

  @action
  returnToList() {
    this.set("selectedTopic", null);
    getOwner(this).lookup("router:main").transitionTo("resources");
  },
});
