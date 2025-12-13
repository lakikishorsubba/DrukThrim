# frozen_string_literal: true
class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # POST /signup
  def create
    build_resource(sign_up_params)

    if resource.save
      render json: {
        status: 200,
        message: 'Signed up successfully.',
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      # Deduplicate error messages
      deduped_errors = resource.errors.messages.transform_values { |msgs| msgs.uniq }

      render json: {
        status: 422,
        errors: deduped_errors
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
