import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  mock,
  spyOn,
  test,
} from "bun:test";

import { add, notion, verify, hashnode } from './endpoints.js'; // Replace 'yourFileName' with the actual file name
import { selectByUuid, insertIntoDb } from "./services/database.js";
import { getAccessToken } from "./services/notion.js";

// Mocking the necessary dependencies
const mockRequest: any = {
  url: 'http://example.com',
  searchParams: {
    has: jest.fn(),
    get: jest.fn(),
  },
};

const mockDatabase: any = {
};

const mockAccessToken = 'mocked-access-token';
const mockTokenResponse = {
  access_token: mockAccessToken,
};

describe('add function', () => {
  test('should return a redirect response with a valid authorization URL', () => {
    const response = add();
    expect(response).toEqual(expect.objectContaining({ status: 302 }));
    expect(response.headers.get('Location')).toContain('state=');
  });
});

describe('notion function', () => {
  beforeEach(() => {
    mock.module(require.resolve('./services/notion.ts'), () => ({
      getAccessToken: jest.fn().mockResolvedValue(mockTokenResponse),
    }));
    mock.module(require.resolve('./services/database.ts'), () => ({
      insertIntoDb: jest.fn(),
      selectByUuid: jest.fn().mockReturnValue({
        uuid: 'mocked-uuid',
      }),
    }));

    mock.module('bun:sqlite', () => jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.skip('should handle the OAuth response and save data to the database on success', async () => {
    // Arrange
    // mockRequest.searchParams.has.mockReturnValue(true);
    mockRequest.searchParams.get.mockReturnValue('mock-code');
    mockRequest.searchParams.get.mockReturnValue('mock-uuid');

    // Act
    const response = await notion(mockRequest, mockDatabase);

    // Assert
    expect(response).toEqual(expect.objectContaining({ status: 302 }));
  });

  test.skip('should handle errors when exchanging authorization code for access token', async () => {
    const req = { url: 'mockOAuthUrl' };
    const hashionDb = jest.fn();
    spyOn(global, 'Response').mockImplementationOnce(() => ({}));

    // Mocking URL object
    const mockUrl = {
      searchParams: {
        has: jest.fn(),
      },
    };
    global.URL = jest.fn(() => mockUrl);

    mockUrl.searchParams.has.mockReturnValueOnce(true);

    // Mocking selectByUuid function
    selectByUuid.mockReturnValueOnce(null);

    // Mocking console.error
    const mockConsoleError = spyOn(console, 'error').mockImplementation(() => {});

    // Execute the notion function
    const response = await notion(req, hashionDb);

    // Assertions
    expect(mockConsoleError).toHaveBeenCalledWith('Could not exchange authorization code for access token.', expect.any(String));
    expect(response).toEqual(expect.objectContaining({ status: 500 }));
  });

  test.skip('should handle the case when there is no authorization code in the OAuth response', async () => {
    const req = { url: 'mockOAuthUrl' };
    const hashionDb = jest.fn();
    spyOn(global, 'Response').mockImplementationOnce(() => ({}));

    // Mocking URL object
    const mockUrl = {
      searchParams: {
        has: jest.fn(),
      },
    };
    global.URL = jest.fn(() => mockUrl);

    mockUrl.searchParams.has.mockReturnValueOnce(false);

    // Execute the notion function
    const response = await notion(req, hashionDb);

    // Assertions
    expect(response).toEqual(expect.objectContaining({ status: 400 }));
  });
});

// Tests for the 'verify' function
describe('verify function', () => {
  test.skip('should return a response with status 200 when UUID is found in the database', () => {
    const req = { url: 'mockUrl' };
    const hashionDb = jest.fn();
    spyOn(global, 'Response').mockImplementationOnce(() => ({}));

    // Mocking URL object
    const mockUrl = {
      searchParams: {
        get: jest.fn().mockReturnValueOnce('mockUuid'),
      },
    };
    global.URL = jest.fn(() => mockUrl);

    // Mocking selectByUuid function
    selectByUuid.mockReturnValueOnce({ uuid: 'mockUuid' });

    // Execute the verify function
    const response = verify(req, hashionDb);

    // Assertions
    expect(response).toEqual(expect.objectContaining({ status: 200 }));
  });

  test.skip('should return a response with status 404 when UUID is not found in the database', () => {
    const req = { url: 'mockUrl' };
    const hashionDb = jest.fn();
    spyOn(global, 'Response').mockImplementationOnce(() => ({}));

    // Mocking URL object
    const mockUrl = {
      searchParams: {
        get: jest.fn().mockReturnValueOnce('mockUuid'),
      },
    };
    global.URL = jest.fn(() => mockUrl);

    // Mocking selectByUuid function
    selectByUuid.mockReturnValueOnce(null);

    // Execute the verify function
    const response = verify(req, hashionDb);

    // Assertions
    expect(response).toEqual(expect.objectContaining({ status: 404 }));
  });
});

// Tests for the 'hashnode' function
describe('hashnode function', () => {
  test.skip('should synchronize data between Notion and Hashnode for a specific user', () => {
    const req = { url: 'mockUrl' };
    const hashionDb = jest.fn();
    spyOn(global, 'Response').mockImplementationOnce(() => ({}));

    // Mocking URL object
    const mockUrl = {
      searchParams: {
        get: jest.fn(),
      },
    };
    global.URL = jest.fn(() => mockUrl);

    mockUrl.searchParams.get.mockReturnValueOnce('mockPublication');
    selectByUuid.mockReturnValueOnce({
      uuid: 'mockUuid',
      hashnode_publication: '',
      hashnode_key: '',
    });

    // Mocking console.log
    const mockConsoleLog = spyOn(console, 'log').mockImplementation(() => {});

    // Execute the hashnode function
    const response = hashnode(req, hashionDb);

    // Assertions
    expect(mockConsoleLog).toHaveBeenCalledWith('Synchronising user profile ', req);
    expect(response).toEqual(expect.objectContaining({ status: 200 }));
  });
});
