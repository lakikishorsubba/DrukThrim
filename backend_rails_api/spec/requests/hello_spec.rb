require 'rails_helper'

RSpec.describe "Hellos", type: :request do
  describe "GET /hello" do
    it "returns http success" do
      get "/hello/hello"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /hellos" do
    it "returns http success" do
      get "/hello/hellos"
      expect(response).to have_http_status(:success)
    end
  end

end
