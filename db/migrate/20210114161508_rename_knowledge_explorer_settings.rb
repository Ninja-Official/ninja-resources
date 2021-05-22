# frozen_string_literal: true
#
class RenameKnowledgeExplorerSettings < ActiveRecord::Migration[6.0]
  def up
    execute "UPDATE site_settings SET name = 'resources_enabled' WHERE name = 'knowledge_explorer_enabled'"
    execute "UPDATE site_settings SET name = 'resources_categories' WHERE name = 'knowledge_explorer_categories'"
    execute "UPDATE site_settings SET name = 'resources_tags' WHERE name = 'knowledge_explorer_tags'"
    execute "UPDATE site_settings SET name = 'resources_add_solved_filter' WHERE name = 'knowledge_explorer_add_solved_filter'"
  end

  def down
    execute "UPDATE site_settings SET name = 'knowledge_explorer_enabled' WHERE name = 'resources_enabled'"
    execute "UPDATE site_settings SET name = 'knowledge_explorer_categories' WHERE name = 'resources_categories'"
    execute "UPDATE site_settings SET name = 'knowledge_explorer_tags' WHERE name = 'resources_tags'"
    execute "UPDATE site_settings SET name = 'knowledge_explorer_add_solved_filter' WHERE name = 'resources_add_solved_filter'"
  end
end
