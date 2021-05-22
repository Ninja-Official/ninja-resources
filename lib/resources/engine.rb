# frozen_string_literal: true

module ::Resources
  class Engine < ::Rails::Engine
    isolate_namespace Resources

    config.after_initialize do
      Discourse::Application.routes.append do
        mount ::Resources::Engine, at: '/resources'
        get '/knowledge-explorer', to: redirect("/resources")
      end
    end
  end
end
