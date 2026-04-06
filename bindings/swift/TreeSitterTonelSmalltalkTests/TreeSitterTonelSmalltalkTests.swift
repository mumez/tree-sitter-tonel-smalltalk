import XCTest
import SwiftTreeSitter
import TreeSitterTonelSmalltalk

final class TreeSitterTonelSmalltalkTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tonel_smalltalk())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading TonelSmalltalk grammar")
    }
}
