import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  classNames: 'erc-button',

  actions: {
    onClick() {
      this.get('action')();
    }
  }
});
