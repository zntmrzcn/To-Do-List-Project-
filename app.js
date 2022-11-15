
//index.html dosyamızdaki tüm elementleri seçiyoruz.
const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.getElementById("filter");
const clearButton = document.getElementById("clear-todos");

eventListeners();


//BU FONKSİYON TÜM EVENT LISTENERSLARIN ATAMASINI YAPACAK.
function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);//sayfamız açılır açılmaz çalışacak event.
    secondCardBody.addEventListener("click",deleteTodo);
}



//SAYFAMIZ AÇILIR AÇILMAZ STORAGE'DAKİ DEĞERLERİMİZİ ÇEKİP ARAYÜZDE GÖSTERECEK FONKSİYON.
function loadAllTodosToUI(){
   let todos =  getTodosFromStorage();

   todos.forEach(index => {
    addTodoToUI(index);
   });
}



//YENİ TODO EKLEME İŞLEMİ.
function addTodo(e){
    const newTodo = todoInput.value.trim();//trim girilen değerin başındaki ve sonundaki boşlukları silmeyi sağlar.

    //todoInput boş mu değil mi kontrolünün sağlanması.
    if(newTodo === ""){
        showAlert("danger","Lütfen Bir ToDo İsmi Giriniz!");
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","ToDo Başarıyla Eklendi.")
    }
    e.preventDefault();//Submit olayından sonra form tekrar yönlenmesin diye kullanılır.
}



//TODO SİLME İŞLEMİ 
function deleteTodo(e){
   if(e.target.className==="fa fa-remove"){
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("warning","ToDo Başarıyla Silindi.")
   }
}



//STORAGE'DAN TODO SİLME İŞLEMİ
function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1);// arrayden değeri silme.
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}



//YAPILAN İŞLEMLER DOĞRULTUSUNDA UYARI MESAJI OLUŞTURMA.
function showAlert(type,message){
    //Yeni elementi oluşturuyoruz.
    const alert = document.createElement("div");
    alert.className="alert alert-"+type;
    alert.textContent=message;
    firstCardBody.appendChild(alert);

    //setTimeout  : belirli bir süre sonra çalışmasını istediğimiz komutlar için kullanılır.
    setTimeout(function(){
        alert.remove();
    },4000);
    
}




//INPUT ELEMENTİNDEN ALINAN YENİ TODO DEĞERİNİ GÖRSEL ARAYÜZE DİNAMİK OLARAK EKLENMESİ İŞLEMİ.
function addTodoToUI(newTodo){

    //List item oluşturma
    const listItem = document.createElement("li");
    listItem.className= "list-group-item d-flex justify-content-between";
    
    //ListItem'ın içine child alarak TextNode eklenmesi
    listItem.appendChild(document.createTextNode(newTodo));

    //todoları silmek için link oluşturma
    const link = document.createElement("a");
    link.href="#";
    link.className= "delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>";

    //Oluşturduğumuz link elementimizi ListItem içerisine child olarak eklenmesi
    listItem.appendChild(link);

    //Bir bütün olarak oluşturduğumuz listItemımızı <ul> etiketi olan todoList içerisine child olarak ekliyoruz.
    todoList.appendChild(listItem);

    //todo ekleme işleminden sorna inputun içinin temizlenmesi işlemi.
    todoInput.value="";
}




//STORAGE'DAN DEĞER ÇEKME İŞLEMİ.
function getTodosFromStorage(){
    let todos;

    if(localStorage.getItem("todos")===null){
        todos=[];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    return todos;
}




//INPUT ELEMENTİNDEN ALINAN YENİ TODO DEĞERİNİN LOCAL STORAGE'A EKLENMESİ İŞLEMİ.
function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();

    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));

}