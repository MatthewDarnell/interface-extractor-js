'use strict';

import extractInterface from '../src/index.js';

describe('extractInterface', function () {
    
  const sourceText = `
    struct SecureQus_Withdraw {
      long long amount; // Amount description.
      bool testBool;
      char testChar;
      short testShort;
      signed int testInt;
      /*
        TestUint description.
      */
      /*
        Additional description.
      */
      unsigned int testUInt; // Additional description.
      char* testCharPtr;
    };

    struct Test() {
      long long test;
    };

    /*
      Test.
    */
    void SecureQus(Void effect) { // Test.

    };

    void SecureQus(SecureQus_Withdraw effect) {

    };

    void Test2() {
    };

    void SecureQus(
`;

  const actual = extractInterface('SecureQus', sourceText)

  assert({
    given: 'source text',
    should: 'return correct interface',
    actual,
    expected: {
      structures: [
        {
          col: 5,
          identifier: "SecureQus_Withdraw",
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
              identifier: "testShort",
              row: 6,
              type: "short",
            },
            {
              col: 7,
              identifier: "testInt",
              row: 7,
              type: "signed int",
            },
            {
              col: 7,
              comment: "TestUint description.\nAdditional description.\nAdditional description.",
              identifier: "testUInt",
              row: 14,
              type: "unsigned int",
            },
            {
              col: 7,
              identifier: "testCharPtr",
              row: 15,
              type: "char*",
            },
          ],
          row: 2,
        },
      ],
      functions: [
        {
          argument: {
            col: 20,
            identifier: "effect",
            row: 25,
            type: "Void"
          },
          col: 5,
          identifier: "SecureQus",
          row: 25,
          comment: "Test.\nTest.",
        },
        {
          argument: {
            col: 20,
            identifier: "effect",
            row: 29,
            type: "SecureQus_Withdraw",
          },
          col: 5,
          identifier: "SecureQus",
          row: 29,
        }
      ]
    },
  });
});
