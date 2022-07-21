/* $(document).ready
$(document).ready(function() {
    var sideslider = $('[data-toggle=collapse-side]'),
        sel1 = sideslider.attr('data-target'),
        sel2 = sideslider.attr('data-target-2');
});
*/

/* document.onload
document.onload = function() {
    alert("onload()");
}
*/

////////////////////////// add user //////////////////////////////
let btnAddUser = document.getElementById("btnAddUser");
btnAddUser.onclick = saveUser;
function saveUser() {
    let body = {}
    body.firstName = document.getElementById("firstName").value;
    body.lastName = document.getElementById("lastName").value;
    body.email = document.getElementById("email").value;
    body.password = document.getElementById("password").value;
    body.roles = []

    let roles = document.getElementById("selectRoles").options;
    for(role of roles) {
        if(role.selected){
            body.roles.push({id : role.value, name : role.text });
        }
    }
    postParams(body, "/admin/addUser");
    updateUsersTable();
    return false;
}

/////////////////////////////// с пом. fetch() //////////////////
async function postParams(pbody, pUrl) {
    try {
        console.log("before fetch()")
        let response = await fetch(pUrl, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(pbody) // body: JSON.stringify(user)
        })
        .then(responce => {
            console.log(responce)
            if ( responce.redirected) {
                window.location.href = responce.url;
            }
        });

        console.log("after fetch()")
    } catch (ex) {
        console.log(ex.message)
    }
    // if (response.ok) { // если HTTP-статус в диапазоне 200-299 получаем тело ответа
    //     console.log("berfore response()")
    //     let result = await response.json();
    //     console.log("after response.json()")
    // } else {
    //     alert("Ошибка HTTP: " + response.status);
    // }
    //console.log(result.message)
}
/////////////// end c пом fetch() ////////////////////////////////////////////////////

//////////////////////////// users table: assign func to btn 'edit' //////////////////////
const arrBtnEdit = document.querySelectorAll('.VLedit');
arrBtnEdit.forEach(function(elem) {
    elem.onclick = btnEditOnClick;
})

//////////////////////////// users table: assign func to btn 'delete' //////////////////////
const arrBtnDelete = document.querySelectorAll('.VLdelete');
arrBtnDelete.forEach(function(elem) {
        elem.onclick = btnDeleteOnClick;
    })

////////////////////////////// func to assign to btn 'edit' (in users table)////////////////////////////
async function btnEditOnClick() {

    $("#editFirstName").prop("disabled", false);
    $("#editLastName").prop("disabled", false);
    $("#editEmail").prop("disabled", false);
    $("#editPassword").prop("disabled", false);
    $("#editWinSelectRoles").prop("disabled", false);

    let button = $("#btnEditDelete");
    if (button.hasClass("btn-danger")) {
        button.removeClass("btn-danger");
        button.addClass("btn-primary")
    }
    button.text("Edit");
    $("#editDeleteUserLabel").text("Edit user");
}

////////////////////////////// func to assign to btn 'delete' (in users table) ////////////////////////////
async function btnDeleteOnClick() {

    $("#editFirstName").prop("disabled", true);
    $("#editLastName").prop("disabled", true);
    $("#editEmail").prop("disabled", true);
    $("#editPassword").prop("disabled", true);
    $("#editWinSelectRoles").prop("disabled", true);

    let button = $("#btnEditDelete");
    if (button.hasClass("btn-primary")) {
        button.removeClass("btn-primary");
        button.addClass("btn-danger")
    }
    button.text("Delete");
    $("#editDeleteUserLabel").text("Delete user");
}

////////////////////////////// btn 'btnEditDelete' (modal win 'edit user') ////////////////////////
let btnModalEdit = document.getElementById("btnEditDelete");
btnModalEdit.onclick = function (pEvent) {
    if (this.classList.contains("btn-primary")) {
        let body = {}
        body.id = $("#editId").val();
        body.firstName = $("#editFirstName").val();
        body.lastName = $("#editLastName").val();
        body.email = $("#editEmail").val();
        body.password = $("#editPassword").val();
        body.roles = [];
        // На память, как было у меня во второй раз:
        // let roles = document.getElementById("editWinSelectRoles").options;
        // for(role of roles) {
        //     if(role.selected){
        //         body.roles.push({id : role.value, name : role.text });
        //     }
        // }

        let roles = document.getElementById("editWinSelectRoles").selectedOptions;
        for(role of roles) {
            body.roles.push({id : role.value, name : role.text });
        }

        postParams(body, "/admin/editUser");
    }

    if (this.classList.contains("btn-danger")) {
        getDeleteUser($("#editId").val());
    }

    $('#editDeleteUser').modal('hide');
    return false;

} // btnModalEdit.onclick = function (pEvent)

//////////////////////////// 'show.bs.modal' - при открытии мод. окна: //////////////////////////////////////////////
$('#editDeleteUser').on('show.bs.modal', async function (event) {
    let button = event.relatedTarget; // кнопка, которая открыла окно
    let userID = button.value; // из аналогичной задачи: button.getAttribute('UserID');
    //let response = await getEdit(userID);

    // by default fetch() uses method GET:
    let json = null;
    let response  = await fetch("/admin/getUserWroles?id=" + userID);
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа (см. про этот метод ниже)
        json = await response.json();
        json.roles.sort(compareRoles);
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

    $("#editId").val(json.id);
    // если не сработал jquery (а он несколько раз не работал для поля ID), то можно так:
    // document.getElementById("editId").value = cells[0].innerText;
    $("#editFirstName").val(json.firstName);
    $("#editLastName").val(json.lastName);
    $("#editEmail").val(json.email);
    $("#editPassword").val(json.password);

    let lvSelect = document.getElementById("editWinSelectRoles");
    lvSelect.innerHTML = ""; // .empty(); // .append('<option value=1>My option</option>').selectmenu('refresh');
    json.roles.forEach(pRole => {
        let option = document.createElement("option");
        option.value = pRole.id;
        option.text = pRole.name;
        if (pRole.checked)
            option.selected = true;
        // option.setAttribute('selected', "");
        lvSelect.add(option, null);
    })

});

