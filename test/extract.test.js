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
      /*
        Test ptr.
      */
      char* testCharPtr;
      char* testCharPtr2;
    };

    struct SecureQus_Withdraw2 {
      // Test.
    };

    struct Test {
      long long test;
    };

    /*
      Test.
    */
    /*
      Test2.
    */
    void SecureQus(Void effect) {

    };

    void SecureQus(SecureQus_Withdraw effect) {

    };

    int Test2() {

    };

    void Test3() {
    };

    void SecureQus(
`;

  const awaitActual = extractInterface('SecureQus', sourceText)

  assert({
    given: 'source text',
    should: 'return correct interface',
    awaitActual,
    expected:    {
      "structs": [
        {
          "type": {
            "text": "SecureQus_Withdraw",
            "startIndex": 12,
            "endIndex": 30,
            "startPosition": {
              "row": 1,
              "column": 11
            },
            "endPosition": {
              "row": 1,
              "column": 29
            }
          },
          "fields": [
            {
              "type": {
                "text": "long long",
                "startIndex": 39,
                "endIndex": 48,
                "startPosition": {
                  "row": 2,
                  "column": 6
                },
                "endPosition": {
                  "row": 2,
                  "column": 15
                }
              },
              "identifier": {
                "text": "amount",
                "startIndex": 49,
                "endIndex": 55,
                "startPosition": {
                  "row": 2,
                  "column": 16
                },
                "endPosition": {
                  "row": 2,
                  "column": 22
                }
              },
              "comment": "Amount description."
            },
            {
              "type": {
                "text": "bool",
                "startIndex": 86,
                "endIndex": 90,
                "startPosition": {
                  "row": 3,
                  "column": 6
                },
                "endPosition": {
                  "row": 3,
                  "column": 10
                }
              },
              "identifier": {
                "text": "testBool",
                "startIndex": 91,
                "endIndex": 99,
                "startPosition": {
                  "row": 3,
                  "column": 11
                },
                "endPosition": {
                  "row": 3,
                  "column": 19
                }
              }
            },
            {
              "type": {
                "text": "char",
                "startIndex": 107,
                "endIndex": 111,
                "startPosition": {
                  "row": 4,
                  "column": 6
                },
                "endPosition": {
                  "row": 4,
                  "column": 10
                }
              },
              "identifier": {
                "text": "testChar",
                "startIndex": 112,
                "endIndex": 120,
                "startPosition": {
                  "row": 4,
                  "column": 11
                },
                "endPosition": {
                  "row": 4,
                  "column": 19
                }
              }
            },
            {
              "type": {
                "text": "short",
                "startIndex": 128,
                "endIndex": 133,
                "startPosition": {
                  "row": 5,
                  "column": 6
                },
                "endPosition": {
                  "row": 5,
                  "column": 11
                }
              },
              "identifier": {
                "text": "testShort",
                "startIndex": 134,
                "endIndex": 143,
                "startPosition": {
                  "row": 5,
                  "column": 12
                },
                "endPosition": {
                  "row": 5,
                  "column": 21
                }
              }
            },
            {
              "type": {
                "text": "signed int",
                "startIndex": 151,
                "endIndex": 161,
                "startPosition": {
                  "row": 6,
                  "column": 6
                },
                "endPosition": {
                  "row": 6,
                  "column": 16
                }
              },
              "identifier": {
                "text": "testInt",
                "startIndex": 162,
                "endIndex": 169,
                "startPosition": {
                  "row": 6,
                  "column": 17
                },
                "endPosition": {
                  "row": 6,
                  "column": 24
                }
              }
            },
            {
              "type": {
                "text": "unsigned int",
                "startIndex": 275,
                "endIndex": 287,
                "startPosition": {
                  "row": 13,
                  "column": 6
                },
                "endPosition": {
                  "row": 13,
                  "column": 18
                }
              },
              "identifier": {
                "text": "testUInt",
                "startIndex": 288,
                "endIndex": 296,
                "startPosition": {
                  "row": 13,
                  "column": 19
                },
                "endPosition": {
                  "row": 13,
                  "column": 27
                }
              },
              "comment": "TestUint description.\nAdditional description.\nAdditional description."
            },
            {
              "type": {
                "text": "char*",
                "startIndex": 367,
                "endIndex": 372,
                "startPosition": {
                  "row": 17,
                  "column": 6
                },
                "endPosition": {
                  "row": 17,
                  "column": 11
                }
              },
              "identifier": {
                "text": "testCharPtr",
                "startIndex": 373,
                "endIndex": 384,
                "startPosition": {
                  "row": 17,
                  "column": 12
                },
                "endPosition": {
                  "row": 17,
                  "column": 23
                }
              },
              "comment": "Test ptr."
            },
            {
              "type": {
                "text": "char*",
                "startIndex": 392,
                "endIndex": 397,
                "startPosition": {
                  "row": 18,
                  "column": 6
                },
                "endPosition": {
                  "row": 18,
                  "column": 11
                }
              },
              "identifier": {
                "text": "testCharPtr2",
                "startIndex": 398,
                "endIndex": 410,
                "startPosition": {
                  "row": 18,
                  "column": 12
                },
                "endPosition": {
                  "row": 18,
                  "column": 24
                }
              }
            }
          ]
        },
        {
          "type": {
            "text": "SecureQus_Withdraw2",
            "startIndex": 431,
            "endIndex": 450,
            "startPosition": {
              "row": 21,
              "column": 11
            },
            "endPosition": {
              "row": 21,
              "column": 30
            }
          },
          "fields": []
        }
      ],
      "functions": [
        {
          "comment": "Test.\nTest2.",
          "type": {
            "text": "void",
            "startIndex": 581,
            "endIndex": 585,
            "startPosition": {
              "row": 35,
              "column": 4
            },
            "endPosition": {
              "row": 35,
              "column": 8
            }
          },
          "identifier": {
            "text": "SecureQus",
            "startIndex": 586,
            "endIndex": 595,
            "startPosition": {
              "row": 35,
              "column": 9
            },
            "endPosition": {
              "row": 35,
              "column": 18
            }
          },
          "arguments": [
            {
              "type": {
                "text": "Void",
                "startIndex": 596,
                "endIndex": 600,
                "startPosition": {
                  "row": 35,
                  "column": 19
                },
                "endPosition": {
                  "row": 35,
                  "column": 23
                }
              },
              "identifier": {
                "text": "effect",
                "startIndex": 601,
                "endIndex": 607,
                "startPosition": {
                  "row": 35,
                  "column": 24
                },
                "endPosition": {
                  "row": 35,
                  "column": 30
                }
              }
            }
          ]
        },
        {
          "type": {
            "text": "void",
            "startIndex": 624,
            "endIndex": 628,
            "startPosition": {
              "row": 39,
              "column": 4
            },
            "endPosition": {
              "row": 39,
              "column": 8
            }
          },
          "identifier": {
            "text": "SecureQus",
            "startIndex": 629,
            "endIndex": 638,
            "startPosition": {
              "row": 39,
              "column": 9
            },
            "endPosition": {
              "row": 39,
              "column": 18
            }
          },
          "arguments": [
            {
              "type": {
                "text": "SecureQus_Withdraw",
                "startIndex": 639,
                "endIndex": 657,
                "startPosition": {
                  "row": 39,
                  "column": 19
                },
                "endPosition": {
                  "row": 39,
                  "column": 37
                }
              },
              "identifier": {
                "text": "effect",
                "startIndex": 658,
                "endIndex": 664,
                "startPosition": {
                  "row": 39,
                  "column": 38
                },
                "endPosition": {
                  "row": 39,
                  "column": 44
                }
              }
            }
          ]
        }
      ]
    }
  });
});
