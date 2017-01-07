/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => should());

    describe("Element access expressions", () => {
        it("no arguments", () => {
            const input = Input.InMethod(`var o = P[];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("one argument", () => {
            const input = Input.InMethod(`var o = P[42];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("two arguments", () => {
            const input = Input.InMethod(`var o = P[19, 23];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("two named arguments", () => {
            const input = Input.InMethod(`var o = P[x: 19, y: 23];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Variables.Parameter("x"),
                Token.Punctuation.Colon,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Variables.Parameter("y"),
                Token.Punctuation.Colon,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref argument", () => {
            const input = Input.InMethod(`var o = P[ref x];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("out argument", () => {
            const input = Input.InMethod(`var o = P[out x];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Keywords.Modifiers.Out,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("member of generic with no arguments", () => {
            const input = Input.InMethod(`var o = C<int>.P[];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Object("C"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("int"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });

        it("member of qualified generic with no arguments", () => {
            const input = Input.InMethod(`var o = N.C<int>.P[];`);
            const tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Type("var"),
                Token.Variables.Local("o"),
                Token.Operators.Assignment,
                Token.Variables.Object("N"),
                Token.Punctuation.Accessor,
                Token.Variables.Object("C"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Type("int"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Variables.Property("P"),
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon
            ]);
        });
    });
});