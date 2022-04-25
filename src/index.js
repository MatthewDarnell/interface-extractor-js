'use strict';

import Parser from 'web-tree-sitter';

const extractInterface = async function (qubicName, sourceText) {
  await Parser.init();
  const parser = new Parser();
  const Lang = await Parser.Language.load('tree-sitter-cpp.wasm');
  parser.setLanguage(Lang);
  const tree = parser.parse(sourceText);

  const trimComment = function (comment) {
    if (comment.slice(0, 2) === '//') {
      comment = comment.slice(2);
    } else {
      comment = comment.slice(2, -2);
    }
    return comment.trim();
  }

  const structs = [];
  const functions = [];
  let comment;
  tree.rootNode.children.forEach(function (node) {
    switch (node.type) {
      case 'struct_specifier':
        const struct = {};
        node.children.forEach(function (node2) {
          switch (node2.type) {
            case 'type_identifier':
              struct.type = {
                text: node2.text,
                startIndex: node2.startIndex,
                endIndex: node2.endIndex,
                startPosition: node2.startPosition,
                endPosition: node2.endPosition,
              }
              break;
            
            case 'field_declaration_list':
              struct.fields = [];
              node2.children.forEach(function (node3) {
                switch (node3.type) {
                  case 'field_declaration':
                    const field = {};
                    node3.children.forEach(function (node4) {
                      switch (node4.type) {
                        case 'sized_type_specifier':
                          field.type = {
                            text: node4.text,
                            startIndex: node4.startIndex,
                            endIndex: node4.endIndex,
                            startPosition: node4.startPosition,
                            endPosition: node4.endPosition,
                          };
                          break;
                        
                        case 'primitive_type':
                          field.type = {
                            text: node4.text,
                            startIndex: node4.startIndex,
                            endIndex: node4.endIndex,
                            startPosition: node4.startPosition,
                            endPosition: node4.endPosition,
                          };
                          break;
                        
                        case 'pointer_declarator':
                          field.type.text += '*';
                          field.type.endIndex += node4.children[0].endIndex - node4.children[0].startIndex;
                          field.type.endPosition = node4.children[0].endPosition;
                          field.identifier = {
                            text: node4.children[1].text,
                            startIndex: node4.children[1].startIndex,
                            endIndex: node4.children[1].endIndex,
                            startPosition: node4.children[1].startPosition,
                            endPosition: node4.children[1].endPosition,
                          }
                          if (comment !== undefined) {
                            field.comment = comment;
                            comment = undefined;
                          }
                          break;
                      
                        case 'field_identifier':
                          field.identifier = {
                            text: node4.text,
                            startIndex: node4.startIndex,
                            endIndex: node4.endIndex,
                            startPosition: node4.startPosition,
                            endPosition: node4.endPosition,
                          }
                          if (comment !== undefined) {
                            field.comment = comment;
                            comment = undefined;
                          }
                      }
                    });
                    struct.fields.push(field)
                    break;
                  
                  case 'comment':
                    comment = comment !== undefined ? comment + "\n" + trimComment(node3.text) : trimComment(node3.text);
                    if (struct.fields.length > 0) {
                      if (node3.startPosition.row === struct.fields[struct.fields.length - 1].identifier.startPosition.row) {
                        struct.fields[struct.fields.length - 1].comment = 
                          struct.fields[struct.fields.length - 1].comment !== undefined 
                            ? struct.fields[struct.fields.length - 1].comment + "\n" + comment
                            : comment;
                        comment = undefined;
                      }
                    }
                }
              });
          }
        });
        
          if (struct.type.text.split('_')[0] === qubicName) {
            structs.push(struct);
          }
          break;
          
          case 'comment':
            comment = comment !== undefined ? comment + "\n" + trimComment(node.text) : trimComment(node.text);
            break;
          
          case 'declaration':
            if (node.children[0]?.type === 'primitive_type' && node.children[0]?.text === 'void') {
              const fn = {};

              if (comment !== undefined) {
                fn.comment = comment;
                comment = undefined;
              }

              fn.type = {
                text: node.children[0].text,
                startIndex: node.children[0].startIndex,
                endIndex: node.children[0].endIndex,
                startPosition: node.children[0].startPosition,
                endPosition: node.children[0].endPosition,
              }

              fn.identifier = {
                text: node.children[1].children[0].children[0].text,
                startIndex: node.children[1].children[0].children[0].startIndex,
                endIndex: node.children[1].children[0].children[0].endIndex,
                startPosition: node.children[1].children[0].children[0].startPosition,
                endPosition: node.children[1].children[0].children[0].endPosition,
              }

              fn.arguments = [];
              node.children[1].children[0].children[1].children.forEach(function (node2) {
                if (node2.type === 'parameter_declaration') {
                  fn.arguments.push({
                    type: {
                      text: node2.children[0].text,
                      startIndex: node2.children[0].startIndex,
                      endIndex: node2.children[0].endIndex,
                      startPosition: node2.children[0].startPosition,
                      endPosition: node2.children[0].endPosition,
                    },
                    identifier: {
                      text: node2.children[1].text,
                      startIndex: node2.children[1].startIndex,
                      endIndex: node2.children[1].endIndex,
                      startPosition: node2.children[1].startPosition,
                      endPosition: node2.children[1].endPosition,
                    }
                  })
                }
              });

              if (fn.identifier !== undefined && fn.identifier.text.split('_')[0] === qubicName) {
                functions.push(fn);
              }
          }
    }
  });

  return {
    structs,
    functions,
  };
}

export default extractInterface;
