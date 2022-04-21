'use strict';

import extractInterface from '../src/index.js';

describe('extractInterface', function () {
    
  const sourceText = `
    struct SecureQus_Withdraw {
      long long amount; // Amount description.
      bool testBool;
      char testChar;
      /*
        TestUint description. 
      */
      unsigned int testUInt; // Additional TestUint description.
      char* testCharPtr;
    };
  `;

  const actual = extractInterface(sourceText)

  assert({
    given: 'source text',
    should: 'return correct interface',
    actual,
    expected: [
      {
        col: 5,
        identifier: "",
        members: [
          {
            col: 7,
            comment: "Amount description.",
            identifier: "amount",
            row: 3,
            type: "long long",
          },
          {
            col: 7,
            identifier: "testBool",
            row: 4,
            type: "bool",
          },
          {
            col: 7,
            identifier: "testChar",
            row: 5,
            type: "char",
          },
          {
            col: 7,
            comment: "TestUint description.\nAdditional TestUint description.",
            identifier: "testUInt",
            row: 9,
            type: "unsigned int",
          },
          {
            col: 7,
            identifier: "testCharPtr",
            row: 10,
            type: "char*",
          },
        ],
        row: 2,
      },
    ],
  });
});
