# frozen_string_literal: true

# name: discourse-resources
# about: A plugin to make it easy to explore and find knowledge base documents in Discourse
# version: 0.1
# author: Justin DiRose
# url: https://github.com/discourse/discourse-resources

enabled_site_setting :resources_enabled

register_asset 'stylesheets/common/resources.scss'
register_asset 'stylesheets/mobile/resources.scss'

load File.expand_path('lib/resources/engine.rb', __dir__)
load File.expand_path('lib/resources/query.rb', __dir__)

after_initialize do
  require_dependency 'search'

  if SiteSetting.resources_enabled
    if Search.respond_to? :advanced_filter
      Search.advanced_filter(/in:kb/) do |posts|
        selected_categories = SiteSetting.resources_categories.split('|')
        if selected_categories
          categories = Category.where('id IN (?)', selected_categories).pluck(:id)
        end

        selected_tags = SiteSetting.resources_tags.split('|')
        if selected_tags
          tags = Tag.where('name IN (?)', selected_tags).pluck(:id)
        end

        posts.where('category_id IN (?) OR topics.id IN (SELECT DISTINCT(tt.topic_id) FROM topic_tags tt WHERE tt.tag_id IN (?))', categories, tags)
      end
    end
  end

  add_to_class(:topic_query, :list_resources_topics) do
    default_results(@options)
  end
end
