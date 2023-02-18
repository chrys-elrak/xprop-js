import xprop from './src/xprop';

const x = new xprop();

// console.log(x.getWindow({ key: 'name', value: 'mailspring' }));
// console.log(x.getWindow({ key: 'id', value: '0x9400001' }));
x.root();
console.log(x.params);