/* addEventListener('show.bs.modal'..) doesn'n work here, but works on boostrab v. 3.1.3

let editUserModal = document.getElementById('editDeleteUser');
editUserModal.addEventListener('show.bs.modal',  function (event) {
    let button = event.relatedTarget; // кнопка, которая открыла окно
    alert("show bs modal");


    let userID = button.value; // из аналогичной задачи: button.getAttribute('UserID');
    //let response = await getEdit(userID);

    // by default fetch() uses method GET:
    let json = null;
    let response  = await fetch("/admin/getUserWroles?id=" + userID);
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа (см. про этот метод ниже)
        json = await response.json();
        json.roles.sort(compareRoles)
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

    $("#editId").val(json.id);
    // если не сработал jquery (а он несколько раз не работал для поля ID), то можно так:
    // document.getElementById("editId").value = cells[0].innerText;
    $("#editFirstName").val(json.firstName);
    $("#editLastName").val(json.lastName);
    $("#editEmail").val(json.email);
    $("#editPassword").val(json.password);

    let lvSelect = document.getElementById("editWinSelectRoles");
    lvSelect.innerHTML = ""; // .empty(); // .append('<option value=1>My option</option>').selectmenu('refresh');
    json.roles.forEach(pRole => {
        let option = document.createElement("option");
        option.value = pRole.id;
        option.text = pRole.name;
        if(pRole.checked)
            option.selected = true;
        // option.setAttribute('selected', "");
        lvSelect.add(option, null);

    });

    $("#editId").val(response.user.id);
    // $("#createdMod").val(response.user.created);
    $("#editFirstName").val(response.user.firstName);
    $("#editLastName").val(response.user.lastName);
    $("#editEmail").val(response.user.email);
    $("#editPassword").val(response.user.password);
    let selectTag = document.getElementById("editWinSelectRoles");
    selectTag.options.length = 0;

    for (var i = 0; i<response.roles.length; i++){
        let opt = document.createElement('option');
        opt.value = response.roles[i].id;
        opt.text = response.roles[i].name;
        if(response.roles[i].checked)
            opt.selected = true;
        selectTag.appendChild(opt);
    }
});
*/

/* так я делал когда по второму разу задачу решал.
////////////////////////////// btn 'delete' (modal win 'edit user') ////////////////////////
let btnModalDelete = document.getElementById("btnModalDelete");
btnModalDelete.onclick = btnModalDeleteOnclick;
async function btnModalDeleteOnclick() {

    $('#editDeleteUser').modal('hide');

    let response = await fetch("/admin/delete?id=" + $("#editId").val())
        .then(responce => {
            if ( responce.redirected) {
                window.location.href = responce.url;
            }
        });

    return false;

}
*/

// но потом решил взять пример с первой задачи:
////////////////////////////////// удалить user'а метод GET ///////////////////////////////////////////////
async function getDeleteUser(userID) {
    try {
        let response = await fetch("/admin/delete?id=" + userID, {
            credentials: 'include', method: 'DELETE',
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        })
            .then(responce => {
                console.log(responce)
                if ( responce.redirected) {
                    window.location.href = responce.url;
                }
            });
        console.log(response);
    } catch (ex) {
        alert(ex.message);
    }
    if (response.ok) { // если HTTP-статус в диапазоне 200-299 получаем тело ответа
        // window.location.href = "/admin";
        $("#result001").html("Deleted at " + new Date());
        // updateUsersTable();
        // updUserRole();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }

}

async function updateUsersTable(){
    let jsonV = null;
    let response = await fetch("/admin/getUsers");
    jsonV =  await response.json();

    // $("#tbodyUsersTable").html("");
    tbodyUsers = document.getElementById("tbodyUsersTable");
    tbodyUsers.innerHTML = "fff";
    let aaa = 111;

    $('#editDeleteUser').modal('hide');
    $('#nav-UsersТable-tab').tab('show');
}

// применяется на событии 'show.bs.modal' для сорта ролей. Можно использовать:  json.roles.sort((x,y)=>x-y)
function compareRoles( a, b ) {
    if ( a.id < b.id){
        return -1;
    }
    if ( a.id > b.id ){
        return 1;
    }
    return 0;
}

/* Так я хотел добавить класс, чтобы активировать окно с таблицей юзеров
    $('#editDeleteUser').modal('hide');
    // берём элементы верхнего меню, перебираем и делаем активным п. "users table"
    let ppMenus = document.getElementsByClassName("vlTopMenu");
    for(punct of ppMenus) {
        if(punct.id == "nav-UsersТable-tab")
            punct.classList.add("active");
        else
            punct.classList.remove("active");

    }
    // Toggle class (adds the class if it's not already present and removes it if it is)
    // element.classList.toggle('hidden');

    // перебираем панели от пунктов меню и делаем актовной панель c таблицой юзеров
    let menuContent = $(".vlTopMenuContent");
    menuContent.removeClass("show active")
    menuContent.each(
        function (pContent){
            if (pContent.id =="nav-UsersТable")
                pContent.classList.add("show active");
        }
    );
*/






