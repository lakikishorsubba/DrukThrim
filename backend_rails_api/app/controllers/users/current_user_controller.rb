class Users::CurrentUserController < ApplicationController
  before_action :authenticate_user!

  include Rails.application.routes.url_helpers

  def show
    render json: {
      name: current_user.name,
      email: current_user.email,
      avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
    }, status: :ok
  end
end
