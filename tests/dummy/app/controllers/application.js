import Controller from '@ember/controller';
import { A } from '@ember/array';

export default Controller.extend({
  items: A(),
  actions: {
    add() {
      this.get('items').pushObject('foo');
    },
    remove() {
      this.get('items').popObject();
    }
  }
});