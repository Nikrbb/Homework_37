(() => {
    'use strict'

    const form = {
        formId: null,
        cardId: 0,
        dataItems: [],
        DB_NAME: 'saved_data',

        init(selector) {
            const formNode = document.querySelector(selector);
            const deleteButton = document.querySelector('#remove')
            if (formNode) {
                this.formId = formNode;
            } else throw new Error(`form.init error`)

            
            this.addListener(formNode, 'submit', this.submitListener);
            this.addListener(window, 'load', this.loadListener);
            this.addListener(deleteButton, 'click', this.clearAllListener)
        },

        addListener(node, event, listener) {
            node.addEventListener(event, listener.bind(this))
        },

        submitListener(event) {
            event.preventDefault();

            const inputs = event.target.querySelectorAll('input, textarea, checkbox');
            const obj = {};
            obj.completed = false;
            
            for(const input of inputs) {
                if(!input.value.length) return alert('No way you can add this shit');
                obj[input.name] = input.value;
            };

            this.saveData(obj);
            event.target.reset();
        },

        loadListener() {
            if(!localStorage[this.DB_NAME]) return;
            else {
                const data = JSON.parse(localStorage[this.DB_NAME]);
                data.forEach((item, index) => item.id = index)

                localStorage.setItem(this.DB_NAME, JSON.stringify(data))

                this.dataItems = data;
                this.cardId = this.dataItems.length
                
                this.dataItems.forEach(item => {
                this.renderItem(item);
                });
            }
        },

        onchangeListener(event) {           
            const isCompleted = event.target.checked;
            const completedText = event.target.previousElementSibling;
            const currentCardId = event.target.closest(`.taskWrapper`).getAttribute(`card_id`);

            this.changeData(currentCardId, isCompleted)
            
            if (isCompleted) {
                event.target.closest(`.taskWrapper`).classList.add(`selected`);
                completedText.innerText = `completed: true`;
            }
            else {
                completedText.innerText = `completed: false`;
                event.target.closest(`.taskWrapper`).classList.remove(`selected`);
            }
        },

        clearAllListener() {
            let isClear = confirm(`Sure?`);
            if (isClear) {
                const itemsToDelete = document.querySelectorAll(`.col-8 .row .col-4`)
                itemsToDelete.forEach(e => e.style.display = 'none')
                this.dataItems = [];
                localStorage.removeItem(this.DB_NAME)
            }
        },

        deleteListener(event) {
            const itemToDelete = event.target.closest(`.col-4`);
            const currentCardId = event.target.closest(`.taskWrapper`).getAttribute(`card_id`);

            itemToDelete.style.display = 'none';

            this.dataItems = this.dataItems.filter(e => e.id !== Number(currentCardId));
            localStorage.setItem(this.DB_NAME, JSON.stringify(this.dataItems));
            
            if (!JSON.parse(localStorage[this.DB_NAME]).length) localStorage.removeItem(this.DB_NAME)
        },

        changeData(elemId, checkbox) {
            this.dataItems.find(e => e.id === Number(elemId)).completed = checkbox
            localStorage.setItem(this.DB_NAME, JSON.stringify(this.dataItems));
        },

        saveData(todoItem) {

            todoItem.id = this.cardId;
            this.cardId++;

            this.dataItems.push(todoItem)
            localStorage.setItem(this.DB_NAME, JSON.stringify(this.dataItems));

            this.renderItem(todoItem);
        },

        renderItem(item) {
            const template = this.createTemplate(item.title, item.description, item.completed, item.id);
            document.querySelector('#todoItems').append(template);
        },

        createTemplate(titleText = '', descriptionText = '', completed, id) {
            const mainWrp = document.createElement('div');
            mainWrp.className = 'col-4';
        
            const wrp = document.createElement('div');
            wrp.className = 'taskWrapper';
            if (completed) wrp.classList.add(`selected`)
            wrp.setAttribute(`card_id`, id)
            mainWrp.append(wrp);
        
            const title = document.createElement('div');
            title.innerHTML = titleText;
            title.className = 'taskHeading';
            wrp.append(title);
        
            const description = document.createElement('div');
            description.innerHTML = descriptionText;
            description.className = 'taskDescription'
            wrp.append(description);
        
            const completedElem = document.createElement('span');
            completedElem.className = 'completed';
            if (!completed) completedElem.innerHTML = `completed: false`
            else completedElem.innerHTML = `completed: true`
            description.append(completedElem);
        
            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            if (completed) checkbox.checked = true;
            checkbox.className = 'checkbox';
            description.append(checkbox);
            this.addListener(checkbox, 'change', this.onchangeListener);
        
            const deleteItem = document.createElement('div');
            deleteItem.className = 'deleteItem';
            description.append(deleteItem);
            this.addListener(deleteItem, 'click', this.deleteListener)
            
            return mainWrp;
        }
    }

    form.init(`#todoForm`)

})()