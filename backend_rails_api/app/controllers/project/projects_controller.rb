module Project
  class ProjectsController < ApplicationController
    before_action :authenticate_user!
    before_action :authorized_admin!, only: [:index, :create, :update, :destroy]

    def index
      render json: Project.all, status: :ok
    end

    def show
      project = Project.find(params[:id])
      render json: project, status: :ok
    end

    def create
      project = Project.new(project_params)
      if project.save
        render json: project, status: :created
      else 
        render json: {
          errors: project.errors.full_messages
        },
        status: :unprocessable_entity
      end
    end

    def update
      project = Project.find(params[:id])
      if project.update(project_params)
        render json: project
      else
        render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      project = Project.find(params[:id])
      project.destroy
      render json: { message: 'Project deleted successfully' }
    end


    def project_params
      params.require(:project).permit(:title, :description, :category, :status, :location, :start_date, :total_budget, :spent_budget)
    end
    def authorized_admin!
      render json: {error: "Unauthorized"}, status: :unauthorized unless current_user.admin?
    end
    
  end
end