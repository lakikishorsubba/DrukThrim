# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  after_initialize :set_default_role, if: :new_record?

  def set_default_role
    self.role ||= 'citizen'
  end

  # Name
  validates :name,
            presence: true,
            length: { minimum: 2, maximum: 40 }

  # Email
  validates :email,
            presence: true,
            uniqueness: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }

  # Password
  validates :password,
            length: { minimum: 6 },
            confirmation: true,
            if: -> { new_record? || password.present? }

  # Role
  validates :role,
            inclusion: { in: %w[citizen admin] }
end
