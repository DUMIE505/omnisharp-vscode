/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Cast expressions", () => {
        it("cast to built-in type in assignment", () => {
            const input = Input.InMethod(`var o = (object)42;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Type("object"),
                Token.Punctuation.CloseParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("cast to generic type in assignment", () => {
            const input = Input.InMethod(`var o = (C<int>)42;`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Punctuation.OpenParen,
                Token.Type("C"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("int"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.CloseParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("passed to invocation", () => {
            const input = Input.InMethod(`M((int)42);`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.Type("int"),
                Token.Punctuation.CloseParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });

        it("chained cast passed to invocation", () => {
            const input = Input.InMethod(`M((int)(object)42);`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.OpenParen,
                Token.Type("int"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenParen,
                Token.Type("object"),
                Token.Punctuation.CloseParen,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon
            ]);
        });
    });
});