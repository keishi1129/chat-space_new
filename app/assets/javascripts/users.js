$(document).on('turbolinks:load', function(){

  let search_list = $("#user-search-result");

  function searchUser(user){

    let html =`
    <div class="chat-group-user clearfix">
      <p class="chat-group-user__name">${user.name}</p>
      <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</a>
    </div>` ;
    search_list.append(html);
  }
  function appendErrMsgToHTML(msg){

    let html =`
    <div class="chat-group-user clearfix">
      <p class="chat-group-user__name">${msg}</p>
    </div>`;

    search_list.append(html);
  }

  function addDeleteUser(name, id) {
    let html = `
    <div class="chat-group-user clearfix">
      <p class="chat-group-user__name">${name}</p>
      <a class="chat-group-user-remove chat-group-user__btn chat-group-user__btn--remove" data-user-id="${id}" data-user-name="${name}">削除</a>
      <input type="hidden" name="group[user_ids][]" class="user-id" value="${id}">
    </div>`;
    $(".js-add-user").append(html);
  }
  function addMember(userId) {
    let html = `<input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;
    $(`#${userId}`).append(html);
  }

  $('#user-search-field').on("keyup", function(e){
    let input = $('#user-search-field').val(); 
    userIds = []
    $('.user-id').map(function(){
      userId = $(this).val();
      userIds.push(userId);
    });
    $.ajax({
      type: "GET",
      url: "/users",
      data: { keyword: input, userIds: userIds},
      dataType: "json"
    })
    .done(function(users){
      search_list.empty();
      if (users.length !== 0) {
        users.forEach(function(user){
          searchUser(user);
        });
      }else if (input.length === 0) {
        return false;
      }else {
        appendErrMsgToHTML("一致するユーザーがいません");
      }
    })
    .fail(function() {
      alert("ユーザー検索に失敗しました");
    })
  });

  $(".chat-group-form").on("click",".user-search-add", function() {
    $('#user-search-field').reset; 
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");
    $(this).parent().remove();
    addDeleteUser(userName, userId);
    addMember(userId);
  });
  $(".chat-group-form").on("click",".chat-group-user-remove", function() {
    $(this)
      .parent()
      .remove();
  });
});