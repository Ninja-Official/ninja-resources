# frozen_string_literal: true

require_dependency 'resources_constraint'

Resources::Engine.routes.draw do
  get '/' => 'resources#index', constraints: ResourcesConstraint.new
  get '.json' => 'resources#index', constraints: ResourcesConstraint.new
end
