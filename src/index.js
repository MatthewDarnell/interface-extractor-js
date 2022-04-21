'use strict';

import lexer from 'node-c-lexer';

const extractInterface = function (sourceText) {
  const tokens = lexer.lexUnit.tokenize(sourceText);
  const extractedInterface = [];
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

    if (memberType !== undefined) {
      memberType += memberType === '' ? token.lexeme : (token.lexeme === '*' ? '' : ' ') + token.lexeme;
    }
  }

  const stripCommentIdentifiers = function (comment) {
    if (comment.slice(0, 2) === '//') {
      comment = comment.slice(2);
    } else if (comment.slice(0, 2) === '/*') {
      comment = comment.slice(2, -2);
    }
    return comment.trim();
  }

  tokens.forEach(function (token) {

    switch (token.tokenClass) {
      case 'STRUCT':
        if (structure === undefined) {
          structure = {
            identifier: '',
            members: [],
            row: token.row,
            col: token.col,
          }
          memberType = '';
        }
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
        if (structure?.lexeme === '') {
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

      case '}':
        if (structure !== undefined) {
          if (structure.members.length > 0) {
            extractedInterface.push(structure);
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
