
// index.html dosyamızdaki tüm elementleri seçiyoruz.
const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.getElementById("filter");
const clearButton = document.getElementById("clear-todos");

eventListeners();




// BU FONKSİYON TÜM EVENT LISTENERSLARIN ATAMASINI YAPACAK.
function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);//sayfamız açılır açılmaz çalışacak event.
    secondCardBody.addEventListener("click",links);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}




// SAYFAMIZ AÇILIR AÇILMAZ STORAGE'DAKİ TODOLARI ve TODOLARIN CHECKED DURUMLARINI ÇEKİP ARAYÜZDE GÖSTERECEK FONKSİYON.
function loadAllTodosToUI(){
   let todos =  getTodosFromStorage();
   let checkedTodos = getCheckedTodosFromStorage();

    todos.forEach(function(Todo,i){
        addTodoToUI(Todo,checkedTodos[i]);
    });
  
}




// YENİ TODO VE DEFAULT CHECKED ÖZELLİĞİNİ EKLEME İŞLEMİ.
function addTodo(e){
    let todos = getTodosFromStorage();

    const newTodo = todoInput.value.trim();//trim girilen değerin başındaki ve sonundaki boşlukları silmeyi sağlar.

    //todoInput boş mu değil mi ve hali hazırda kayıtlı mı kontrolünün yapılması
    if(newTodo !=="" && todos.includes(newTodo) == false){
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        
        //default checked property
        addTodosCheckedValueToStorage("unChecked");

        showAlert("success","To Do Added Successfully");
    }
    //todoInput boş mu kontrolünün yapılması
    else if(newTodo === ""){
        showAlert("warning","Please Enter To Do");
    }
    //Aynı isimde todo varsa
    else {
        showAlert("warning","There is allready a To Do with the same name");
    }
    e.preventDefault();//Submit olayından sonra form tekrar yönlenmesin diye kullanılır.
}




// TODO SİLME VE YAPILAN TODOLARIN ÜZERİNİ ÇİZME 
function links(e){
    let todos = getTodosFromStorage();

   if(e.target.className==="fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("warning","To Do Removed Successfully.")
   }

   if(e.target.className==="checkItem"){
        //check edilen todo içeriğinin localdeki index numarasını bulup yine locale farklı bir key ile yüklüyoruz
        let checkedTodoIndex = todos.indexOf(e.target.nextSibling.textContent);
       
        //CheckBox check olduğunda.
        if(e.target.checked === true){
            e.target.parentElement.setAttribute("style","text-decoration: line-through; opacity:60%;");
            updateCheckedTodosValue("Checked",checkedTodoIndex);
        }
        else{
            e.target.parentElement.setAttribute("style"," ");
            updateCheckedTodosValue("unChecked",checkedTodoIndex);
        }
   }
}




// TÜM TODOLARI SİLME İŞLEMİ 
function clearAllTodos(){
    
    if(confirm("Do you want to remove all todoes?")){
        //Tüm todoları arayüzden kaldıracağız.
        const listItems = document.querySelectorAll(".list-group-item");
        listItems.forEach(function(listItem){
            listItem.remove();
        })
        //Tüm todoları storage dan silme
        localStorage.clear();
        showAlert("warning","All To Does Removed Successfully.");
    }
}




// STORAGE'DAN TODO VE TODOLARIN CHECKED DEĞERLERİNİ SİLME İŞLEMİ
function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();
    let checkedTodos = getCheckedTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1);// arrayden değeri silme.
            checkedTodos.splice(index,1); //
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
    localStorage.setItem("checkedTodos",JSON.stringify(checkedTodos));
}




