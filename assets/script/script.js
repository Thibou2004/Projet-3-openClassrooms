let listWorks;
let listCategories

window.addEventListener("load", loadingEvent)
const logLink = document.querySelector("nav li:nth-of-type(3) a");

function loadingEvent() {
  addWorks(listWorks)
  addNewFilterBtn()
  addNewOptionsToInputCategory()
  if(!localStorage.getItem("token")){
    logLink.textContent = "login"
    logLink.href = "login.html"
  }
  else{
    document.querySelector(".edit-mode").style.display = "flex"
    document.querySelector(".edit").style.display = "block"
    logLink.textContent = "logout"
    logLink.href = "#"
    document.querySelector(".filterBtn-group").style.display = "none"
    logLink.addEventListener("click", logOut)
  }

}

function logOut(e) {
  e.preventDefault();
  logLink.textContent = "login"
  logLink.href = "login.html"

    document.querySelector(".edit-mode").style.display = "none"
    document.querySelector(".edit").style.display = "none"
    document.querySelector(".filterBtn-group").style.display = "flex"
  
  localStorage.removeItem("userId")
  localStorage.removeItem("token")
  logLink.removeEventListener("click", logOut)
}

async function getWorks(){
   try {
     const response = await fetch("http://localhost:5678/api/works")

     if(!response.ok)
        throw Error(`${response.statusText} : ${response.status}`)

     const data =  await response.json();
     listWorks = data;
   }
   catch(err){
     console.log(err.message)
     return;
   }
}

async function addWorks(list) {
   if(!list) {
    await getWorks()
    list = listWorks
   }

   const gallery = document.querySelector(".gallery")
   gallery.innerHTML = "";

   for(let i = 0; i < list.length; i++) {
     const figure = document.createElement("figure")
     const img = document.createElement("img")
     const figcaption = document.createElement("figcaption")

     img.setAttribute("src", list[i].imageUrl)
     img.setAttribute("alt", list[i].title)
     figcaption.textContent = list[i].title

     figure.appendChild(img)
     figure.appendChild(figcaption)

     gallery.appendChild(figure)
   }
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories")

    if(!response.status)
       throw Error(`${response.statusText} : ${response.status}`)

    const data =  await response.json();
   listCategories = data
  }
  catch(err){
    console.log(err.message)
    return;
  }
}

let filtersBtn = document.querySelectorAll(".filter-btn")
 
async function addNewFilterBtn() {
  if(!listCategories)
    await getCategories()

  const filterBtnGroup = document.querySelector(".filterBtn-group")

  filterBtnGroup.innerHTML = ""
  
  const btnList = createNewFiltersBtn();

  for(let i = 0; i < btnList.length; i++)
    filterBtnGroup.appendChild(btnList[i])
}

function createNewFiltersBtn() {
  const btnList = []

  const allBtn = document.createElement("button")
  allBtn.classList.add("filter-btn")
  allBtn.classList.add("active")
  allBtn.setAttribute("data-value", 0)
  allBtn.textContent = "Tous"

  btnList.push(allBtn)

  for(let i = 0; i < listCategories.length; i++) {
    const btn = document.createElement("button")

    btn.classList.add("filter-btn")
    btn.setAttribute("data-value", listCategories[i].id)
    btn.textContent = listCategories[i].name

    btnList.push(btn)
  }
  
  btnList.forEach(btn => {
    btn.addEventListener("click", filterWorks)
  })
  return btnList;
}

async function addNewOptionsToInputCategory() {
  if(!listCategories)
    await getCategories()

  const inputCategory = document.getElementById("category")
  
  const optionList = createCategoryOption()

  for(let i = 0; i < optionList.length; i++)
    inputCategory.appendChild(optionList[i])
}

function createCategoryOption() {
  const optionList = []

  const firstOption = document.createElement("option")
  firstOption.value = ""
  firstOption.disabled = true
  firstOption.selected = true
  optionList.push(firstOption)

  for(let i = 0; i < listCategories.length; i++) {
     const option = document.createElement("option")

     option.value = listCategories[i].name
     option.textContent = listCategories[i].name

     optionList.push(option)
  }
  
  return optionList;
}

async function filterWorks(e) {
   if(e.target.classList.contains("active"))
    return;
  const filtersBtn = document.querySelectorAll(".filter-btn")
   filtersBtn.forEach(btn => {
    if(btn.classList.contains("active"))
        btn.classList.remove("active")
   })
   e.target.classList.add("active")
   
   const dataValue = Number(e.target.getAttribute("data-value"));

   if(dataValue === 0){
    addWorks(listWorks)
   }
   else {
    addWorks(listWorks.filter(work => work.categoryId === dataValue))
   }
}

/* Modal window */

// open Modal Window
const backgroundModalWindow = document.querySelector(".background-modal-window")
const editGallery = document.querySelector(".edit")

editGallery.addEventListener("click", openModalWindow)

function openModalWindow() {
   backgroundModalWindow.style.display = "flex";

  addImageToModalWindow(listWorks)

}

//Close Modale Window

const closeWindowBtn = document.querySelector(".close-window-btn")

