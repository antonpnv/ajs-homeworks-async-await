import json from './parser';
import read from './reader';

export default class GameSavingLoader {
  static async load() {
    try {
      const data = await read();
      const parserData = await json(data);
      const saving = JSON.parse(parserData);
      return saving;
    } catch (error) {
      throw error;
    }
  }
}