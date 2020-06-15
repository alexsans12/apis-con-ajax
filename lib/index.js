// Controla el DOM
import { Todo } from '/lib/Todo.js';

window.addEventListener( 'load', (ev) => {
     let container = document.querySelector('#root ul');

     document.querySelector('#main-form').addEventListener("submit", (ev) => {
          ev.preventDefault();
          const form = ev.target;
          const textArea = form.querySelector("textarea");

          const button = form.querySelector('[type="submit"]'); 
          button.disabled = true;

          let todo = new Todo({ title:  textArea.value });

          todo.save().then(() => {
               textArea.value = "";
               button.disabled = false;
               
               let li = buildDOMElements(todo);
               container.prepend(li);
          });

          return false;
     });

     // Todo.all => retorna los todos del servicio web 
     Todo.all().then(todos => {
          // Iteramos todos los todos
          todos.forEach( todo => {
               // Construimos un node con builDOMElement
               let node = buildDOMElements(todo);

               // Insertamos el node en el contenedor
               container.prepend(node);
          });
     });

     let buildDOMElements = (todo) => {
          let li = document.createElement('li');
          li.className = "list-group-item";
          li.innerHTML = `
               <div class="input-group d-flex justify-content-between" >
                    <h2>${todo.title}</h2>
                    <button class="close">X</button>
               </div>
          `;

          li.querySelector(".close").addEventListener("click", (ev) => {
               todo.destroy();
               li.remove();
          });

          editInPlace(li.querySelector('h2'), todo);
          return li;
     }

     let editInPlace = (node, todo) => {
          node.addEventListener("click", (ev) => {
               // Reemplazar el nodo por un campo de texto
               let inputText = document.createElement('textarea');
               inputText.className = "form-control"
               inputText.value = node.innerHTML;
               inputText.autofocus = true;

               node.replaceWith(inputText); 

               inputText.addEventListener('change', (ev) => {
                    inputText.replaceWith(node);
                    todo.title = inputText.value;

                    node.innerHTML = todo.title; 

                    todo.save().then(r => console.log(r));
               });

               // Finalizar edición: Reemplazar el campo de texto por un nodo de vuelta
          });
     }
});




