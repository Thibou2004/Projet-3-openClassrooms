const form = document.querySelector("form")
const email = document.querySelector("#email")
const password = document.querySelector("#password")

form.addEventListener("submit", login)


async function login(e) {
   e.preventDefault()

   const errorMessage = document.querySelector(".error-message")
   try {
      checkInputs()
      errorMessage.style.display = "none"


      const chargeUtile = {
       email : email.value,
       password : password.value 
      }
 
      const response = await fetch("http://localhost:5678/api/users/login",
        {
          method: "POST",
          headers: {"Content-type": "application/json"},
          body: JSON.stringify(chargeUtile)
        }
      )

      if(!response.ok)
        throw Error(`${response.status} ${response.statusText}`)

      const data = await response.json()
      
      // email.value = ""
      // password.value = ""
      
      
      localStorage.setItem("userId", `${data.userId}`)
      localStorage.setItem("token", data.token)
      window.location.href = "index.html"
   }
   catch(err) {
    console.log(err.message)
    errorMessage.style.display = "block";
    errorMessage.textContent = err.message;

   //  setTimeout(() => {
   //     errorMessage.style.display = "none"
   //  }, 3000)
   }
}

function checkInputs() {
   try {
    const emailRegex = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/


     if(!emailRegex.test(email.value) || !passwordRegex.test(password.value))
        throw Error("L'email ou le mot de passe ne sont pas valide")   
   }
   catch(err) {
      // Relance l'erreur pour arrêter l'execution de login
      throw err
   }
}