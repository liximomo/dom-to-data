let uid = 0;

class Mapper {
  constructor(name, handler) {
    this._id = ++uid; 
    this._name = name;
    this._handler = handler;
  }

  getId() {
    return this._id;
  }

  getName() {
    return this._name;
  }

  handle(element, attr) {
    return this._handler(element, attr);
  }
}

export default Mapper;
