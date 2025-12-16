# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  rescue_from StandardError do |e|
    Rails.logger.error(e.full_message)
    render json: { status: 500, message: "Server error" }, status: :internal_server_error
  end

  def create
    user = User.find_by(email: sign_in_params[:email])

    # 1️⃣ User does NOT exist
    unless user
      return render json: {
        status: 401,
        message: "Invalid email or password"
      }, status: :unauthorized
    end

    # 2️⃣ User exists but already locked
    if user.access_locked?
      return render_locked(user)
    end

    # 3️⃣ Validate password (Devise lockable works here)
    if user.valid_for_authentication? { user.valid_password?(sign_in_params[:password]) }
      sign_in(user, store: false)

      token = request.env['warden-jwt_auth.token']
      response.set_header("Authorization", "Bearer #{token}")

      render json: {
        status: 200,
        message: "Logged in successfully",
        data: UserSerializer.new(user).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      # 4️⃣ Wrong password → Devise increments failed_attempts internally

      if user.access_locked?
        render_locked(user)
      else
        render json: {
          status: 401,
          message: "Invalid email or password"
        }, status: :unauthorized
      end
    end
  end

  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      render json: { status: 200, message: "Logged out successfully" }, status: :ok
    else
      render json: { status: 401, message: "No active session" }, status: :unauthorized
    end
  end

  private

  def sign_in_params
    params.require(:user).permit(:email, :password)
  end

  def render_locked(user)
    minutes_left = ((user.locked_at + Devise.unlock_in - Time.current) / 60).ceil

    render json: {
      status: 423,
      message: "Account locked. Try again in #{minutes_left} minutes."
    }, status: :locked
  end
end
