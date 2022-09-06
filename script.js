const request_url = "https://jsonplaceholder.typicode.com/users";
let tbody = document.getElementById("tbody");
let deleteBtn = document.querySelector("#del_button");
let deletedUserId = "";
let editUserId = "";
let selectUserId = "";
let users = [];
const add_employee = document.forms.main;
const edit_form = document.forms.edit_form;

fetch(request_url)
  .then((res) => res.json())
  .then((json) => {
    users = json;
    createUsers(json);
  });

function td_fun({ id, name, email, address, phone }) {
  let tr = document.createElement("tr");
  tr.setAttribute("data-id", id);

  tr.innerHTML = ` 
 
    <td>
        <span class="custom-checkbox">
            <input type="checkbox" id="checkbox1"/>
            <label for="checkbox1"></label>
        </span>
    </td>
    <td>${name}</td>
    <td>${email}</td>
    <td>${address.street}</td>
    <td>${phone}</td>
    <td> 
      <a href="#popup_del" class=" btn btn-primary " onclick= 'deletedUserId = ${id}' >DELETED</a>
      <a href="#popup_edit" class=" btn btn-primary " id='del'   onclick="selectUser(${id})"  >EDIT</a>
    </td>
  `;

  return tr;
}

function createUsers(data) {
  tbody.innerHTML = ``;
  data.map((users) => {
    tbody.append(td_fun(users));
  });
}

function deleted_User() {
  let id = deletedUserId;

  let index = users.findIndex((user) => {
    return user.id == id;
  });

  fetch(` https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => {
      console.log("GOOD");
      user = users.splice(index, 1);
      tbody.querySelectorAll("tr")[index].remove();
    });
}

function addUser(e) {
  e.preventDefault();

  let tr = document.createElement("tr");

  let new_user = {};

  new_user.name = add_employee.inputName.value;
  new_user.email = add_employee.inputEmail.value;
  new_user.address = add_employee.inputAddress.value;
  new_user.phone = add_employee.inputPhone.value;
  users.push(new_user);

  tr.innerHTML = ` 
 
    <td>
        <span class="custom-checkbox">
            <input type="checkbox" id="checkbox1"/>
            <label for="checkbox1"></label>
        </span>
    </td>
    <td>${new_user.name}</td>
    <td>${new_user.email}</td>
    <td>${new_user.address}</td>
    <td>${new_user.phone}</td>
    <td>
      <a href="#popup_del" class=" btn btn-primary " onclick= 'deletedUserId = ${new_user.id}' >DELETED</a>
      <a href="#popup_edit" class=" btn btn-primary "    >EDIT</a>

    </td>
    
    `;
  tbody.append(td_fun(new_user));
  fetch(`https://jsonplaceholder.typicode.com/users`, {
    method: "POST",

    body: JSON.stringify({
      id: new_user.id,
      name: new_user.name,
      email: new_user.email,
      address: new_user.address,
      phone: new_user.phone,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

function selectUser(id) {
  selectUserId = id;
  let index = users.findIndex((user) => {
    // console.log(user.id,id, user.id == id);
    return user.id == id;
  });
  edit_form.edte_name.value = users[index].name;
  edit_form.edte_email.value = users[index].email;
  edit_form.edte_address.value = users[index].address.street;
  edit_form.edte_phone.value = users[index].phone;
  editUserId = id;
}

function editUser(e) {
  e.preventDefault();

  users?.map((elem) => {
    if (elem.id === editUserId) {
      elem.name = edit_form.edte_name.value;
      elem.email = edit_form.edte_email.value;
      elem.address.street = edit_form.edte_address.value;
      elem.phone = edit_form.edte_phone.value;
    }
  });

  createUsers(users);

  fetch(` https://jsonplaceholder.typicode.com/users/${editUserId}`, {
    method: "PUT",
    body: JSON.stringify({
      id: editUserId,
      name: edit_form.edte_name.value,
      email: edit_form.edte_email.value,
      address: edit_form.edte_address.value,
      phone: edit_form.edte_phone.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => {
      if (response.status == 200) {
        // $('#del').click();
        document.querySelector("#popup_edit").style.opacity = 0;
        document.querySelector("#popup_edit").style.visibility = hidden;
        
       
      }  else
{

}
      return response.json();
    })
    .then((json) => console.log("Good", json));
}

edit_form.addEventListener("submit", (e) => editUser(e));
add_employee.addEventListener("submit", (e) => addUser(e));
