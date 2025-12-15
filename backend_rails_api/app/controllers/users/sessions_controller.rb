class Users::SessionsController < Devise::SessionsController
  respond_to :json

  rescue_from StandardError do |e|
    render json: { status: 500, message: "Server error: #{e.message}" }, status: :internal_server_error
  end

  def create
  user = User.find_by(email: params.dig(:user, :email))

 
  # ✅ Check lock first
  if user.access_locked?
    minutes_left = ((user.locked_at + Devise.unlock_in - Time.current) / 60).ceil
    return render json: { status: 423, message: "Account locked. Try again in #{minutes_left} minutes." }, status: :locked
  end
   unless user
    return render json: { status: 401, message: "Invalid email or password" }, status: :unauthorized
   end

  if user.valid_password?(params.dig(:user, :password))
    user.unlock_access! if user.access_locked?
    sign_in(user, store: false)
    token = request.env['warden-jwt_auth.token']
    response.set_header("Authorization", "Bearer #{token}")

    render json: {
      status: 200,
      message: "Logged in successfully",
      data: UserSerializer.new(user).serializable_hash[:data][:attributes]
    }, status: :ok
  else
    user.increment_failed_attempts! if user.respond_to?(:increment_failed_attempts!)
    render json: { status: 401, message: "Invalid email or password" }, status: :unauthorized
  end
  end


  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      render json: { status: 200, message: "Logged out successfully" }, status: :ok
    else
      render json: { status: 401, message: "No active session" }, status: :unauthorized
    end
  end
end
