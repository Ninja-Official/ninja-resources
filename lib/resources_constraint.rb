# frozen_string_literal: true

class ResourcesConstraint
  def matches?(_request)
    SiteSetting.resources_enabled
  end
end
