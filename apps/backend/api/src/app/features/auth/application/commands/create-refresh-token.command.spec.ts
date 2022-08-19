import { CreateRefreshTokenCommand } from './create-refresh-token.command';

describe('CreateRefreshTokenCommand', () => {
  it('constructor()', () => {
    const userId = 'user id';
    const refreshToken = 'refresh token'

    const command = new CreateRefreshTokenCommand(userId, refreshToken);

    expect(command.userId).toEqual(userId);
    expect(command.refreshToken).toEqual(refreshToken);
  });
});
