import sinon from 'sinon';

const pageElementFunctions = [
  'waitForExists',
  'waitForVisible',
  'isExisting',
  'isVisible'
];

const resetFunctions = function () {
  pageElementFunctions.forEach(funcName => {
    this[funcName].reset()
  });
}

export default function getFakePageElement() {
    const fakePageElement = {
        type: 'Never gonna run around and desert you',
        message: 'Never gonna make you cry',
        state: 'Never gonna say goodbye',
        sessionId: 'Never gonna tell a lie and hurt you',
        value: 'We\'ve known each other for so long',
        selector: 'Your heart\'s been aching, but you\'re too shy to say it',
        someOtherKey: 'Inside, we both know what\'s been going on',
        yetAnotherKey: 'We know the game and we\'re gonna play it',
        __resetStubs__: resetFunctions
    };

    pageElementFunctions.forEach(funcName => {
      fakePageElement[funcName] = sinon.stub();
    })

    return fakePageElement;
}
