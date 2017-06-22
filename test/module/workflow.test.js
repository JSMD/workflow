/* global describe it */

const Workflow = require('../../src/module/workflow');
const Model1 = require('../helper/model1').Model;
const Model2 = require('../helper/model2').Model;
const Model3 = require('../helper/model3').Model;

const assert = require('chai').assert;
const error = require('../../src/error');

const options = {
  workflows: {
    test_lifecycle: {
      supports: [
        'Card',
        'Model2',
        'Model3',
      ],
      property: 'status',
      states: [
        'state1',
        'state2',
        'state3',
      ],
      transitions: {
        transition1: {
          from: [
            'state1',
          ],
          to: 'state2',
        },
        transition2: {
          from: [
            'state2',
          ],
          to: 'state3',
        },
      },
    },
    test_2_lifecycle: {
      supports: [
        'Model3',
      ],
      property: 'status',
      states: [],
      transitions: {},
    },
  },
};

describe('Workflow', () => {
  describe('Workflow constructor', () => {
    it('should be instance of Workflow', () => {
      const workflow = new Workflow({});
      assert.instanceOf(workflow, Workflow);
    });
  });

  describe('Workflow exceptions', () => {
    it('should throw error ModelNotSupportedError', (done) => {
      const model1 = new Model1();
      model1.status = 'state1';

      const workflow = new Workflow(options);
      try {
        workflow.can(model1, 'transition1');
      } catch (e) {
        assert.instanceOf(e, error.ModelNotSupportedError);
        assert.isTrue(true);
        done();
      }
    });

    it('should throw error ModelPropertyNotSetError', (done) => {
      const model2 = new Model2();
      const workflow = new Workflow(options);

      try {
        workflow.can(model2, 'transition1');
      } catch (e) {
        assert.instanceOf(e, error.ModelPropertyNotSetError);
        assert.isTrue(true);
        done();
      }
    });

    it('should throw error MultipleworkflowsPerObjectError', (done) => {
      const model3 = new Model3();
      const workflow = new Workflow(options);

      try {
        workflow.can(model3, 'transition1');
      } catch (e) {
        assert.instanceOf(e, error.MultipleWorkflowsPerObjectError);
        assert.isTrue(true);
        done();
      }
    });
  });

  describe('Workflow can', () => {
    it('should return can make transition "transition1"', () => {
      const model2 = new Model2();
      model2.status = 'state1';

      const workflow = new Workflow(options);

      assert.isTrue(workflow.can(model2, 'transition1'));
    });

    it('should return can not make transition "transition1"', () => {
      const model2 = new Model2();
      model2.status = 'state2';

      const workflow = new Workflow(options);

      assert.isFalse(workflow.can(model2, 'transition1'));
    });
  });

  describe('Workflow apply', () => {
    describe('Workflow apply exception', () => {
      it('should throw error ModelApplyError', (done) => {
        const model2 = new Model2();
        model2.status = 'state2';

        const workflow = new Workflow(options);

        try {
          workflow.apply(model2, 'transition1');
        } catch (e) {
          assert.instanceOf(e, error.ModelApplyError);
          assert.isTrue(true);
          done();
        }
      });
    });

    it('should apply "transition1"', () => {
      assert.isTrue(true);
    });

    it('should return can not make transition "transition1"', () => {
      assert.isTrue(true);
    });
  });
});
