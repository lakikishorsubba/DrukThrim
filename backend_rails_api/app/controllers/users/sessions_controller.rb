# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  # POST /login
  def create
    user = User.find_by(email: params.dig(:user, :email))

    if user&.valid_password?(params.dig(:user, :password))
      # IMPORTANT: do NOT store session in API/JWT mode
      sign_in(user, store: false)

      token = request.env['warden-jwt_auth.token']

      response.set_header(
        'Authorization',
        "Bearer #{token}"
      )

      render json: {
        status: 200,
        message: 'Logged in successfully.',
        data: UserSerializer.new(user).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: {
        status: 401,
        message: 'Invalid email or password.'
      }, status: :unauthorized
    end
  end

  # DELETE /logout
  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      render json: {
        status: 200,
        message: 'Logged out successfully.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: 'No active session.'
      }, status: :unauthorized
    end
  end
end
