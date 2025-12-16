class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string :title
      t.string :description
      t.string :status
      t.string :category
      t.string :location
      t.date :start_date
      t.decimal :total_budget
      t.decimal :spent_budget

      t.timestamps
    end
  end
end
