const core = require('@actions/core');
const { run } = require('../run');

jest.unmock('../run');

describe('run', () => {
  beforeEach(() => {
    global.github = {
      context: {
        eventName: 'pull_request',
        payload: {
          pull_request: {
            title: 'This is a pull request title',
          },
        },
      },
    };
    core.getInput.mockReturnValue('.+');
    core.setFailed = jest.fn();
  });

  it('should pass nicely if title match regexp', () => {
    run();
    expect(core.setFailed).not.toBeCalled();
  });

  it('should fail if eventName is not pull_request', () => {
    global.github.context.eventName = 'foo';
    run();
    expect(core.setFailed).toBeCalledWith('Invalid event: foo, it should be use on pull_request');
  });

  it('should fails on regexp matching', () => {
    core.getInput.mockReturnValue('\\d');
    run();
    expect(core.setFailed).toBeCalledWith('Pull Request title "This is a pull request title" failed to pass match regex - /\\d/');
  });
});
