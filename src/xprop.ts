import * as child_process from 'node:child_process';
import { checkCommand } from './utils/checkCommand';
import { canBeANumber } from './utils/canBeNumber';

export default class XPROP {
    constructor() {
        checkCommand('xprop')
            // .then((result) => {
            //         console.log('xprop is available');
            // })
            .catch((error) => {
                console.log('xprop is not available');
                // install xprop
            });
    }

    run() {
        child_process.exec('xprop', (error, stdout, _) => {
            if (error) {
                // console.log(error);
                return;
            }
            const params: { [key: string]: any; } = {};
            const lines = stdout.split('\n');
            // Map the lines to key value pairs
            for (const line of lines) {
                /*
                * Try to split the line by '=' to get the key value pair then trim the spaces
                * If the length is 2, then it is a key value pair
                * Else, it can be a key value pair separated by a colon
                */
                const keyvalue = line.split('=').map(it => it.trim());
                if (keyvalue.length === 2) {
                    const v = keyvalue[1].replace(/\t|"/g, '').trim();
                    params[keyvalue[0]] = canBeANumber(v, true);
                } else {
                    const [key, value] = keyvalue[0].split(':').map(it => it.trim().replace(/\t|\n/g, '~').trim());
                    if (key) {
                        if (canBeANumber(value)) {
                            params[key] = Number(value);
                        } else {
                            params[key] = value ? value : null;
                        }
                    }
                }
            }
            /**
             * for each key in params
             * if the value is a string and contains a comma
             * then split the string by comma and convert to array
             */
            let prevKey = '';
            for (const key of Object.keys(params)) {
                const value: string = params[key] || '';
                const arr = value.toString().split(',').map(it => it.trim());
                if (arr.length > 1) {
                    // Try to convert to number
                    params[key] = arr.map(a => {
                        if (canBeANumber(a)) {
                            return Number(a);
                        }
                        return a;
                    });
                }
                /**
                 * if the key contains a space and is not empty
                 * then it is a nested object
                 * if the previous object is an array then push the current object to the array else create a new array
                 */
                if (key.includes(' ') && key !== '') {
                    let currentValue = params[key];
                    const previousObj = params[prevKey];
                    /**
                     * if the current value is a string and contains 'by'
                     * then split the string by 'by' and convert to array
                     * eg: '1920 by 1080' => [1920, 1080]
                     */
                    if (typeof currentValue === 'string' && /\d by \d/g.test(currentValue)) {
                        currentValue = currentValue.split(' by ').map((it: string) => Number(it));
                    }
                    if (previousObj) {
                        if (Array.isArray(previousObj)) {
                            if (currentValue) {
                                previousObj.push({ [key]: currentValue });
                            } else {
                                previousObj.push(key);
                            }
                        } else {
                            if (currentValue) {
                                params[prevKey] = [previousObj, { [key]: currentValue }];
                            } else {
                                params[prevKey] = [previousObj, key];
                            }
                        }
                    } else {
                        if (currentValue) {
                            params[prevKey] = { [key]: currentValue };
                        } else {
                            params[prevKey] = key;
                        }
                        // params[prevKey] = [key];
                    }
                    delete params[key]; // remove the key
                    continue;
                }
                prevKey = key;
            }
            console.log('PARAMS =>', params);
        });
    }

    spy() {
        const stream = child_process.spawn('xprop', ['-spy', '-root', '_NET_ACTIVE_WINDOW']);
        stream.stdout.on('data', (data) => {
            console.log(data.toString());
        });

    }
}