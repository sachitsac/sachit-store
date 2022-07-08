import { helloWorld } from './../src/index';
describe('Index entrypoint', () => {
  it('Test', () => {
    expect(helloWorld).toEqual('Hello World');
  });
});
