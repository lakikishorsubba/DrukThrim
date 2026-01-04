# frozen_string_literal: true

class User < ApplicationRecord
  has_many :posts, foreign_key: :user_id, dependent: :destroy
  has_many :projects, foreign_key: :user_id
  has_one_attached :avatar
  include Devise::JWT::RevocationStrategies::JTIMatcher
  ROLES = %w[citizen admin].freeze

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :lockable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: self

  after_initialize :set_default_role, if: :new_record?
  validates :role, presence: true, inclusion: { in: ROLES }

  def set_default_role
    self.role ||= 'citizen'
  end

  def admin?
    role == "admin"
  end

  def citizen?
    role == "citizen"
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
