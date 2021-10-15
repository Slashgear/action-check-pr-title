const core = require('@actions/core');
const { run } = require('../run');

jest.unmock('../run');
jest.mock('@actions/github', () => ({
  context: {
    eventName: 'pull_request',
    payload: {
      pull_request: {
        title: 'This is a pull request title',
      },
    },
  },
}));

describe('run', () => {
  beforeEach(() => {
    core.getInput.mockReturnValue('.+');
    core.setFailed = jest.fn();
  });

  it('should pass nicely if title match regexp', () => {
    run();
    expect(core.setFailed).not.toBeCalled();
  });

  it('should fails on regexp matching', () => {
    core.getInput.mockReturnValue('\\d');
    run();
    expect(core.setFailed).toBeCalledWith('Pull Request title "This is a pull request title" failed to pass match regex - /\\d/');
  });
});
