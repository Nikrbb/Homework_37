'use strict';


function controller (model, view) {
    return {

        
        setEvents() {
            this.addListener(view.formId, 'submit', this.submitListener);
            this.addListener(window, 'load', this.loadListener);
            this.addListener(view.removeButton, 'click', this.clearAllListener)
        },

        addListener(node, event, listener) {
            node.addEventListener(event, listener.bind(this))
        },

        submitListener(event) {
            event.preventDefault();

            const inputs = event.target.querySelectorAll('input, textarea');
            const obj = {};
            obj.completed = false;
            
            for(const input of inputs) {
                if(!input.value.length) return alert('No way you can add this shit');
                obj[input.name] = input.value;
            };

            model.saveData(obj);
            view.renderItem(obj);
            event.target.reset();
           
        },

        loadListener() {
            if(!localStorage[model.DB_NAME]) return;
            model.loadData()
            model.dataItems.forEach(item => {
            view.renderItem(item);
            });
        },

        onchangeListener(event) {           
            const isCompleted = event.target.checked;
            const completedText = event.target.previousElementSibling;
            const currentCardId = event.target.closest(`.taskWrapper`).getAttribute(`card_id`);

            model.changeData(currentCardId, isCompleted)
            view.changeCompleted(event, completedText, isCompleted)
        },

        clearAllListener() {
            let isClear = confirm(`Sure?`);
            if (isClear) {
                view.removeAllItems()
                model.removeAllData()
            }
        },

        deleteItemListener(event) {
            view.deleteItem(event);
            model.deleteItem(event);
        },
    }
}