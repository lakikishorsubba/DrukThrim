require 'rails_helper'

RSpec.describe "User Login", type: :request do
  let!(:user) { create(:user) } # uses Faker factory

  it "logs in successfully with correct credentials" do
    post "/login", params: { user: { email: user.email, password: "password123" } }
    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["message"]).to eq("Logged in successfully")
  end

  it "fails login with wrong password" do
    post "/login", params: { user: { email: user.email, password: "wrongpass" } }
    expect(response).to have_http_status(:unauthorized)
  end

  it "fails login with non-existent user" do
    post "/login", params: { user: { email: "fake@example.com", password: "password123" } }
    expect(response).to have_http_status(:unauthorized)
  end
end
