 // $(document).ready
$(document).ready(function() {
    updateUsersTable();
});

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
    // updateUsersTable(); - see in postParams(...)
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
        })
        .then(responce => {
            updateUsersTable();
            console.log(responce)
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
    // не имеет смысла здесь, т.к. ф-ция fetch() асинхронная. В ней и смотри updateUsersTable
    // updateUsersTable();
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
                updateUsersTable();
                console.log(responce)
                // if ( responce.redirected) {
                //     window.location.href = responce.url;
                //     updateUsersTable();
                // }
            });
        console.log(response);
    } catch (ex) {
        alert(ex.message);
    }
    // if (response.ok) { // если HTTP-статус в диапазоне 200-299 получаем тело ответа
    //     // window.location.href = "/admin";
    //     $("#result001").html("Deleted at " + new Date());
    //     // updateUsersTable();
    //     // updUserRole();
    // } else {
    //     alert("Ошибка HTTP: " + response.status);
    // }

}

async function updateUsersTable(){
    let jsonV = null;
    let response = await fetch("/admin/getUsers");
    jsonV =  await response.json();

    let tbodyUsers = document.getElementById("tbodyUsersTable");
    tbodyUsers.innerHTML = "";
    //jsonV.forEach(inserRowInUsersTable);
    for(let usr of jsonV) {
        inserRowInUsersTable(usr, tbodyUsers);
    }
    let aaa = 111;
    $('#editDeleteUser').modal('hide');
    $('#nav-UsersТable-tab').tab('show');
}

////////////////////////// update user info ////////////////////////////////
 let btnMenuUser = document.getElementById("v-pills-user-tab");
btnMenuUser.onclick = async function () {
    let jUsers = null;
    let response = await fetch("/user/getUserInfo");
    jUsers =  await response.json();

    let tbodyJQ = $("#tblUserInfo tbody").empty();
    let sRoles = "";
     jUsers.roles.forEach(role => sRoles += role.name + ", ");
    // if(jUsers.hasOwnProperty(length)) {}
    // for (i = 0; i < jUsers.length; i++) {
        tbodyJQ.append(`<tr>
            <td> ${jUsers.id} </td>
            <td> ${jUsers.firstName} </td>
            <td> ${jUsers.lastName} </td>
            <td> ${jUsers.email} </td>
            <td> ${jUsers.password} </td>
            <td> ${sRoles} </td>
        </tr>`);
    // <td> ${jUsers[i].modified} </td>
    // <td class="vl_EditButton"> <input type="button" value="Edit" class="btn btn-success" id="'bEdit' + ${jUsers[i].id}" data-bs-toggle="modal" data-bs-target="#editUser" UserID="${jUsers[i].id}"/> </td>
    // <td class="vl_DeleteButton"> <input type="button" value="Delete" class="btn btn-danger" id="'bDelete' + ${jUsers[i].id}" data-bs-toggle="modal" data-bs-target="#editUser" UserID="${jUsers[i].id}"/> </td>
    // } // for (i = 0; i < jUsers.length; i++) {
};
///////////////////// insert row in UsersTable ////////////////////////////
function inserRowInUsersTable(user, tbodyUsers){
    let row = tbodyUsers.insertRow(); //tBody0.insertRow();
    let cell = null;
    cell = row.insertCell(0);
    cell.innerText = user.id;
    cell = row.insertCell(1);
    cell.innerText = user.firstName;
    cell = row.insertCell(2);
    cell.innerText = user.lastName;
    cell = row.insertCell(3);
    cell.innerText = user.email;
    cell = row.insertCell(4);
    cell.innerText = user.password;
    cell = row.insertCell(5);
    cell.innerText = roles2Str(user.roles);
    let btnEditInTable = document.getElementById("idVlEditHidden").cloneNode();
    btnEditInTable.hidden = false;
    btnEditInTable.innerText = "Edit";
    btnEditInTable.onclick = btnEditOnClick;
    btnEditInTable.value = user.id;
    btnEditInTable.id = "id" + user.id;
/* работает, css подхватывает it works:
    let htmlBtnEdit = document.createElement("button");
    htmlBtnEdit.innerText = "hoho Edit";
    htmlBtnEdit.classList.add("btn");
    htmlBtnEdit.classList.add("btn-primary");
    htmlBtnEdit.classList.add("VLedit");
*/
        // "<button type=\"button\" className=\"btn btn-primary VLedit\" data-toggle=\"modal\" data-target=\"#editDeleteUser\"\
        //         id='id" + user.id + "' name=\"editName\" value=\"" + user.id + "\"> \
        //     Edit\
        // </button>"
    // row.insertCell(6).innerHTML = htmlBtnEdit;
    // row.insertCell(6).innerHTML = htmlBtnEdit;
    cell = row.insertCell(6);
    cell.append(btnEditInTable);

    let btnDeleteInTable = document.getElementById("idVlDeleteidden").cloneNode();
    btnDeleteInTable.hidden = false;
    btnDeleteInTable.innerText = "Delete001";
    btnDeleteInTable.onclick = btnDeleteOnClick;
    btnDeleteInTable.value = user.id;
    btnDeleteInTable.id = "deleteId" + user.id;
    btnDeleteInTable.onclick = btnDeleteOnClick;
    cell = row.insertCell(7);
    cell.append(btnDeleteInTable);

    // <td>
    //     <button type="button" className="btn btn-danger VLdelete" data-toggle="modal" data-target="#editDeleteUser"
    //             th:id="'deleteId' + ${user.id}" name="deleteName" th:value="${user.id}">
    //         Delete
    //     </button>
    //
        // cell.innerText = "id = " + user.id;


}

function roles2Str(roles) {
    let stringRoles = "";
    roles.forEach(x=>{
       stringRoles += x.name + ",";
    });
    return stringRoles;
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






