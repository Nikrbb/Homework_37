'use strict'

const view = {
    controller: null,
    formId: null,
    removeButton: null,

    init(controllerInstance) {
        this.controller = controllerInstance;
        this.setForm()
    },

    setForm() {
        const formNode = document.querySelector(`#todoForm`);
        this.removeButton = document.querySelector('#remove')
        if (formNode) {
            this.formId = formNode;
        } else throw new Error(`form.init error`)
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
        this.controller.addListener(checkbox, 'change', this.controller.onchangeListener);
    
        const deleteItem = document.createElement('div');
        deleteItem.className = 'deleteItem';
        description.append(deleteItem);
        this.controller.addListener(deleteItem, 'click', this.controller.deleteItemListener)
        
        return mainWrp;
    },

    changeCompleted(event, completedText, isCompleted) {
        if (isCompleted) {
            event.target.closest(`.taskWrapper`).classList.add(`selected`);
            completedText.innerText = `completed: true`;
        }
        else {
            completedText.innerText = `completed: false`;
            event.target.closest(`.taskWrapper`).classList.remove(`selected`);
        }
    },

    deleteItem(event) {
        const itemToDelete = event.target.closest(`.col-4`);
        itemToDelete.remove();
    },

    removeAllItems() {
        const itemsToDelete = document.querySelectorAll(`.col-8 .row .col-4`)
        itemsToDelete.forEach(e => e.style.display = 'none') // fix it
    }
    
}