let ulDom = document.querySelector("ul");
let ekleBtn = document.querySelector("#ekleBtn");
let temizleBtn = document.querySelector("#temizleBtn");
let errormessage = document.querySelector("#errormessage");
let ekleInput = document.querySelector("#txtTaskName");
let lastTaskId;

let gorevListesi = [];

 
if(localStorage.getItem("gorevListesi") !== null) {
    gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
}



let returnedTask = "";

const filters = document.querySelectorAll(".filters span")

let editId;
let editMode = false;

displayTasks("all");



for (let span of filters) {

    span.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active")
        span.classList.add("active");
        displayTasks(span.id) // all pending completed
    })



}






function displayTasks(filter) {
    //Title
    document.title = `You've "${gorevListesi.length}" tasks to do :)`


    
    ulDom.innerHTML = " ";
    if (gorevListesi.length == 0) {
        ulDom.innerHTML = "You have no task to do.";
        document.title = `Your tasks are done!`
    } else {
        for (let gorev of gorevListesi) {

            let completed = gorev.durum == "completed" ? "checked" : "";

            if(filter == gorev.durum || filter == "all"){

                
                let li = `
    
                <li class="task list-group-item">
                <div class = "form-check">
                    <input onclick="updateStatus(this)" type="checkbox" name="" id="${gorev.id}" class="form-check-input " ${completed} />
                    <label for="${gorev.id}" class="form-check-label ${completed} ">${gorev.gorevAdi}</label> </div>
                    <div class="dropdown">
                        <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="lni lni-more-alt"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" id="removeBtn" href="#"><i class="lni lni-trash-can"></i> Delete</a></li>
                            <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" id="editBtn" href="#"><i class="lni lni-pencil"></i> Edit</a></li>
    
                        </ul>
                    </div>
                </li>`;
                ulDom.insertAdjacentHTML("beforeend", li);
            }


            



            




        }
    }
}




function alertMSG(text = "alertText", display = true) {
    errormessage.innerHTML = text;
    if (display) {
        errormessage.style = "display: true;";
    } else {
        errormessage.style = "display: none;";
    }
};

function newTask() {

    if (ekleInput.value == "") {
        alertMSG("Task area must be filled.", true);
    } else {
        ekleBtn.innerHTML = "Add";

        if (editMode == true) {
            let willEdit = gorevListesi.findIndex((gorev) => editId == gorev.id);

            gorevListesi[willEdit].gorevAdi = ekleInput.value;
            editMode = false;
            ekleInput.value = "";
            alertMSG("", false);
        } else {
            // editMode FALSE --> default

            alertMSG("", false);
            let taskName = ekleInput.value;
            
            gorevListesi.push({
                id: gorevListesi.length + 1,
                gorevAdi: `${taskName} `,
                durum: `pending`
            });
            ekleInput.value = "";
        }

        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    }
};

ekleBtn.addEventListener("click", (event) => {
    event.preventDefault();
    newTask();
});

document.querySelector("html").addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        ekleBtn.click();
    }
});

temizleBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearTasks();
});

function deleteTask(taskId) {
    let deletedId;

    deletedId = gorevListesi.findIndex((gorev) => gorev.id == taskId); // Arrow function

    console.log("Deleted: ", deletedId);
    gorevListesi.splice(deletedId, 1);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displayTasks(document.querySelector("span.active").id);
   
};

function editTask(gorevId, gorevAdi) {
    ekleInput.focus();
    ekleBtn.innerHTML = "Confirm";
    alertMSG("Edit mode is active.", true);
    editId = gorevId;
    editMode = true;
    console.log(gorevId, gorevAdi);

    ekleInput.value = gorevAdi;
};

function clearTasks() {
    gorevListesi.splice(0, gorevListesi.length);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    displayTasks("all");
    
};

function updateStatus(checkbox) {

    let label = checkbox.nextElementSibling
    let durum;
    if (checkbox.checked) {

        durum = "completed";
        label.classList.add("checked");
    }
    else {

        durum = "pending";
        label.classList.remove("checked")

    }

    for (let gorev of gorevListesi) {

        if (gorev.id == checkbox.id) {
            gorev.durum = durum
        }
    }
    localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    console.log(gorevListesi)

}