// Tableau qui contiendra toutes les tâches
let tasks = [];

// Récupération des éléments HTML par leurs id
const taskForm = document.getElementById("taskForm");
const addTaskButton = document.getElementById("addTaskButton");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Fonction qui permet d'ajouter une tâche
const addTask = (event) => {
  event.preventDefault();
  const taskText = taskInput.value.trim();

  // Si le nom de la tâche ou la description est vide, la tâche ne se crée pas
  if (!taskText) return;

  // Récupère la date actuelle de création de la tâche
  const creationDate = new Date();
  // Ajoute la nouvelle tâche au tableau tasks
  tasks.push({
    text: taskText,
    completed: false, // Lorsque la tâche est créé, automatiquement, elle ne sera pas terminée
    creationDate,
  });

  // Réinitialise les champs de saisie (input) après avoir créé une tâche
  taskInput.value = "";
  // Cela s'affiche toute la liste des tâches après avoir créé une tâche
  renderTasks();
  // Enregistre les tâches dans localStorage
  saveTasks();
};

// Ajoute un événement qui se déclenche quand le formulaire est envoyé.
taskForm.addEventListener("submit", addTask);

// Fonction pour afficher les tâches dans la liste avec un filtre
const renderTasks = (filter = "all") => {
  taskList.innerHTML = "";
  tasks
    .filter(
      // Applique un filtre selon l'état de la tâche
      (task) => {
        if (filter === "all") {
          return task.completed || !task.completed; // Affiche toutes les tâches (Terminées et non terminées)
        } else if (filter === "completed") {
          return task.completed  // Affiche seulement les tâches terminées
        } else if (filter === "notCompleted") {
          return !task.completed // Affiche seulement les tâches non terminées
        }
      }
    )
    .forEach((task, index) => {
      // Crée un nouvel élément <li> pour chaque tâche
      const li = document.createElement("li");
      // Applique un fond avec des taches à chaque élément <li>
      li.style.background =
        "linear-gradient(to bottom right, #374151, #111827, #000000)";
      // Crée un élément <p> pour afficher le texte de la tâche
      const taskText = document.createElement("p");
      taskText.textContent = `${task.text}`;
      taskText.style.color = "white";
      li.appendChild(taskText);
      // Crée un autre élément <i> pour afficher l'icône "List" qui est à coté du titre de la tâche'
      const taskIconElement = document.createElement("i");
      taskIconElement.className = "fa-solid fa-list";
      taskIconElement.style.color = "#ffffff";
      // Crée un autre élément <p> pour afficher la date de création de la tâche
      const pElement = document.createElement("p");
      pElement.style.color = "white";
      const creationDate = task.creationDate;
      // Vérifie si la date est valide et formate la date en heures:minutes - jour/mois et cela met les chiffres en numérique (nombres)
      pElement.textContent =
        creationDate instanceof Date &&
        creationDate.toLocaleString('fr-FR',{
          day: 'numeric',
          month: 'numeric',
          hour: 'numeric',
          minute: 'numeric',});      
          "Date invalide";

      taskText.prepend(taskIconElement);
      li.appendChild(pElement);
      // Ajouts des boutons "Terminé (bouton vert)" et "Supprimer (bouton rouge)" dans la liste des tâches
      li.innerHTML +=
        '<span><button type="button" class="btn btn-success"><i class="fa-solid fa-check" style="color: #ffffff;"></i></button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-danger" style="color: #ffffff;"><i class="fa-solid fa-trash delete"></i></button></span>';
      li.className = `list-group-item d-flex justify-content-between`;
      if (task.completed) {
        li.style.background =
          "linear-gradient(to top, #0ba360 0%, #3cba92 100%)"; // Gradient vert pour les tâches terminées
        li.style.transition = "background 2s ease-in"; // Transition du background sur 2 secondes
      }
      // Ajoute un événement pour marquer la tâche comme terminée ou non
      li.addEventListener("click", function () {
        // "this" fait référence l'élément de la liste cliqué, permettant de modifier l'état de cette tâche.
        toggleTaskCompletion(index);
      }); // Ajoute un événement pour supprimer la tâche
      li.querySelector(".delete").addEventListener("click", function () {
        // "this" fait référence le bouton de suppression cliqué, permettant de supprimer la tâche.
        deleteTask(index);
      });
      // Ajoute la nouvelle tâche dans la liste des tâches
      taskList.appendChild(li);
    });

  // Ajoute des événements aux boutons pour filtrer les tâches
  document.getElementById("showAll").onclick = () => renderTasks("all");
  document.getElementById("showCompleted").onclick = () =>
    renderTasks("completed");
  document.getElementById("showNotCompleted").onclick = () =>
    renderTasks("notCompleted");
};

// Fonction pour sauvegarder les tâches dans le localStorage
const saveTasks = () => {
  localStorage.setItem(
    "tasks",
    tasks
      .map(
        (task) =>
          `${task.text}|${
            task.completed
          }|${task.creationDate.toISOString()}` // Transforme chaque tâche en un texte qui représente ses informations (toISOString -> cela convertit la date rJavaScript en une chaîne de caractères)
      )
      .join(",") // Réunit toutes les tâches sous forme d'un seul texte, en séparant chaque tâche par une virgule.
  );
};

// Lorsque la page est chargée, on récupère les tâches sauvegardées grâce à localStorage
window.addEventListener("load", () => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = savedTasks.split(",").map((taskString) => {
      // Récupère les tâches enregistrées
      const [text, completed, creationDateStr] =
        taskString.split("|");
      return {
        text,
        completed: completed === "true",
        creationDate: new Date(creationDateStr),
      };
    });
    renderTasks();
  }
});

// Fonction pour supprimer une tâche sélectionnée
const deleteTask = (index) => {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
};

// Fonction qui change l'état de la tâche entre terminée et non terminée.
const toggleTaskCompletion = (index) => {
  if (tasks[index]) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  } else {
    console.log("Cette tâche n'a pas été trouvée à l'index :", index);
  }
};

// Ajoute un événement au bouton pour ajouter une nouvelle tâche
addTaskButton.addEventListener("click", addTask);
