'use strict';

const controllerInstance = controller(model, view);
view.init(controllerInstance);
model.init(controllerInstance);