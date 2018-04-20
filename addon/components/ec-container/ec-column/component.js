import Component from '@ember/component';
import layout from './template';
import { notEmpty, not } from '@ember/object/computed';
import { computed } from '@ember/object';
import { schedule } from '@ember/runloop';

export default Component.extend({
  layout,
  classNames: ['ec-column'],
  classNameBindings: [ 'style' ],

  style: computed('isCollapsed', function() {
    return this.get('isCollapsed') ? 'collapsed' : 'normal'
  }),

  isCollapsed: false,
  useCustomButton: false,
  useInternalButton: not('useCustomButton'),
  useCustomWidth: notEmpty('width'),

  onToggle: () => {},
  onColumnAdded: () => {},
  onColumnRemoved: () => {},

  // Fixed with defined by consumer
  width: null,
  // real width in % calculated by container
  _width: null,

  realWidth: computed('_width', {
    get() {
      return this.get('_width');
    },
    set(key, value) {
      this.set('_width', value);
      if (this.$()) {
        this.$().css('width', `${value}%`);
      }
      return value;
    }
  }),

  didInsertElement() {
    this._super(...arguments);
    this.get('onColumnAdded')(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('onColumnRemoved')(this);
  },

  actions: {
    toggleColumnVisibility() {
      this.get('onToggle')(this);
    },
    registerButton() {
      schedule('afterRender', () => {
        this.set('useCustomButton', true);
      });
    }
  }

});
