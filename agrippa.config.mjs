// @ts-check
import { defineConfig } from 'agrippa';
import {join} from 'path';

export default defineConfig({
  options: {
    typescript: true,
    baseDir: join("app", "components")
  }
});