closeWindowBtn.addEventListener("click", closeModalWindow)
backgroundModalWindow.addEventListener("click", closeModalWindow)

function closeModalWindow() {
  backgroundModalWindow.style.display = "none"
  goToDeletePage()
}

//Stop propagation
const modalWindow = document.querySelector(".modal-window")

modalWindow.addEventListener("click", stopPropagation)

function stopPropagation(e) {
  e.stopPropagation();
}

function addImageToModalWindow() {
  const containerGalleryModalWindow = document.querySelector(".modal-window-gallery .container-gallery")

  containerGalleryModalWindow.innerHTML = ""
  
  for(let i = 0; i < listWorks.length; i++) {
    const div = document.createElement("div")
    const img = document.createElement("img")
    const button = document.createElement("button")
    const icon = document.createElement("i")

    img.setAttribute("src", listWorks[i].imageUrl)
    img.setAttribute("alt", listWorks[i].title)

    icon.classList.add("fa-solid")
    icon.classList.add("fa-trash-can")

    button.appendChild(icon)
    button.setAttribute("work-Id", listWorks[i].id)

    button.addEventListener("click",() =>  deleteWork(listWorks[i].id))

    div.appendChild(img)
    div.appendChild(button)

    containerGalleryModalWindow.appendChild(div)
  }
}

/* Change page */
const modalWindowDeletePicturePage = document.querySelector(".modal-window-gallery")
const modalWindowAddPicturePage = document.querySelector(".modal-window-add-image")
// add picture page

const addPicturePageBtn = document.querySelector(".add-image-btn")

addPicturePageBtn.addEventListener("click", goToAddPage)

function goToAddPage(){
  modalWindowDeletePicturePage.style.display = "none"
  modalWindowAddPicturePage.style.display = "block"
}

// delete picture page

const deletePicturePageBtn = document.querySelector(".return-btn")
const form = document.querySelector(".modal-window-add-image form")
const formAllInput = form.querySelectorAll("input, select")
const previewBackground = document.querySelector(".preview-background")
const importImageArea = document.querySelector(".import-new-image")


deletePicturePageBtn.addEventListener("click", goToDeletePage)

function goToDeletePage(){
  modalWindowDeletePicturePage.style.display = "block"
  modalWindowAddPicturePage.style.display = "none" 
  
  // Rénitialliser la page addPicture
  previewBackground.style.display ="none"
  importImageArea.style.display = "flex"
  formAllInput.forEach(input => {
    input.value = ""
   })
}

/* Add a work */
const importPictureInput = document.getElementById("imageInput")

importPictureInput.addEventListener("change", displayNewPicture)

function displayNewPicture(){
  const file = importPictureInput.files[0]
  
  console.log(file)
  if(file) {
    const preview = document.querySelector(".preview")
    
    importImageArea.style.display = "none"
    previewBackground.style.display = "flex"
    preview.style.display = "block"

    const imageURL = URL.createObjectURL(file)
    console.log(imageURL)
    preview.src = imageURL
    preview.alt = file.name.replace(/\.(png|jpg)/, "")
  }
}

// Inputs verification
const sendImageBtn = document.querySelector(".send-image-btn")

formAllInput.forEach(input => {
  input.addEventListener("input", isInputsValid)
})

function isInputsValid(){
  for(let i = 0; i < formAllInput.length; i++) {
    if(formAllInput[i].value === "" || formAllInput[0].files[0] === undefined){
      sendImageBtn.classList.add("disabled")
      sendImageBtn.disabled = true
      return;
    }
  }
  sendImageBtn.classList.remove("disabled")
  sendImageBtn.disabled = false
}

form.addEventListener("submit", sendNewWork)

async function sendNewWork(e) {
  e.preventDefault()

  try {
    const formData = new FormData()
    console.log(listCategories.find(obj => obj.name === formAllInput[2].value).id)
    formData.append("image", formAllInput[0].files[0])
    formData.append("title", formAllInput[1].value)
    formData.append("category", listCategories.find(obj => obj.name === formAllInput[2].value).id)

     const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`},  
      body: formData
     })
     if(!response.ok)
      throw Error(`${response.status} ${response.statusText}`)

     // On modifie listWorks et les galleries
    //  listWorks.push(data)
     await getWorks()
     await addWorks(listWorks)
     addImageToModalWindow()

     // On vide les inputs
     formAllInput.forEach(input => {
      input.value = ""
     })
     
     // On change de page et ferme la fenêtre.
    //  goToDeletePage()
    //  closeModalWindow()
  }
  catch(err) {
    console.log(err)
  }
}

/* Delete a work */

async function deleteWork(id) {
  // const workId = e.target.getAttribute("work-Id")
  
  // if (!workId) return

  const confirmDelete = confirm("Voulez-vous vraiment supprimer cette image ?")

  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression : ${response.status}`)
    }

    // Mise à jour de listWorks
    listWorks = listWorks.filter(work => work.id !== parseInt(id))

    await addWorks(listWorks)
    addImageToModalWindow()
  }
  catch(err) {
    console.log(err.message)
  }
}
