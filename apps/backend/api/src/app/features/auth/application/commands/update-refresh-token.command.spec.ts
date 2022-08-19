import { UpdateRefreshTokenCommand } from './update-refresh-token.command';

describe('UpdateRefreshTokenCommand', () => {
  it('constructor()', () => {
    const oldToken = 'old refresh token';
    const newToken = 'new refresh token';

    const command = new UpdateRefreshTokenCommand(oldToken, newToken);

    expect(command.oldRefreshToken).toEqual(oldToken);
    expect(command.newRefreshToken).toEqual(newToken);
  });
});
