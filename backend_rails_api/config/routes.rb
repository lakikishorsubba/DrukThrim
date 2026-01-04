Rails.application.routes.draw do
  resources :projects, only: [:index, :create, :update, :destroy]
  
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    
  }

  namespace :users do
    #user details routes
    get "current_user", to: "current_user#show"
    #profile routes
    get  "profile", to: "profile#show"
    patch "profile/avatar", to: "profile#update_avatar"
    patch "profile/name", to: "profile#update_name"
 end

 namespace :project do
   resources :project, only: [:index, :show, :create, :update, :destroy]
 end
 
 namespace :v1 do
   resources :posts
 end
end
