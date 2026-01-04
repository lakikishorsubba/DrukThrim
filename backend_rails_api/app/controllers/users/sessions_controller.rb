class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    user = User.find_by(email: sign_in_params[:email])

    return render json: { status: 401, message: "Invalid email or password" }, status: :unauthorized unless user

    if user.valid_for_authentication? { user.valid_password?(sign_in_params[:password]) }
      sign_in(user, store: false)
      token = request.env['warden-jwt_auth.token']

      render json: {
        status: 200,
        message: "Logged in successfully",
        data: UserSerializer.new(user).serializable_hash[:data][:attributes],
        token: token # ✅ send JWT in response
      }, status: :ok
    else
      render json: { status: 401, message: "Invalid email or password" }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    render json: { status: 200, message: "Logged out successfully" }, status: :ok
  end

  private
  def sign_in_params
    params.require(:user).permit(:email, :password)
  end
end
