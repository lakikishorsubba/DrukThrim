class ApplicationController < ActionController::API
  include Devise::Controllers::Helpers

  before_action :authenticate_user_from_token!

  private

  # Devise JWT won't pick up headers for multipart/form-data sometimes
  def authenticate_user_from_token!
    token = request.headers['Authorization']&.split(' ')&.last
    return unless token

    begin
      payload = Warden::JWTAuth::TokenDecoder.new.call(token)
      user = User.find(payload['sub'])
      sign_in(user, store: false) if user
    rescue => e
      Rails.logger.info "JWT authentication failed: #{e.message}"
    end
  end
end
