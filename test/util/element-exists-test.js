import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import FakeClient from '../stubs/fake-client';
import getFakePageElement from '../stubs/get-fake-page-element';

const selectElement = sinon.stub();

const elementExists = proxyquire('../../src/util/element-exists', {
  '../util/select-element': {
      'default': selectElement
  }
}).default;

const fakeClient = new FakeClient();
const fakeElement = getFakePageElement();

chai.use(sinonChai);

describe('elementExists', () => {
    beforeEach(() => {
        fakeClient.__resetStubs__();
        fakeClient.element.returns(fakeElement);

        fakeElement.__resetStubs__();

        selectElement.withArgs(fakeClient, 'bla').returns(fakeElement);
    });

    describe('When in synchronous mode', () => {
        it('Should throw element doesn\'t exist error', () => {
            fakeElement.waitForExist.throws();
            expect(() => elementExists(fakeClient, 'bla', 0)).to.throw(/Could not find element with selector/);
        });
        describe('When the element exist', () => {
            it('Should NOT throw an error', () => {
                fakeElement.waitForExist.returns();
                expect(() => elementExists(fakeClient, 'bla', 0)).to.not.throw();
            });
        });

    });
});
