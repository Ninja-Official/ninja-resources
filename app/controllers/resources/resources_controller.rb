# frozen_string_literal: true

module Resources
  class ResourcesController < ApplicationController
    requires_plugin 'resources'

    skip_before_action :check_xhr, only: [:index]

    def index
      filters = {
        topic: params[:topic],
        tags: params[:tags],
        category: params[:category],
        solved: params[:solved],
        search_term: params[:search],
        ascending: params[:ascending],
        order: params[:order],
        page: params[:page]
      }

      query = Resources::Query.new(current_user, filters).list

      if filters[:topic].present?
        begin
          @topic = Topic.find(filters[:topic])
        rescue
          raise Discourse::NotFound
        end

        @excerpt = @topic.posts[0].excerpt(500, { strip_links: true, text_entities: true }) if @topic.posts[0].present?
        @excerpt = (@excerpt || "").gsub(/\n/, ' ').strip

        query["topic"] = get_topic(@topic, current_user)
      end

      respond_to do |format|
        format.html do
          @title = set_title
          render :get_topic
        end

        format.json do
          render json: query
        end
      end
    end

    def get_topic(topic, current_user)
      return nil unless topic_in_resources(topic.category_id, topic.tags)

      topic_view = TopicView.new(topic.id, current_user)
      guardian = Guardian.new(current_user)

      TopicViewSerializer.new(topic_view, scope: guardian, root: false)
    end

    def set_title
      title = "#{I18n.t('js.resources.title')} - #{SiteSetting.title}"
      if @topic
        topic_title = @topic['unicode_title'] || @topic['title']
        title = "#{topic_title} - #{title}"
      end
      title
    end

    def topic_in_resources(category, tags)
      category_match = Resources::Query.categories.include?(category.to_s)
      tags = tags.pluck(:name)
      tag_match = Resources::Query.tags.any? { |tag| tags.include?(tag) }

      category_match || tag_match
    end
  end
end
