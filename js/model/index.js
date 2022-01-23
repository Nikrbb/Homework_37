'use strict';


const model = {
    controller: null,
    cardId: 0,
    dataItems: [],
    DB_NAME: 'saved_data',

    init(controllerInstance) {
        this.controller = controllerInstance;
        this.controller.setEvents()
    }, 

    loadData() {
        const data = JSON.parse(localStorage[this.DB_NAME]);
        data.forEach((item, index) => item.id = index)

        localStorage.setItem(this.DB_NAME, JSON.stringify(data))

        this.dataItems = data;
        this.cardId = this.dataItems.length
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
    },
    
    removeAllData() {
        this.dataItems = [];
        localStorage.removeItem(this.DB_NAME)
    }, 

    deleteItem(event) {
        const currentCardId = event.target.closest(`.taskWrapper`).getAttribute(`card_id`);
        this.dataItems = this.dataItems.filter(e => e.id !== Number(currentCardId));
        localStorage.setItem(this.DB_NAME, JSON.stringify(this.dataItems));
            
        if (!JSON.parse(localStorage[this.DB_NAME]).length) localStorage.removeItem(this.DB_NAME)
    }

}