// FILTER INPUTUN'DAN GELEN DEĞER İLE TO DO FİLTRELEME 
function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        let textNode = listItem.children[0];
        let checkBox = listItem.children[0].children[0];

        // filterValue'yu arıyor 
        if(text.indexOf(filterValue)===-1){ //bulamadı
            listItem.setAttribute("style","display: none !important");
            
        }
        else{// filterValue'yu buldu   

            //Eğer checked edili haldeyse filtreleme işleminden sonra da checked edili halde gelmesi için.   
            if(checkBox.checked == true){
                textNode.setAttribute("style", "text-decoration: line-through; opacity:60%; ");
            }
            
            listItem.setAttribute("style","display: block;");
        }
    })
}




// YAPILAN İŞLEMLER DOĞRULTUSUNDA UYARI/BİLGİLENDİRME MESAJI OLUŞTURMA.
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




// INPUT ELEMENTİNDEN ALINAN YENİ TODO VE TODO CHECKED DEĞERİNİN GÖRSEL ARAYÜZE DİNAMİK OLARAK EKLENMESİ İŞLEMİ.
function addTodoToUI(newTodo,newTodoCheckedValue){
    
    //List item oluşturma
    const listItem = document.createElement("li");
    listItem.className= "list-group-item d-flex justify-content-between";

    //check box ve todo içeriğini içeren sol taraf
    const leftSide = document.createElement("span");

    //Yapılan todoları check etme için checkBox oluşturma
    const checkLink = document.createElement("input");
    checkLink.className = "checkItem";
    checkLink.type = "checkbox";
    checkLink.checked = false;
    
    if (newTodoCheckedValue === "Checked"){
            checkLink.checked = true;
            leftSide.setAttribute("style", "text-decoration: line-through; opacity:60%; ");
        }    

    //todoları silmek için link oluşturma 
    const deleteLink = document.createElement("a");
    deleteLink.href="#";
    deleteLink.className= "delete-item";
    deleteLink.innerHTML="<i class = 'fa fa-remove'></i>";


    //checkbox'ı spanın içine gönderiyoruz.
    leftSide.appendChild(checkLink);
    //spanın içerisinde text node oluşturuyoruz.
    leftSide.appendChild(document.createTextNode(newTodo));
    //list item span'ı içine alıyor.
    listItem.appendChild(leftSide);
    //list item delete linkinin içine alıyor.
    listItem.appendChild(deleteLink);

    //Bir bütün olarak oluşturduğumuz listItemımızı <ul> etiketi olan todoList içerisine child olarak ekliyoruz.
    todoList.appendChild(listItem);

    //todo ekleme işleminden sorna inputun içinin temizlenmesi işlemi.
    todoInput.value="";
}




// STORAGE'DAN TODO ÇEKME İŞLEMİ.
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


// STORAGE'DAN CheckedTodos ÇEKME İŞLEMİ
function getCheckedTodosFromStorage(){
    let checkedTodos ;

    if(localStorage.getItem("checkedTodos")===null){
        checkedTodos=[];
    }
    else{
        checkedTodos = JSON.parse(localStorage.getItem("checkedTodos"));
    }

    return checkedTodos;
}




// INPUT ELEMENTİNDEN ALINAN YENİ TODO DEĞERİNİN LOCAL STORAGE'A EKLENMESİ İŞLEMİ.
function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
   
    todos.push(newTodo);
        localStorage.setItem("todos",JSON.stringify(todos));      
}


// TODO'YA AİT CHECKED DEĞERİNİN LOCAL STORAGE'A EKLENMESİ.
function addTodosCheckedValueToStorage(Value){
    let checkedTodos = getCheckedTodosFromStorage();
   
    checkedTodos.push(Value);
        localStorage.setItem("checkedTodos",JSON.stringify(checkedTodos));
}


// CHECKED EDİLEN TODO'NUN DEFAULT OLAN unChecked DEĞERİNİN checked OLARAK GÜNCELLENMESİ.
function updateCheckedTodosValue(newValue,index){
    let checkedTodos = getCheckedTodosFromStorage();

    checkedTodos[index] = newValue;

    localStorage.setItem("checkedTodos",JSON.stringify(checkedTodos));
}