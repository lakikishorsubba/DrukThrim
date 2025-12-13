# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  # LOGIN
  def create
    user = User.find_by(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      sign_in(user)

      render json: {
        status: 200,
        message: "Logged in successfully.",
        data: UserSerializer.new(user).serializable_hash[:data][:attributes]
      }, status: :ok

    else
      render json: {
        status: 401,
        message: "Invalid email or password."
      }, status: :unauthorized
    end
  end

  # LOGOUT
  def respond_to_on_destroy
    token = request.headers['Authorization']&.split(' ')&.last

    if token
      render json: { status: 200, message: "Logged out successfully." }, status: :ok
    else
      render json: { status: 401, message: "No active session." }, status: :unauthorized
    end
  end
end
