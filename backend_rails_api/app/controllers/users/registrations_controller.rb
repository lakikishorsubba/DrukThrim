# frozen_string_literal: true
class Users::RegistrationsController < Devise::RegistrationsController
  include RackSessionsFix
  respond_to :json

  private

  # Permit additional parameters for signup
  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :role)
  end

  # Permit additional parameters for account update
  def account_update_params
    params.require(:user).permit(:email, :password, :password_confirmation, :current_password, :name, :role)
  end

  # Default role to 'citizen' if not provided
  def build_resource(hash = {})
    hash[:role] ||= 'citizen'
    super(hash)
  end

  def respond_with(current_user, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
      }
    else
      render json: {
        status: { message: "User couldn't be created successfully. #{current_user.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
