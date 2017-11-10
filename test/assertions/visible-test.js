import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import FakeClient from '../stubs/fake-client';
import getFakePageElement from '../stubs/get-fake-page-element'
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import immediately from '../../src/chains/immediately';

const selectElement = sinon.stub();

const visible = proxyquire('../../src/assertions/visible', {
  '../util/select-element': {
      'default': selectElement
  }
}).default;

//Using real chai, because it would be too much effort to stub/mock everything
chai.use(sinonChai);

describe('visible', () => {
    let fakeClient;
    let fakeElement;

    beforeEach(() => {
        fakeClient = new FakeClient();
        fakeElement = new getFakePageElement();

        selectElement.withArgs(fakeClient, '.some-selector').returns(fakeElement);
        selectElement.withArgs(fakeClient, fakeElement).returns(fakeElement);

        chai.use((chai, utils) => visible(fakeClient, chai, utils));
        chai.use((chai, utils) => immediately(fakeClient, chai, utils));
    });

    afterEach(() => fakeElement.__resetStubs__());

    describe('When in synchronous mode', () => {
        describe('When not negated', () => {
            beforeEach(() => {
                fakeElement.isVisible.returns(true);

                expect('.some-selector').to.be.visible();
            });

            it('Should call `waitForVisible` without `reverse`', () => {
                expect(fakeElement.waitForVisible)
                    .to.have.been.calledWith(0, undefined);
            });

            describe('When the element is still not visible after the wait time', () => {
                let testError;

                beforeEach(() => {
                    testError = 'Element still not visible';

                    fakeElement.waitForVisible.throws(new Error(testError));
                });

                it('Should throw an exception', () => {
                    expect(() => expect('.some-selector').to.be.visible())
                        .to.throw(testError);
                });
            });
        });

        describe('When negated', () => {
            beforeEach(() => expect('.some-selector').to.not.be.visible());

            it('Should call `waitForVisible` with `reverse` true', () => {
                expect(fakeElement.waitForVisible)
                    .to.have.been.calledWith(0, true);
            });

            describe('When the element is still visible after the wait time', () => {
                let testError;

                beforeEach(() => {
                    testError = 'Element still visible';

                    fakeElement.waitForVisible.throws(new Error(testError));
                });

                it('Should throw an exception', () => {
                    expect(() => expect('.some-selector').to.not.be.visible())
                        .to.throw(testError);
                });
            });
        });

        describe('When the element is visible', () => {
            beforeEach(() => {
                fakeElement.isVisible.returns(true);
            });

            it('Should not throw an exception', () => {
                expect('.some-selector').to.be.visible();
            });

            describe('When given a default wait time' , () => {
                beforeEach(() => {
                  chai.use((chai, utils) => visible(fakeClient, chai, utils, {defaultWait: 100}));

                  expect('.some-selector').to.be.visible();
                });

                it('Should call `waitForVisible` with the specified wait time', () => {
                    expect(fakeElement.waitForVisible)
                        .to.have.been.calledWith(100);
                });
            });

            describe('When the call is chained with `immediately`', () => {
                beforeEach(() => {
                    expect('.some-selector').to.be.immediately().visible();
                });

                it('Should not wait for the element to be visible', () => {
                    expect(fakeElement.waitForVisible).to.not.have.been.called;
                });
            });

            describe('When the assertion is negated', () => {
                it('Should throw an exception', () => {
                    expect(() => expect('.some-selector').to.not.be.visible()).to.throw();
                });
            });
        });

        describe('When the element is not visible', () => {
            beforeEach(() => {
                fakeElement.isVisible.withArgs('.some-selector').returns(false);
            });

            it('Should throw an exception', () => {
                expect(() => expect('.some-selector').to.be.visible()).to.throw();
            });

            describe('When the assertion is negated', () => {
                it('Should not throw an exception', () => {
                    expect('.some-selector').to.not.be.visible();
                });
            });
        });

        describe('When multiple matching elements exist', () => {
            describe('When any one is visible', () => {
                beforeEach(() => {
                    fakeElement.isVisible.returns([true, false]);
                });

                it('Should not throw an exception', () => {
                    expect('.some-selector').to.be.visible();
                });

                describe('When the call is chained with `immediately`', () => {
                    beforeEach(() => {
                        expect('.some-selector').to.be.immediately().visible();
                    });

                    it('Should not wait for the element to be visible', () => {
                        expect(fakeElement.waitForVisible).to.not.have.been.called;
                    });
                });

                describe('When the assertion is negated', () => {
                    it('Should throw an exception', () => {
                        expect(() => expect('.some-selector').to.not.be.visible()).to.throw();
                    });
                });
            });

            describe('When none are visible', () => {
                beforeEach(() => {
                    fakeClient.isVisible.withArgs('.some-selector').returns([false, false]);
                });

                it('Should throw an exception', () => {
                    expect(() => expect('.some-selector').to.be.visible()).to.throw();
                });

                describe('When the assertion is negated', () => {
                    it('Should not throw an exception', () => {
                        expect('.some-selector').to.not.be.visible();
                    });
                });
            });
        });

        describe('When selector is an element', () => {
            beforeEach(() => {
                fakeElement.isVisible.returns(true);
            });

            it('Should not throw an exception', () => {
                expect(fakeElement).to.be.visible();
            });
        });

    });
});
