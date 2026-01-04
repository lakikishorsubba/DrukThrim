class V1::PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [:update, :destroy]  # removed :show

  def index
    posts = Post.includes(images_attachments: :blob).order(created_at: :desc)
    render json: posts.map { |p| serialized_post(p) }
  end

  def create
    post = current_user.posts.build(post_params)
    if post.save
      attach_images(post)
      render json: serialized_post(post), status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end
  def update
  if @post.update(post_params)
    attach_images(@post)
    render json: serialized_post(@post)
  else
    render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
  end
  end

def destroy
  @post.destroy
  head :no_content
end


  private

  def set_post
    @post = current_user.posts.find(params[:id])
  end

  def post_params
    params.permit(:title, :description, images: [])
  end

  def attach_images(post)
    return unless params[:images].present?
    post.images.attach(params[:images])
  end

  def serialized_post(post)
    {
      id: post.id,
      title: post.title,
      description: post.description,
      images: post.images.map { |img| { id: img.id, url: Rails.application.routes.url_helpers.rails_blob_url(img, only_path: false) } },
      user: { id: post.user.id, name: post.user.name },
      created_at: post.created_at
    }
  end
end
