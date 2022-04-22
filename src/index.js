'use strict';

import lexer from 'node-c-lexer';
import { tokenize } from 'node-c-lexer/lib/lex-unit';

const extractInterface = function (qubicName, sourceText) {
  const tokens = lexer.lexUnit.tokenize(sourceText);
  const extractedInterface = {
    structures: [],
    functions: [],
  };
  let structure = undefined;
  let member = undefined;
  let memberType = undefined;
  let lastMember = undefined;
  let comment = undefined;

  const extractType = function(token) {
    if (structure !== undefined && member === undefined) {
      member = {
        row: token.row,
        col: token.col,
      };
      if (comment !== undefined) {
        member.comment = comment;
        comment = undefined;
      }
    }
    
    memberType += memberType === '' ? token.lexeme : (token.lexeme === '*' ? '' : ' ') + token.lexeme;
  }

  const stripCommentIdentifiers = function (comment) {
    if (comment.slice(0, 2) === '//') {
      comment = comment.slice(2);
    } else {
      comment = comment.slice(2, -2);
    }
    return comment.trim();
  }

  tokens.forEach(function (token, i) {
    switch (token.tokenClass) {
      case 'STRUCT':
        structure = {
          identifier: '',
          members: [],
          row: token.row,
          col: token.col,
        }
        memberType = '';
        break;

      case 'COMMENT':
        if (comment !== undefined) {
          comment += "\n";
          comment += stripCommentIdentifiers(token.lexeme);
        } else {
          comment = stripCommentIdentifiers(token.lexeme);
        }

        if (token.row === lastMember.row) {
          if (lastMember.comment !== undefined) {
            lastMember.comment += "\n";
            lastMember.comment += comment;
          } else {
            lastMember.comment = comment;
          }
          comment = undefined;
        }
        break;

      case 'IDENTIFIER':
        if (structure?.identifier === '') {
          structure.identifier = token.lexeme;
        }

        if (member !== undefined && memberType !== undefined) {
          member.identifier = token.lexeme;
          member.type = memberType;
          memberType = undefined;
        }
        break;

      case 'SIGNED':
        extractType(token);
        break;

      case 'UNSIGNED':
        extractType(token);
        break;
  
      case 'BOOL':
        extractType(token);
        break;
  
      case 'CHAR':
        extractType(token);
        break;
    
      case 'SHORT':
        extractType(token);
        break;
  
      case 'INT':
        extractType(token);
        break;
  
      case 'LONG':
        extractType(token);
        break;
  
      case '*':
        extractType(token);
        break;

      case 'VOID':
        if (tokens[i + 1].lexeme.split('_')[0] === qubicName) {
          let j = i + 3;
          const arg = [];
          while (tokens[j].tokenClass !== ')') {
            arg.push(tokens[j])
            j++;
          }
          const fn = {
            row: token.row,
            col: token.col,
            identifier: tokens[i + 1].lexeme,
            argument: {
              row: arg[0].row,
              col: arg[0].col,
              type: arg.slice(0, -1).map(function (token) {
                return token.lexeme;
              }).join(' '),
              identifier: arg[arg.length - 1].lexeme,
            },
          }
          if (comment !== undefined) {
            fn.comment = comment;
            comment = undefined;
          }
          lastMember = fn;
          extractedInterface.functions.push(fn)
        }
        break;

      case '}':
        if (structure !== undefined) {
          if (structure.identifier.split('_')[0] === qubicName) {
            extractedInterface.structures.push(structure);
          }
          memberType = undefined;
          structure = undefined;
        }
        break;

      case ';':
        if (structure !== undefined && member !== undefined) {
          structure.members.push(member);
          lastMember = member;
          member = undefined;
        }
        memberType = '';
    }
  });

  return extractedInterface;
}

export default extractInterface;
