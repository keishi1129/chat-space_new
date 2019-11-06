class UsersController < ApplicationController

  def index  
    members = []
    members = User.find(params[:userIds])
    members.each do |member|
    @users = User.search(params[:keyword], member.id)
    end
    respond_to do |format|
      format.html
      format.json
    end
  end

  def new
  end

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end

  
end
