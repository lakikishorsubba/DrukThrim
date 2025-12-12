# app/controllers/current_user_controller.rb
class CurrentUserController < ApplicationController
  before_action :authenticate_user!  # Devise helper

  def show
    if current_user
      render json: {
        name: current_user.name,
        email: current_user.email
      }, status: :ok
    else
      render json: { error: "User not found" }, status: :unauthorized
    end
  end
end
