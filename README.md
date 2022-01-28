## object-sizeof

![Build Status](https://github.com/daneren2005/sizeof/actions/workflows/run-tests.yml/badge.svg)

[![NPM](https://nodei.co/npm/@daneren2005/object-sizeof.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/@daneren2005/object-sizeof)

### Get size of a JavaScript object in Bytes

JavaScript does not provide sizeof (like in C), and programmer does not need to care about memory allocation/deallocation. 

However, according to [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/), each String value is represented by 16-bit unsigned integer, Number uses  the double-precision 64-bit format IEEE 754 values including the special "Not-a-Number" (NaN) values, positive infinity, and negative infinity.

Having this knowledge, the module calculates how much memory object will allocate. 

### Limitations
Please note, that V8 which compiles the JavaScript into native machine code, is not taken into account, as the compiled code is additionally heavily optimized. 

### Installation

`npm install @daneren2005/object-sizeof`

### Examples

```javascript
  import sizeof from '@daneren2005/object-sizeof'
  
  // 2B per character, 6 chars total => 12B
  console.log(sizeof({abc: 'def'}))
  
  // 8B for Number => 8B
  console.log(sizeof(12345))
  
  const param = { 
    'a': 1, 
    'b': 2, 
    'c': {
      'd': 4
    }
  }
  // 4 one two-bytes char strings and 3 eighth-bytes numbers => 32B
  console.log(sizeof(param))
```

### Licence

The MIT License (MIT)
