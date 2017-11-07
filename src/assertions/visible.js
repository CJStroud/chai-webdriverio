import configWithDefaults from '../util/default-config';
import selectElement from '../util/select-element';

export default function visible(client, chai, utils, options) {
    const config = configWithDefaults(options);

    chai.Assertion.addMethod('visible', function() {
        const negate = utils.flag(this, 'negate');
        const selector =  utils.flag(this, 'object');
        const immediately = utils.flag(this, 'immediately');

        if (!immediately) {
            selectElement(client, selector).waitForVisible(config.defaultWait, negate);
        }

        const isVisible = selectElement(client, selector).isVisible();
        const visibleArray = (Array.isArray(isVisible)) ? isVisible : [isVisible];
        const anyVisible = visibleArray.includes(true);

        this.assert(
            anyVisible,
            `Expected ${selector} to be visible but it is not`,
            `Expected ${selector} to not be visible but it is`
        );
    });
}
