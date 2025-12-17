require 'rails_helper'

RSpec.describe "User Registration", type: :request do
  it "registers successfully with valid params" do
    user_params = {
      user: {
        name: Faker::Name.name,
        email: Faker::Internet.unique.email,
        password: "password123",
        password_confirmation: "password123"
      }
    }

    post "/signup", params: user_params
    json = JSON.parse(response.body)

    expect(response).to have_http_status(:ok)
    expect(json["message"]).to eq("Signed up successfully.")
  end
end
