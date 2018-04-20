import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  tagName: 'span',
  classNames: 'ec-button',

  onRender: () => {},
  onClick: () => {},

  didInsertElement() {
    this.get('onRender')();
  },

  actions: {
    toggleSize() {
      this.get('onClick')();
    }
  }
});
