class Users::ProfileController < ApplicationController
  before_action :authenticate_user!

  include Rails.application.routes.url_helpers

  def show
    render json: {
      name: current_user.name,
      email: current_user.email,
      avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
    }
  end

  def update_avatar
    if current_user.update(avatar: params[:avatar])
      render json: {
        avatar_url: url_for(current_user.avatar)
      }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update_name
    if current_user.update(name: params[:name])
      render json: {name: current_user.name}
    else
      render json: {error: current_user.errors.full_messages},
      status: :unprocessable_entiity
    end
  end
end
