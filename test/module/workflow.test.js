/* global describe it */
const assert = require('chai').assert;
const sinon = require('sinon');

const Workflow = require('../../').Workflow;
const DefinitionBuilder = require('../../').DefinitionBuilder;
const Transition = require('../../').Transition;
const Marking = require('../../').Marking;
const SingleStateMarkingStore = require('../../src/module/marking-store').SingleStateMarkingStore;
const error = require('../../src/error');

const definitionBuilder = new DefinitionBuilder();
const definition = definitionBuilder
  .addPlaces(['draft', 'created', 'deleted'])
  .addTransition(new Transition('create', ['draft'], ['created']))
  .addTransition(new Transition('delete', ['created'], ['deleted']))
  .setMarking(new Marking(['created']))
  .build();

class Article {
  constructor() {
    this.state = null;
  }
}

describe('Workflow', () => {
  describe('Workflow constructor', () => {
    it('should be instance of Workflow', () => {
      const workflow = new Workflow({});
      assert.instanceOf(workflow, Workflow);
    });
  });

  describe('getMarking', () => {
    it('should return LogicError if the marking is not an instance of MarkingStore', () => {
      const markingStore = new SingleStateMarkingStore('state');
      sinon.stub(markingStore, 'getMarking');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      try {
        workflow.getMarking(new Article());
        assert.isTrue(false, 'should throw LogicError');
      } catch (err) {
        assert.instanceOf(err, error.LogicError);
      }
    });

    it('should return LogicError when the marking has a different place than from definition', () => {
      const markingStore = new SingleStateMarkingStore('state');
      sinon.stub(markingStore, 'getMarking').callsFake(() => new Marking(['archived']));
      const workflow = new Workflow(definition, markingStore, 'flow');
      try {
        workflow.getMarking(new Article());
        assert.isTrue(false, 'should throw LogicError');
      } catch (err) {
        assert.instanceOf(err, error.LogicError);
      }
    });

    it('should throw LogicError when the definition places are empty', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const localDefinition = Object.create(definition);
      localDefinition.places = [];
      const workflow = new Workflow(localDefinition, markingStore, 'flow');
      try {
        workflow.getMarking(new Article());
        assert.isTrue(false, 'should throw LogicError');
      } catch (err) {
        assert.instanceOf(err, error.LogicError);
      }
    });

    it('should throw LogicError when the definition initialPlace and marking are empty', () => {
      const markingStore = new SingleStateMarkingStore('state');
      sinon.stub(markingStore, 'getMarking').callsFake(() => new Marking([]));
      const localDefinition = Object.create(definition);
      localDefinition.initialPlace = null;
      const workflow = new Workflow(localDefinition, markingStore, 'flow');
      try {
        workflow.getMarking(new Article());
        assert.isTrue(false, 'should throw LogicError');
      } catch (err) {
        assert.instanceOf(err, error.LogicError);
      }
    });
  });

  describe('getEnabledTransitions', () => {
    it('should have empty enabled transitions for object with end state', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'deleted';

      assert.equal(0, workflow.getEnabledTransitions(article).length);
    });

    it('should have one enablet transitions', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'created';

      assert.equal(1, workflow.getEnabledTransitions(article).length);
    });

    it('should disable transition from event listner generic', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'created';

      assert.equal(1, workflow.getEnabledTransitions(article).length);

      workflow.on('workflow.guard', (event) => {
        event.blocked = true;
      });

      assert.equal(0, workflow.getEnabledTransitions(article).length);
    });

    it('should disable transition from event workflow transition name', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'created';

      assert.equal(1, workflow.getEnabledTransitions(article).length);

      workflow.on('workflow.simple-workflow.guard', (event) => {
        event.blocked = true;
      });

      assert.equal(0, workflow.getEnabledTransitions(article).length);
    });

    it('should disable transition from event listner transition name', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'created';

      assert.equal(1, workflow.getEnabledTransitions(article).length);

      workflow.on('workflow.simple-workflow.guard.delete', (event) => {
        event.blocked = true;
      });

      assert.equal(0, workflow.getEnabledTransitions(article).length);
    });
  });

  describe('can', () => {
    it('should can', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'draft';
      const newTransition = 'create';

      assert.isTrue(workflow.can(article, newTransition));
    });

    it('should can not', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'draft';
      const newTransition = 'delete';

      assert.isFalse(workflow.can(article, newTransition));
    });
  });

  describe('apply', () => {
    it('should throw exception', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      article.state = 'draft';
      const newTransition = 'delete';

      try {
        workflow.apply(article, newTransition);
        assert.isTrue(false, 'should throw LogicError');
      } catch (err) {
        assert.instanceOf(err, error.LogicError);
      }
    });

    it('should apply dispatch leave', (done) => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      const newTransition = 'create';
      article.state = 'draft';

      workflow.on('workflow.leave', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.leave', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.leave.draft', () => {
        assert.isTrue(true);
        done();
      });
      workflow.apply(article, newTransition);
    });

    it('should apply dispatch transition', (done) => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      const newTransition = 'create';
      article.state = 'draft';

      workflow.on('workflow.transition', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.transition', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.transition.create', () => {
        assert.isTrue(true);
        done();
      });
      workflow.apply(article, newTransition);
    });

    it('should apply dispatch enter', (done) => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      const newTransition = 'create';
      article.state = 'draft';

      workflow.on('workflow.enter', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.enter', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.enter.created', () => {
        assert.isTrue(true);
        done();
      });
      workflow.apply(article, newTransition);
    });

    it('should apply dispatch entered', (done) => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      const newTransition = 'create';
      article.state = 'draft';

      workflow.on('workflow.entered', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.entered', () => {
        assert.isTrue(true);
      });
      workflow.on('workflow.simple-workflow.entered.created', () => {
        assert.isTrue(true);
        done();
      });
      workflow.apply(article, newTransition);
    });

    it('should apply dispatch anounce', (done) => {
      const markingStore = new SingleStateMarkingStore('state');
      const workflow = new Workflow(definition, markingStore, 'simple-workflow');
      const article = new Article();
      const newTransition = 'create';
      article.state = 'draft';

      workflow.on('workflow.simple-workflow.announce.delete', () => {
        assert.isTrue(true);
        done();
      });
      workflow.apply(article, newTransition);
    });
  });
});
