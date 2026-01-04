# frozen_string_literal: true
Devise.setup do |config|
  # Mailer
  config.mailer_sender = 'please-change-me@example.com'

  # ORM
  require 'devise/orm/active_record'

  # Keys
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]

  # Session storage (skip for APIs)
  config.skip_session_storage = [:http_auth]

  # Password length
  config.password_length = 6..128

  # Email format
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # Reconfirm email if changed
  config.reconfirmable = true

  # Rememberable
  config.expire_all_remember_me_on_sign_out = true

  # JWT setup
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise_jwt_secret_key!
    jwt.dispatch_requests = [
      ['POST', %r{^/login$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/logout$}]
    ]
    jwt.expiration_time = 30.minutes.to_i
  end

  # Navigational formats (API-only)
  config.navigational_formats = []

  # Lockable
  config.lock_strategy = :failed_attempts
  config.maximum_attempts = 5
  config.unlock_strategy = :time
  config.unlock_in = 15.minutes
  config.last_attempt_warning = false

  # Hotwire/Turbo
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other
end
