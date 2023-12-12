import 'dotenv/config';
import { InstallGlobalCommands } from './services/discord/index.js';

// Simple test command
const TEST_COMMAND = {
  name: 'test2',
  description: 'Basic command test',
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);