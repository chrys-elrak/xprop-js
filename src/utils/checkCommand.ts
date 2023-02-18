import * as child_process from 'node:child_process';

export function checkCommand(cmd: string = 'xprop'): Promise<boolean> {
  // Check if command is available
  // return true if it is
  // return false if it is not
  return new Promise((resolve, reject) => {
    child_process.exec(`command -v ${cmd}`, (error, stdout, stderr) => {
      if (error) {
        return reject(false);
      }
      return resolve(true);
    });
  });
}