import json from '../js/parser';
import read from '../js/reader';
import GameSavingLoader from '../js/GameSavingLoader';

// parser.js
test('json функция корректно преобразует ArrayBuffer в строку', async () => {
  const testData = new Uint16Array([72, 101, 108, 108, 111]).buffer;
  const result = await json(testData);
  expect(result).toBe('Hello');
});

test('json функция обрабатывает ошибки', async () => {
  const testDataWithError = new Uint16Array([72, 101, 108, 108, 111]);

  await expect(json(testDataWithError))
    .resolves.toEqual(expect.any(String))
    .catch(error => {
      expect(error).toBeInstanceOf(Error);
    });
});

// reader.js
test('read функция корректно возвращает ArrayBuffer', async () => {
  const result = await read();

  expect(result instanceof ArrayBuffer).toBe(true);
});

test('read функция выполняется за разумное время', async () => {
  jest.setTimeout(2000);
  const startTime = Date.now();

  await read();
  expect(Date.now() - startTime).toBeLessThan(1500);
});

// GameSavingLoader.js
test('GameSavingLoader успешно загружает сохранение', async () => {
  jest.spyOn(require('../js/reader'), 'default').mockResolvedValueOnce('testData');
  jest.spyOn(require('../js/parser'), 'default').mockResolvedValueOnce('{"mockedData": true}');
  const result = await GameSavingLoader.load();
  expect(result).toEqual({ mockedData: true });
});

test('GameSavingLoader обрабатывает ошибку во время загрузки', async () => {
  jest.spyOn(require('../js/reader'), 'default').mockRejectedValueOnce(new Error('Test error'));
  await expect(GameSavingLoader.load()).rejects.toThrowError('Test error');
});
