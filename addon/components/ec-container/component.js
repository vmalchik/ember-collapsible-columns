import Component from '@ember/component';
import { schedule } from '@ember/runloop';
import layout from './template';
import { A } from '@ember/array';

export default Component.extend({
  layout,
  classNames: ['ec-container'],
  columns: null,
  allowMultCollapse: true,
  allowLastColCollapse: false,

  init() {
    this._super(...arguments);
    this.columns = A();
  },

  /**
   * Check to determine if column to be collapsed is the last remaining open column.
   */
  allowCollapsingColumn() {
    const allowLastColCollapse = this.get('allowLastColCollapse');
    if (allowLastColCollapse) {
      return true;
    } else {
      const columnCount = this.get('columns.length');
      const collapsedCols = A(this.get('columns').filterBy('isCollapsed', true));
      const collapsedCount = collapsedCols.get('length');
      return ((columnCount - collapsedCount) > 1);
    }
  },

  calculateColumnsWidth() {
    let remainingSpace = 100;

    // 1) Applying width to collapsed columns
    A(this.get('columns').filterBy('isCollapsed', true)).forEach((col) => {
      remainingSpace -= col.get('collapsedWidth');
      col.set('realWidth', col.get('collapsedWidth'));
    });

    const normalColumns = A(this.get('columns').filterBy('isCollapsed', false));

    // 2) Applying width non-collapsed columns with width defined by user
    normalColumns.filterBy('useCustomWidth', true).forEach((col) => {
      const colWidth = col.get('width');
      remainingSpace -= colWidth;
      col.set('realWidth', colWidth);
    });

    // 3) Splitting remaining space to the rest of the columns
    A(normalColumns.filterBy('useCustomWidth', false)).forEach((col, index, array) => {
      col.set('realWidth', (remainingSpace / array.get('length')));
    });

  },

  actions: {
    columnToggle(column) {
      schedule('afterRender', () => {
        const isCollapsed = column.get('isCollapsed');
        if (isCollapsed) {
          column.set('isCollapsed', false);
        } else {
          const allowMultCollapse = this.get('allowMultCollapse');
          if (allowMultCollapse) {
            if (this.allowCollapsingColumn()) {
              column.set('isCollapsed', true);
            }
          } else {
            const col = this.get('columns').findBy('isCollapsed', true);
            if (col) {
              col.set('isCollapsed', false);
            }
            column.set('isCollapsed', true);
          }
        }
        this.calculateColumnsWidth();
      });
    },

    columnAdded(column) {
      schedule('afterRender', () => {
        this.get('columns').addObject(column);
        this.get('columns').forEach((col) => {
          col.set('isCollapsed', false);
        });
        this.calculateColumnsWidth();
      });
    },

    columnRemoved(column) {
      schedule('afterRender', () => {
        this.get('columns').removeObject(column);
        this.get('columns').forEach((col) => {
          col.set('isCollapsed', false);
        });
        this.calculateColumnsWidth();
      });
    }
  }

});
